import { ROLE } from '../constants';
import { getRoles } from '../api';
import { sessions } from '../sessions';

export const fetchRoles = async (userSession) => {
	const accessRoles = [ROLE.ADMIN];
	if (!(await sessions.access(userSession, accessRoles))) {
		return {
			error: 'Доступ запрещен',
			res: null,
		};
	}
	const roles = await getRoles();

	return {
		error: null,
		res: roles,
	};
};
