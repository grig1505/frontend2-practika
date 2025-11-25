import styled from 'styled-components';

const Infocontainer = ({ className }) => (
	<div className={className}>
		<span>Блог веб-разработчика</span>
		<a href="mailto:web@developer.ru">web@developer.ru</a>
	</div>
);
export const Info = styled(Infocontainer)`
	font-size: 16px;
	font-weight: bold;
	display: flex;
	flex-direction: column;
`;
