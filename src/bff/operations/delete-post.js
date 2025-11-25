import { deletePost as deletePostAPI } from '../api/delete-post';
import { sessions } from '../sessions';
import { ROLE } from '../constants';

export const deletePost = async (userSession, postId) => {
	if (!userSession) {
		return {
			error: 'Сессия не найдена',
			res: null,
		};
	}

	const user = await sessions.get(userSession);
	
	if (!user || !user.id) {
		return {
			error: 'Пользователь не авторизован',
			res: null,
		};
	}

	// Проверяем, что пользователь - администратор или модератор
	if (user.roleId !== ROLE.ADMIN && user.roleId !== ROLE.MODERATOR) {
		return {
			error: 'Только администратор или модератор может удалять статьи',
			res: null,
		};
	}

	try {
		await deletePostAPI(postId);
		return {
			error: null,
			res: true,
		};
	} catch (error) {
		console.error('Ошибка при удалении статьи:', error);
		return {
			error: error.message || 'Ошибка при удалении статьи',
			res: null,
		};
	}
};

