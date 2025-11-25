import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { H2, Content, Input } from '../..';
import { useServerRequest } from '../../../hooks';
import { Icon } from '../../icon/icon';

const POSTS_PER_PAGE = 3;

const HomeContainer = ({ className }) => {
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const requestServer = useServerRequest();

	useEffect(() => {
		loadPosts();
	}, []);

	const loadPosts = async () => {
		setIsLoading(true);
		try {
			const response = await requestServer('fetchPosts');
			if (response && !response.error) {
				// Сортируем по дате публикации (новые первыми)
				const sortedPosts = (response.res || []).sort((a, b) => {
					return new Date(b.publishedAt) - new Date(a.publishedAt);
				});
				setPosts(sortedPosts);
			}
		} catch (error) {
			console.error('Ошибка загрузки постов:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Фильтрация по поисковому запросу
	const filteredPosts = useMemo(() => {
		if (!searchQuery.trim()) {
			return posts;
		}
		const query = searchQuery.toLowerCase().trim();
		return posts.filter((post) => post.title.toLowerCase().includes(query));
	}, [posts, searchQuery]);

	const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
	const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
	const currentPosts = useMemo(() => {
		return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
	}, [filteredPosts, startIndex]);

	// Сбрасываем на первую страницу при изменении поискового запроса
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	const getShortContent = (content, maxLength = 150) => {
		if (!content) return '';
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength) + '...';
	};

	return (
		<div className={className}>
			<Content>
				<H2>Статьи</H2>
				
				{/* Поиск по середине */}
				<div className="search-section">
					<div className="search-input-wrapper">
						<Icon id="fa-search" size="18px" margin="0 10px 0 0" />
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Поиск по заголовку..."
							width="100%"
						/>
					</div>
				</div>

				{isLoading ? (
					<p>Загрузка статей...</p>
				) : filteredPosts.length === 0 ? (
					<p>{searchQuery ? 'Статьи не найдены' : 'Статьи не найдены'}</p>
				) : (
					<>
						<div className="posts-list">
							{currentPosts.map((post) => (
								<Link key={post.id} to={`/posts/${post.id}`} className="post-card">
									{post.imageUrl && (
										<div className="post-image">
											<img src={post.imageUrl} alt={post.title} />
										</div>
									)}
									<div className="post-content">
										<h3 className="post-title">{post.title}</h3>
										<div className="post-meta">
											<div className="post-date">{post.publishedAt}</div>
											{post.commentsCount !== undefined && (
												<div className="post-comments-count">
													<Icon id="fa-comment-o" size="16px" margin="0 5px 0 0" />
													<span>{post.commentsCount}</span>
												</div>
											)}
										</div>
										<div className="post-excerpt">{getShortContent(post.content)}</div>
									</div>
								</Link>
							))}
						</div>
						{totalPages > 1 && (
							<div className="pagination">
								<button
									onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
									disabled={currentPage === 1}
									className="pagination-btn"
								>
									Предыдущая
								</button>
								<span className="pagination-info">
									Страница {currentPage} из {totalPages}
								</span>
								<button
									onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
									disabled={currentPage === totalPages}
									className="pagination-btn"
								>
									Следующая
								</button>
							</div>
						)}
					</>
				)}
			</Content>
		</div>
	);
};

export const Home = styled(HomeContainer)`
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;

	.search-section {
		display: flex;
		justify-content: center;
		margin: 30px 0;
	}

	.search-input-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 600px;
		padding: 12px 20px;
		background: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
	}

	.posts-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
	}

	.post-card {
		display: flex;
		flex-direction: row;
		gap: 20px;
		padding: 20px;
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s ease, box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}
	}

	.post-image {
		flex-shrink: 0;
		width: 200px;
		height: 150px;
		overflow: hidden;
		border-radius: 8px;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.post-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.post-title {
		font-size: 22px;
		font-weight: 600;
		margin: 0;
		color: #1f2937;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 15px;
		flex-wrap: wrap;
	}

	.post-date {
		font-size: 14px;
		color: #6b7280;
	}

	.post-comments-count {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #6b7280;
		gap: 5px;
	}

	.post-excerpt {
		font-size: 16px;
		color: #4b5563;
		line-height: 1.6;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		margin-top: 30px;
	}

	.pagination-btn {
		padding: 10px 20px;
		font-size: 16px;
		border: 1px solid #d1d5db;
		background: #ffffff;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover:not(:disabled) {
			background: #f3f4f6;
			border-color: #9ca3af;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.pagination-info {
		font-size: 16px;
		color: #6b7280;
	}
`;

