import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import {
	appReduser,
	userReducer,
	usersReducer,
	postReducer,
	postsReducer,
} from './reducers';
import { clearUserFromSession, loadUserFromSession, saveUserToSession } from './utils';
import { sessions } from './bff/sessions';

const reducer = combineReducers({
	app: appReduser,
	user: userReducer,
	users: usersReducer,
	post: postReducer,
	posts: postsReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

// Восстанавливаем сессию из sessionStorage при загрузке
const persistedUser = loadUserFromSession();
if (persistedUser?.session) {
	// Восстанавливаем сессию с теми же данными, что были сохранены
	sessions.restore(persistedUser.session, {
		id: persistedUser.id,
		login: persistedUser.login,
		roleId: Number(persistedUser.roleId),
		role_id: Number(persistedUser.roleId),
	});
}

let prevUser = store.getState().user;

store.subscribe(() => {
	const { user } = store.getState();
	const serializedUser = JSON.stringify(user);
	const prevSerializedUser = JSON.stringify(prevUser);

	if (prevSerializedUser === serializedUser) {
		return;
	}

	if (user?.session) {
		saveUserToSession(user);
	} else if (prevUser?.session) {
		// При logout удаляем сессию из sessions.list и очищаем sessionStorage
		sessions.remove(prevUser.session);
		clearUserFromSession();
	}

	prevUser = user;
});
