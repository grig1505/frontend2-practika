import { ROLE } from '../constants';
import { getUsers } from '../api';
import { sessions } from '../sessions';

export const fetchUsers = async (userSession) => {
	const accessRoles = [ROLE.ADMIN];
	if (!(await sessions.access(userSession, accessRoles))) {
		return {
			error: 'Доступ запрещен',
			res: null,
		};
	}
	const users = await getUsers();

	return {
		error: null,
		res: users,
	};
};
