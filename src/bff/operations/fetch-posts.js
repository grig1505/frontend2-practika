import { getPosts } from '../api/get-posts';

export const fetchPosts = async () => {
	const posts = await getPosts();

	// Загружаем все комментарии для подсчета
	let comments = [];
	try {
		const commentsResponse = await fetch('http://localhost:3005/comments');
		comments = await commentsResponse.json();
	} catch (error) {
		console.error('Ошибка загрузки комментариев:', error);
	}

	// Добавляем количество комментариев к каждому посту
	const postsWithComments = (posts || []).map((post) => {
		const commentsCount = comments.filter(
			(comment) => comment.postId === post.id || comment.postId === String(post.id)
		).length;
		return {
			...post,
			commentsCount,
		};
	});

	return {
		error: null,
		res: postsWithComments,
	};
};

