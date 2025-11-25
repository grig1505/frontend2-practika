import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { server } from '../bff/server';
import { selectUserSession } from '../components/selectors';

export const useServerRequest = () => {
	const session = useSelector(selectUserSession);

	return useCallback(
		(operation, ...params) => {
			if (typeof server[operation] !== 'function') {
				throw new Error(`Операция "${operation}" не найдена на сервере`);
			}

			const requestParams = ['register', 'authorize','fetchPost', 'fetchPosts', 'fetchComments'].includes(operation)
				? params
				: [session, ...params];

			return server[operation](...requestParams);
		},
		[session]
	);
};
