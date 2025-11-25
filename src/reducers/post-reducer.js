import { ACTION_TYPE } from '../actions/action-type';

const initialPostState = {
	id: '',
	title: '',
	imageUrl: '',
	content: '',
	publishedAt: '',
	comments: [],
};
export const postReducer = (state = initialPostState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_POST_DATA:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
