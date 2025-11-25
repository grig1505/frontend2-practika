import { ROLE } from '../constants';
import { deleteUser } from '../api';
import { sessions } from '../sessions';

export const removeUser = async (userSession, userId) => {
	const accessRoles = [ROLE.ADMIN];
	if (!(await sessions.access(userSession, accessRoles))) {
		return {
			error: 'Доступ запрещен',
			res: null,
		};
	}

	try {
		const userIdToUse = String(userId);
		console.log('Удаление пользователя:', { userId, userIdToUse });

		await deleteUser(userIdToUse);

		console.log('Пользователь успешно удалён:', userIdToUse);
		return {
			error: null,
			res: { id: userId },
		};
	} catch (error) {
		console.error('Ошибка в removeUser:', error);
		return {
			error: error.message || 'Не удалось удалить пользователя',
			res: null,
		};
	}
};

