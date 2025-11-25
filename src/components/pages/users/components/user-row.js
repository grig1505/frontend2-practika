import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '../../../icon/icon';
//import { ROLE } from '../../../constants';

const UserRowContainer = ({
	className,
	id,
	login,
	registeredAt,
	roleId: userRoleId,
	initialRoleId,
	roles = [],
	onRoleChange = () => {},
	onUserDelete = () => {},
	onUserSave = () => {},
	isSaving = false,
	isDeleting = false,
}) => {
	const [localRoleId, setLocalRoleId] = useState(String(userRoleId ?? ''));

	useEffect(() => {
		setLocalRoleId(String(userRoleId ?? ''));
	}, [userRoleId]);

	const hasPendingChanges = Number(localRoleId) !== Number(initialRoleId);
	const isSaveDisabled = isSaving || !hasPendingChanges;
	const isDeleteDisabled = isDeleting;

	const handleSaveClick = () => {
		if (!isSaveDisabled && id !== undefined && id !== null) {
			onUserSave(id, Number(localRoleId));
		} else {
			console.error('Не удалось сохранить роль: id не определён', { id });
		}
	};

	const handleDeleteClick = () => {
		if (!isDeleteDisabled && id !== undefined && id !== null) {
			onUserDelete(id);
		} else {
			console.error('Не удалось удалить пользователя: id не определён', { id });
		}
	};

	const handleSelectChange = (event) => {
		const nextRoleId = event.target.value;
		setLocalRoleId(nextRoleId);
		if (id !== undefined && id !== null) {
			onRoleChange(id, Number(nextRoleId));
		} else {
			console.error('Не удалось изменить роль: id не определён', { id });
		}
	};

	return (
		<div className={className} key={id}>
			<div className="user-data">
				<div className="login-column">{login}</div>
				<div className="login-redat">{registeredAt}</div>
				<div className="login-role">
					<select
						value={localRoleId}
						onChange={handleSelectChange}
						disabled={isSaving || isDeleting}
					>
						{roles.map(({ id: roleId, name: roleName }) => (
							<option key={roleId} value={String(roleId)}>
								{roleName}
							</option>
						))}
					</select>
					<Icon
						className={`user-row__save${isSaveDisabled ? ' is-disabled' : ''}`}
						onClick={handleSaveClick}
						id="fa-floppy-o"
						size="20px"
						margin="0 0 0 12px"
					/>
				</div>
			</div>
			<Icon
				className={`user-row__delete${isDeleteDisabled ? ' is-disabled' : ''}`}
				onClick={handleDeleteClick}
				id="fa-trash-o"
				size="20px"
			/>
		</div>
	);
};

export const UserRow = styled(UserRowContainer)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18px 24px;
	background: #ffffff;
	border-radius: 16px;
	box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
	gap: 18px;

	.user-data {
		display: grid;
		grid-template-columns: 2fr 2fr 1.6fr;
		gap: 12px;
		align-items: center;
		flex: 1;
	}

	.login-column,
	.login-redat {
		font-size: 15px;
		color: #1f2937;
		text-align: left;
		word-break: break-word;
	}

	.login-role {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	select {
		width: 100%;
		padding: 6px 10px;
		border-radius: 10px;
		border: 1px solid #d7deeb;
		background: #f8fbff;
		font-size: 14px;
		outline: none;
		transition: border-color 0.2s ease;
	}

	select:focus {
		border-color: #7c91ff;
	}

	select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.user-row__save,
	.user-row__delete {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #b0b7cc;
		transition: color 0.2s ease, transform 0.2s ease;
	}

	.user-row__save:hover {
		color: #4ade80;
		transform: translateY(-1px);
	}

	.user-row__delete:hover {
		color: #f87171;
		transform: translateY(-1px);
	}

	.is-disabled {
		opacity: 0.4;
		pointer-events: none;
	}
`;

UserRowContainer.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	login: PropTypes.string.isRequired,
	registeredAt: PropTypes.string.isRequired,
	roleId: PropTypes.number.isRequired,
	initialRoleId: PropTypes.number.isRequired,
	roles: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			name: PropTypes.string,
		})
	),
	onRoleChange: PropTypes.func,
	onUserDelete: PropTypes.func,
	onUserSave: PropTypes.func,
	isSaving: PropTypes.bool,
	isDeleting: PropTypes.bool,
};
