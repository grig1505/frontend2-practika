import styled from 'styled-components';
import { ControlPanel, Logo } from './components';

const Description = styled.div`
	font-style: italic;
`;
const HeaderContainer = ({ className }) => (
	<header className={className}>
		<Logo />
		<Description>
			Веб-технологии <br /> Написание кода
			<br /> Разбор ошибок
		</Description>
		<ControlPanel></ControlPanel>
	</header>
);

export const Header = styled(HeaderContainer)`
	height: 120px;
	padding: 20px 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 -2px 17px #000;
	position: fixed;
	top: 0;
	width: 1440px;
	background-color: #fff;
`;
