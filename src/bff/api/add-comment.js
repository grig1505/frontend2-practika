export const addComment = async (commentData) =>
	fetch('http://localhost:3005/comments', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(commentData),
	}).then((response) => response.json());

