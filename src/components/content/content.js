import PropTypes from 'prop-types';
import { H2 } from '../h2/h2';
import styled from 'styled-components';

const Div = styled.div`
	display: flex;
	flex-direction: column;
	align-content: center;
`;

const ContentContainer = ({ children, error }) => 
error ? (
    <>
        <h2>Ошибка</h2>
        <div>{error}</div>
    </>
): (
    children
    );

ContentContainer.propTypes = {
	children: PropTypes.node,
	error: PropTypes.string,
};

export const Content = ContentContainer;