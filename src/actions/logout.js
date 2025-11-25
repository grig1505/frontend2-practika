import { ACTION_TYPE } from './action-type';
import { server } from '../bff/server';

export const logout = (session) => {
	return async (dispatch) => {
		try {
			await server.logout(session);
		} catch (error) {
			console.error('Ошибка при выходе:', error);
		}

		dispatch({
			type: ACTION_TYPE.LOGOUT,
		});
	};
};
