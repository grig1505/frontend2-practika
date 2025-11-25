import { ACTION_TYPE } from './action-type';
export const SetUser = (user) => ({
	type: ACTION_TYPE.SET_USER,
	payload: user,
});
