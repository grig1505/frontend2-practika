import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { H2, Button } from '../..';

const NotFoundContainer = ({ className }) => {
	return (
		<div className={className}>
			<div className="not-found-content">
				<div className="error-code">404</div>
				<H2>Страница не найдена</H2>
				<p className="error-message">
					К сожалению, запрашиваемая страница не существует или была перемещена.
				</p>
				<Link to="/">
					<Button width="auto">Вернуться на главную</Button>
				</Link>
			</div>
		</div>
	);
};

export const NotFound = styled(NotFoundContainer)`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 60vh;
	width: 100%;

	.not-found-content {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		padding: 40px;
	}

	.error-code {
		font-size: 120px;
		font-weight: 700;
		color: #7c91ff;
		line-height: 1;
		margin-bottom: 20px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	h2 {
		margin: 0;
		color: #1f2937;
	}

	.error-message {
		font-size: 18px;
		color: #6b7280;
		max-width: 500px;
		line-height: 1.6;
		margin: 0;
	}

	a {
		text-decoration: none;
		margin-top: 10px;
	}
`;

NotFoundContainer.propTypes = {
	className: PropTypes.string,
};

