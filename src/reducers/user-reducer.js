import { ACTION_TYPE } from '../actions';
import { ROLE } from '../constants';
import { loadUserFromSession } from '../utils';

const persistedUser = loadUserFromSession();

const initialUserState = persistedUser ?? {
	session: null,
	login: null,
	id: null,
	roleId: ROLE.GUEST,
};

// Чистое начальное состояние для logout (без persistedUser)
const cleanInitialUserState = {
	session: null,
	login: null,
	id: null,
	roleId: ROLE.GUEST,
};

export const userReducer = (state = initialUserState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_USER: {
			return {
				...state,
				...action.payload,
			};
		}
		case ACTION_TYPE.LOGOUT:
			return cleanInitialUserState;

		default:
			return state;
	}
};
