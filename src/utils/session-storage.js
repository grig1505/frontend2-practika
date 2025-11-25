const USER_STORAGE_KEY = 'app_user_session';

const hasSessionStorage = () => typeof window !== 'undefined' && !!window.sessionStorage;

export const loadUserFromSession = () => {
	if (!hasSessionStorage()) {
		return null;
	}

	try {
		const stored = window.sessionStorage.getItem(USER_STORAGE_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch {
		return null;
	}
};

export const saveUserToSession = (user) => {
	if (!hasSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
	} catch {
		/* ignore write errors */
	}
};

export const clearUserFromSession = () => {
	if (!hasSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.removeItem(USER_STORAGE_KEY);
	} catch {
		/* ignore */
	}
};

