import styled from 'styled-components';
import { Icon } from '../../../icon/icon';
import { Link } from 'react-router-dom';
const LargeText = styled.div`
	font-size: 48px;
	font-weight: 600;
	line-height: 48px;
`;
const SmallText = styled.div`
	font-size: 16px;
	font-weight: bold;
`;

const LogoContainer = ({ className }) => (
	<Link className={className} to="/">
		<Icon id="fa-code" size="70px" margin="0 10px 0 0" />
		<div>
			<LargeText>Блог</LargeText>
			<SmallText>веб-разработчика</SmallText>
		</div>
	</Link>
);

export const Logo = styled(LogoContainer)`
	display: flex;
	align-items: center;
	gap: 0 10px;
	color: #000;
	text-decoration: none;
`;
