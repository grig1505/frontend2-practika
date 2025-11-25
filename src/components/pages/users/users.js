import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Content, H2 } from '../..';
import { ROLE } from '../../../constants';
import { TableRow, UserRow } from './components';
import { useServerRequest } from '../../../hooks';
//import { server } from '../../../bff/server';
//import { getUsers } from '../../../bff/api/get-users';

const UsersContainer = ({ className }) => {
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [savingUsers, setSavingUsers] = useState({});
	const [deletingUsers, setDeletingUsers] = useState({});

	const requestServer = useServerRequest();

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			setErrorMessage(null);

			const [rolesResponse, usersResponse] = await Promise.all([
				requestServer('fetchRoles'),
				requestServer('fetchUsers'),
			]);

			if (!isMounted) {
				return;
			}

			if (rolesResponse.error || usersResponse.error) {
				setErrorMessage(rolesResponse.error || usersResponse.error);
				return;
			}

			setRoles(rolesResponse.res || []);
			setUsers(
				(usersResponse.res || []).map((user) => {
					const normalizedRoleId = Number(user.roleId);

					return {
						...user,
						roleId: normalizedRoleId,
						initialRoleId: normalizedRoleId,
					};
				})
			);
		};

		fetchData().catch((error) => {
			if (isMounted) {
				setErrorMessage(`Ошибка запроса: ${error.message}`);
			}
		});

		return () => {
			isMounted = false;
		};
	}, [requestServer]);
	const filteredRoles = useMemo(() => roles.filter((role) => role.id !== ROLE.GUEST), [roles]);

	const handleRoleChange = (userId, roleId) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				String(user.id) === String(userId) ? { ...user, roleId: Number(roleId) } : user
			)
		);
	};

	const handleUserSave = async (userId, overrideRoleId) => {
		const targetUser = users.find(({ id }) => String(id) === String(userId));

		if (!targetUser) {
			setErrorMessage('Пользователь не найден');
			return;
		}

		const initialRoleId = Number(targetUser.initialRoleId);
		const roleIdFromState = Number(targetUser.roleId);
		const nextRoleId =
			typeof overrideRoleId === 'number' ? Number(overrideRoleId) : roleIdFromState;

		if (nextRoleId === initialRoleId) {
			return;
		}

		setErrorMessage(null);
		setSavingUsers((prev) => ({ ...prev, [userId]: true }));

		console.log('Сохранение роли:', { userId, userIdString: String(userId), nextRoleId, targetUser });

		try {
			const response = await requestServer('updateUserRole', String(userId), nextRoleId);
			console.log('Ответ сервера:', response);

			if (!response) {
				setErrorMessage('Не получен ответ от сервера');
				return;
			}

			const { error, res } = response;

			if (error) {
				setErrorMessage(error);
				return;
			}

			if (!res) {
				setErrorMessage('Не удалось обновить роль пользователя');
				return;
			}

			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					String(user.id) === String(userId)
						? {
								...user,
								...res,
								roleId: Number(res.roleId),
								initialRoleId: Number(res.roleId),
							}
						: user
				)
			);
		} catch (error) {
			console.error('Ошибка при сохранении роли:', error);
			setErrorMessage(`Ошибка запроса: ${error.message || error}`);
		} finally {
			setSavingUsers((prev) => {
				const { [userId]: omit, ...rest } = prev;
				return rest;
			});
		}
	};

	const handleUserDelete = async (userId) => {
		if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
			return;
		}

		setErrorMessage(null);
		setDeletingUsers((prev) => ({ ...prev, [userId]: true }));

		console.log('Удаление пользователя:', { userId, userIdString: String(userId) });

		try {
			const response = await requestServer('removeUser', String(userId));
			console.log('Ответ сервера при удалении:', response);

			if (!response) {
				setErrorMessage('Не получен ответ от сервера');
				return;
			}

			const { error } = response;

			if (error) {
				setErrorMessage(error);
				return;
			}

			setUsers((prevUsers) => {
				const filtered = prevUsers.filter((user) => String(user.id) !== String(userId));
				console.log('Пользователи после удаления:', filtered.length);
				return filtered;
			});
		} catch (error) {
			console.error('Ошибка при удалении пользователя:', error);
			setErrorMessage(`Ошибка запроса: ${error.message || error}`);
		} finally {
			setDeletingUsers((prev) => {
				const { [userId]: omit, ...rest } = prev;
				return rest;
			});
		}
	};

	return (
		<div className={className}>
			<Content error={errorMessage}>
			<H2>Пользователи</H2>
			<div className="table">
				<TableRow>
					<div className="login-column">Логин</div>
					<div className="login-redat">Дата регистрации</div>
					<div className="login-role">Роль</div>
				</TableRow>

				{users.map(({ login, id, registeredAt, roleId, initialRoleId }) => {
					const isSaving = !!savingUsers[id];
					const isDeleting = !!deletingUsers[id];
					const resolvedRoleId = roleId;
					const baseRoles = filteredRoles;
					const currentRole = roles.find((role) => role.id === resolvedRoleId);
					const rolesForUser = baseRoles.some((role) => role.id === resolvedRoleId)
						? baseRoles
						: currentRole
						? [...baseRoles, currentRole]
						: baseRoles;

					return (
						<UserRow
							key={id}
							id={id}
							login={login}
							registeredAt={registeredAt}
							roleId={resolvedRoleId}
							initialRoleId={initialRoleId}
							roles={rolesForUser}
							onRoleChange={handleRoleChange}
							onUserSave={handleUserSave}
							onUserDelete={handleUserDelete}
							isSaving={isSaving}
							isDeleting={isDeleting}
						/>
					);
				})}
			</div>
			</Content>

		</div>
	);
};

export const Users = styled(UsersContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	padding: 30px 20px 60px;
	width: 100%;
	max-width: 960px;

	${H2} {
		margin: 10px 0 20px;
		text-align: left;
		width: 100%;
	}

	.table {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		background: #f7f9fc;
		padding: 24px;
		border-radius: 20px;
		box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
	}
`;
