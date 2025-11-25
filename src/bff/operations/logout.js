import { sessions } from '../sessions';
export const logout = async (userSession) => {
	await sessions.remove(userSession);
};
