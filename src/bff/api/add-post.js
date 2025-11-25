export const addPost = async (postData) =>
	fetch('http://localhost:3005/posts', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(postData),
	}).then((response) => response.json());

