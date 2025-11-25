import { getSession, saveSession, deleteSession } from './api';

export const sessions = {
	list: {}, // Кэш в памяти для быстрого доступа
	async create(user) {
		const hash = Math.random().toString(36).substring(2);
		const roleId = Number(user.roleId ?? user.role_id);
		const sessionData = {
			...user,
			roleId,
			role_id: roleId,
		};
		
		// Сохраняем в памяти
		this.list[hash] = sessionData;
		
		// Сохраняем в БД
		try {
			await saveSession({
				hash,
				user_id: user.id,
				login: user.login,
				role_id: roleId,
			});
		} catch (error) {
			console.error('Ошибка сохранения сессии в БД:', error);
		}
		
		return hash;
	},
	async restore(sessionHash, user) {
		if (sessionHash && user) {
			const roleId = Number(user.roleId ?? user.role_id);
			const sessionData = {
				...user,
				roleId,
				role_id: roleId,
			};
			this.list[sessionHash] = sessionData;
			
			// Сохраняем в БД если еще нет
			try {
				const existingSession = await getSession(sessionHash);
				if (!existingSession) {
					await saveSession({
						hash: sessionHash,
						user_id: user.id,
						login: user.login,
						role_id: roleId,
					});
				}
			} catch (error) {
				console.error('Ошибка восстановления сессии в БД:', error);
			}
		}
	},
	async get(hash) {
		if (!hash) {
			console.log('sessions.get: hash не предоставлен');
			return null;
		}
		
		// Сначала проверяем кэш в памяти
		if (this.list[hash]) {
			console.log('sessions.get: сессия найдена в памяти', this.list[hash]);
			return this.list[hash];
		}
		
		// Если нет в памяти, загружаем из БД
		try {
			console.log('sessions.get: загрузка сессии из БД, hash:', hash);
			const dbSession = await getSession(hash);
			console.log('sessions.get: сессия из БД:', dbSession);
			
			if (dbSession) {
				// Восстанавливаем в памяти
				this.list[hash] = {
					id: dbSession.user_id,
					login: dbSession.login,
					roleId: Number(dbSession.role_id),
					role_id: Number(dbSession.role_id),
				};
				console.log('sessions.get: сессия восстановлена в памяти', this.list[hash]);
				return this.list[hash];
			}
		} catch (error) {
			console.error('Ошибка загрузки сессии из БД:', error);
		}
		
		console.log('sessions.get: сессия не найдена');
		return null;
	},
	async remove(hash) {
		// Удаляем из памяти
		delete this.list[hash];
		
		// Удаляем из БД
		try {
			const dbSession = await getSession(hash);
			if (dbSession && dbSession.id) {
				await deleteSession(dbSession.id);
			}
		} catch (error) {
			console.error('Ошибка удаления сессии из БД:', error);
		}
	},
	async access(hash, accessRoles) {
		if (!hash) {
			return false;
		}
		const user = await this.get(hash);
		if (!user) {
			return false;
		}
		const userRoleId = Number(user.roleId ?? user.role_id);
		const normalizedAccessRoles = accessRoles.map((role) => Number(role));
		return normalizedAccessRoles.includes(userRoleId);
	},
};
