import { ROLE } from '../constants';
import { updateUser } from '../api';
import { sessions } from '../sessions';

export const updateUserRole = async (userSession, userId, roleId) => {
	const accessRoles = [ROLE.ADMIN];
	if (!(await sessions.access(userSession, accessRoles))) {
		return {
			error: 'Доступ запрещен',
			res: null,
		};
	}

	try {
		// json-server может работать как со строками, так и с числами
		// Пробуем сначала как строку (как в db.json), если не работает - как число
		const userIdToUse = String(userId);
		console.log('Обновление роли пользователя:', { userId, userIdToUse, roleId });

		const updatedUser = await updateUser(userIdToUse, { role_id: Number(roleId) });

		if (!updatedUser) {
			console.error('Пользователь не найден после обновления:', userIdToUse);
			return {
				error: `Пользователь с id "${userIdToUse}" не найден`,
				res: null,
			};
		}

		return {
			error: null,
			res: updatedUser,
		};
	} catch (error) {
		console.error('Ошибка в updateUserRole:', error);
		return {
			error: error.message || 'Не удалось обновить роль пользователя',
			res: null,
		};
	}
};

