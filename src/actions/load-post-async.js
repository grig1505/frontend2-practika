import { setPostData } from './set-post-data';
import { fetchPost } from '../bff/operations';



export const loadPostAsync = (requestServer, postId) => (dispatch) => {
	requestServer('fetchPost', postId).then((postData) => {
		dispatch(setPostData(postData.res));
	});
};