import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Header, Footer } from './components';
import { Authorization, Registration, Users, Post, Posts, Home, NotFound } from './components/pages';
const Page = styled.div`
	padding: 120px 0;
`;

const AppColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 100%;
	background-color: #fff;
	margin: 0 auto;
	width: 1440px;
`;

export const Blog = () => {
	return (
		<AppColumn>
			<Header />
			<div className="App">
				<header className="App-header">
					<Page>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Authorization />} />
							<Route path="/register" element={<Registration />} />
							<Route path="/users" element={<Users />} />
							<Route path="/posts" element={<Posts />} />
							<Route path="/posts/:id" element={<Post />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Page>
				</header>
			</div>
			<Footer />
		</AppColumn>
	);
};
