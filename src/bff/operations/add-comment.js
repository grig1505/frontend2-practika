import { addComment } from '../api/add-comment';
import { sessions } from '../sessions';

export const addCommentOperation = async (userSession, commentData) => {
	console.log('addCommentOperation вызвана с сессией:', userSession);
	
	if (!userSession) {
		return {
			error: 'Сессия не найдена',
			res: null,
		};
	}

	const user = await sessions.get(userSession);
	console.log('Пользователь из сессии:', user);
	
	if (!user || !user.id) {
		return {
			error: 'Пользователь не авторизован',
			res: null,
		};
	}

	const newComment = {
		...commentData,
		author_id: String(user.id),
		publishedAt: new Date().toISOString().split('T')[0],
	};

	try {
		const createdComment = await addComment(newComment);
		return {
			error: null,
			res: createdComment,
		};
	} catch (error) {
		console.error('Ошибка при создании комментария:', error);
		return {
			error: error.message || 'Ошибка при создании комментария',
			res: null,
		};
	}
};

