import { transformPost } from '../transformers';

export const getPosts = () =>
	fetch('http://localhost:3005/posts')
		.then((response) => response.json())
		.then((posts) => posts && posts.map(transformPost));

