export const transformUser = (user) => {
	return {
		id: user.id,
		login: user.login,
		password: user.password,
		registeredAt: user.registered_at ?? user.registed_at ?? user.registred_at ?? '',
		roleId: Number(user.role_id ?? user.roleId),
	};
};