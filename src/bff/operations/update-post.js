import { updatePost as updatePostAPI } from '../api/update-post';
import { sessions } from '../sessions';
import { ROLE } from '../constants';

export const updatePost = async (userSession, postId, postData) => {
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
			error: 'Только администратор или модератор может редактировать статьи',
			res: null,
		};
	}

	const updatedPostData = {
		title: postData.title,
		image_url: postData.imageUrl || '',
		content: postData.content,
	};

	try {
		const updatedPost = await updatePostAPI(postId, updatedPostData);
		return {
			error: null,
			res: updatedPost,
		};
	} catch (error) {
		console.error('Ошибка при обновлении статьи:', error);
		return {
			error: error.message || 'Ошибка при обновлении статьи',
			res: null,
		};
	}
};

