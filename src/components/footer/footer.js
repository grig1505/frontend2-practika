import { Weather } from './components/wearther/weather';
import { Info } from './components/info/info';
import styled from 'styled-components';

const FooterContainer = ({ className }) => (
	<footer className={className}>
		<Info />
		<Weather />
	</footer>
);
export const Footer = styled(FooterContainer)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	background-color: #f5f5f5;
	font-size: 16px;
	color: #333;
	height: 120px;
	padding: 20px 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4px 20px #000;
`;
