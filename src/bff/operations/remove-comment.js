import { deleteComment } from '../api/delete-comment';
import { sessions } from '../sessions';
import { ROLE } from '../constants';
import { getUserById } from '../api/get-user-by-id';

export const removeComment = async (userSession, commentId, commentAuthorId) => {
	const user = await sessions.get(userSession);
	
	if (!user || !user.id) {
		return {
			error: 'Пользователь не авторизован',
			res: null,
		};
	}

	// Проверяем права: администратор, модератор или автор комментария
	const isAdmin = user.roleId === ROLE.ADMIN;
	const isModerator = user.roleId === ROLE.MODERATOR;
	const isAuthor = String(user.id) === String(commentAuthorId);

	if (!isAdmin && !isModerator && !isAuthor) {
		return {
			error: 'Недостаточно прав для удаления комментария',
			res: null,
		};
	}

	try {
		await deleteComment(commentId);
		return {
			error: null,
			res: { success: true },
		};
	} catch (error) {
		return {
			error: error.message || 'Ошибка при удалении комментария',
			res: null,
		};
	}
};

