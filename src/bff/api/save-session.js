export const saveSession = async (sessionData) =>
	fetch('http://localhost:3005/sessions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(sessionData),
	}).then((response) => response.json());

