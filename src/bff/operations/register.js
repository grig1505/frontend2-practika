import { getUser } from '../api';
import { addUser } from '../api';
import { sessions } from '../sessions';
export const register = async (regLogin, regPassword) => {
	const existedUser = await getUser(regLogin);

	if (existedUser) {
		return {
			error: 'Такой пользователей уже существует',
			res: null,
		};
	}
	const user = await addUser(regLogin, regPassword);

	return {
		error: null,
		res: {
			session: sessions.create(user),
			login: user.login,
			id: user.id,
			roleId: user.role_id,
		},
	};
};
