import { getComments } from '../api/get-comments';
import { getUserById } from '../api/get-user-by-id';

export const fetchComments = async (postId) => {
	const comments = await getComments(postId);
	
	// Получаем информацию об авторах для каждого комментария
	const commentsWithAuthors = await Promise.all(
		comments.map(async (comment) => {
			if (!comment.authorId) {
				return {
					...comment,
					author: 'Unknown',
				};
			}
			const author = await getUserById(comment.authorId);
			return {
				...comment,
				author: author ? author.login : 'Unknown',
			};
		})
	);

	return {
		error: null,
		res: commentsWithAuthors,
	};
};

