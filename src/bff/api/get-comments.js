import { transformComment } from '../transformers';

export const getComments = async (postId) =>
	fetch(`http://localhost:3005/comments?postId=${postId}`)
		.then((response) => response.json())
		.then((comments) => comments && comments.map(transformComment));

