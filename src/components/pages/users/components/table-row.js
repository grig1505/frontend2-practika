import PropTypes from 'prop-types';
import styled from 'styled-components';

const TableRowContainer = ({ className, children }) => {
	return <div className={className}>{children}</div>;
};

TableRowContainer.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};

export const TableRow = styled(TableRowContainer)`
	display: grid;
	grid-template-columns: 2fr 2fr 1.6fr;
	gap: 12px;
	padding: 12px 24px;
	border-radius: 14px;
	background: #ebf1ff;
	color: #1e1f25;
	font-weight: 600;
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
`;
