import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconContainer = ({ className, id, ...props }) => (
	<div className={className} {...props}>
		<i className={`fa ${id}`} aria-hidden="true"></i>
	</div>
);
export const Icon = styled(IconContainer)`
	font-size: ${({ size = '24px' }) => size};
	font-weight: bold;
	margin: ${({ margin = '0' }) => margin};

	&:hover {
		cursor: pointer;
	}
`;

IconContainer.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	size: PropTypes.string,
	margin: PropTypes.string,
};
