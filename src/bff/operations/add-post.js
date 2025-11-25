import { addPost as addPostAPI } from '../api/add-post';
import { sessions } from '../sessions';
import { ROLE } from '../constants';

export const addPost = async (userSession, postData) => {
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

	// Проверяем, что пользователь - администратор
	if (user.roleId !== ROLE.ADMIN) {
		return {
			error: 'Только администратор может добавлять статьи',
			res: null,
		};
	}

	const newPost = {
		title: postData.title,
		image_url: postData.imageUrl || '',
		content: postData.content,
		publishedAt: new Date().toISOString().split('T')[0],
	};

	try {
		const createdPost = await addPostAPI(newPost);
		return {
			error: null,
			res: createdPost,
		};
	} catch (error) {
		console.error('Ошибка при создании статьи:', error);
		return {
			error: error.message || 'Ошибка при создании статьи',
			res: null,
		};
	}
};

