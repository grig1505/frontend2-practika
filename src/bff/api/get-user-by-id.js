import { transformUser } from '../transformers';

export const getUserById = async (userId) =>
	fetch(`http://localhost:3005/users/${userId}`)
		.then((response) => response.json())
		.then((user) => user && transformUser(user));

