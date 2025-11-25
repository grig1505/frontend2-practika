import PropTypes from 'prop-types';
import styled from 'styled-components';
import { forwardRef } from 'react';
const InputContainer = forwardRef(({ className, width, ...props }, ref) => {
	return <input className={className} {...props} ref={ref}></input>;
});
export const Input = styled(InputContainer)`
	width: ${({ width = '100%' }) => width};
	height: 30px;
	padding: 0 10px;
	border: 1px solid #000;
`;

InputContainer.propTypes = {
	className: PropTypes.string,
	width: PropTypes.string,
};
