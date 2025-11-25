import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '../../../icon/icon';
import { Link, useNavigate } from 'react-router-dom';
import { ROLE } from '../../../../constants';
import { logout } from '../../../../actions';
import { selectUserRole, selectUserLogin, selectUserSession } from '../../../selectors';

const RightAligned = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: baseline;
`;
const StyledLink = styled(Link)`
	font-size: 18px;
	width: 100px;
	height: 32px;
	color: #000;
	text-decoration: none;
	border: 1px solid #000;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #eee;
`;

const UserName = styled.div`
	font-size: 17px;
	font-weight: bold;
`;
const ControlPanelContainer = ({ className }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);
	const login = useSelector(selectUserLogin);
	const session = useSelector(selectUserSession);

	const handleLogout = async () => {
		await dispatch(logout(session));
		navigate('/login');
	};

	return (
		<div className="{className}">
			<RightAligned>
				{roleId === ROLE.GUEST ? (
					<StyledLink to="/login">Войти</StyledLink>
				) : (
					<>
						<UserName>{login}</UserName>

						<Icon
							onClick={handleLogout}
							id="fa-sign-out"
							size="20px"
							margin="5px 0 0 15px"
						/>
					</>
				)}
			</RightAligned>
			<RightAligned>
				<Icon
					onClick={() => navigate(-1)}
					id="fa-backward"
					size="20px"
					margin="10px  0 0 0"
				/>

				<Link to="/posts">
					<Icon id="fa-file-text-o" size="20px" margin="10px  0 0 15px" />
				</Link>
				<Link to="/users">
					<Icon id="fa-users" size="20px" margin="10px  0 0 15px" />
				</Link>
			</RightAligned>
		</div>
	);
};

export const ControlPanel = styled(ControlPanelContainer)``;
