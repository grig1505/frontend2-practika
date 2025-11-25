import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { H2, Content, Button, Input } from '../..';
import { useServerRequest } from '../../../hooks';
import { selectUserRole } from '../../../components/selectors';
import { ROLE } from '../../../bff/constants';

const POSTS_PER_PAGE = 3;

const PostsContainer = ({ className }) => {
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [newPost, setNewPost] = useState({
		title: '',
		imageUrl: '',
		content: '',
	});
	const roleId = useSelector(selectUserRole);
	const requestServer = useServerRequest();
	const isAdmin = roleId === ROLE.ADMIN;
	const isModerator = roleId === ROLE.MODERATOR;
	const isAuthorized = roleId !== ROLE.GUEST;
	const canAddPost = isAdmin || isModerator;

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

	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
	const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
	const currentPosts = useMemo(() => {
		return posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
	}, [posts, startIndex]);

	const getShortContent = (content, maxLength = 150) => {
		if (!content) return '';
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength) + '...';
	};

	const handleAddPost = async (e) => {
		e.preventDefault();
		if (!newPost.title.trim() || !newPost.content.trim() || isSubmitting) return;

		setError(null);
		setIsSubmitting(true);

		try {
			const response = await requestServer('addPost', {
				title: newPost.title.trim(),
				imageUrl: newPost.imageUrl.trim(),
				content: newPost.content.trim(),
			});

			if (response && !response.error) {
				setNewPost({ title: '', imageUrl: '', content: '' });
				await loadPosts(); // Перезагружаем список постов
				setCurrentPage(1); // Возвращаемся на первую страницу
			} else {
				setError(response?.error || 'Ошибка при добавлении статьи');
			}
		} catch (error) {
			console.error('Ошибка создания статьи:', error);
			setError('Произошла ошибка при создании статьи');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isAuthorized) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			<Content>
				<H2>Добавить пост</H2>

				{canAddPost && (
					<form className="add-post-form" onSubmit={handleAddPost}>
					<div className="form-group">
						<Input
							value={newPost.title}
							onChange={(e) => {
								setNewPost({ ...newPost, title: e.target.value });
								setError(null);
							}}
							placeholder="Заголовок статьи"
							width="100%"
							disabled={isSubmitting}
							required
						/>
					</div>
					<div className="form-group">
						<Input
							value={newPost.imageUrl}
							onChange={(e) => {
								setNewPost({ ...newPost, imageUrl: e.target.value });
								setError(null);
							}}
							placeholder="URL изображения (необязательно)"
							width="100%"
							disabled={isSubmitting}
						/>
					</div>
					<div className="form-group">
						<textarea
							className="content-textarea"
							value={newPost.content}
							onChange={(e) => {
								setNewPost({ ...newPost, content: e.target.value });
								setError(null);
							}}
							placeholder="Содержание статьи"
							rows={8}
							disabled={isSubmitting}
							required
						/>
					</div>
					{error && <div className="error-message">{error}</div>}
					<Button
						type="submit"
						width="auto"
						disabled={!newPost.title.trim() || !newPost.content.trim() || isSubmitting}
					>
						{isSubmitting ? 'Создание...' : 'Создать статью'}
					</Button>
				</form>
				)}

				{isLoading ? (
					<p>Загрузка статей...</p>
				) : currentPosts.length === 0 ? (
					<p>Статьи не найдены</p>
				) : (
					<>
						{/* <div className="posts-list">
							{currentPosts.map((post) => (
								<Link key={post.id} to={`/posts/${post.id}`} className="post-card">
									{post.imageUrl && (
										<div className="post-image">
											<img src={post.imageUrl} alt={post.title} />
										</div>
									)}
									<div className="post-content">
										<h3 className="post-title">{post.title}</h3>
										<div className="post-date">{post.publishedAt}</div>
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
						)} */}
					</>
				)}
			</Content>
		</div>
	);
};

export const Posts = styled(PostsContainer)`
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;

	.add-post-form {
		background: #f9f9f9;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
		border: 1px solid #e0e0e0;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.content-textarea {
		width: 100%;
		min-height: 150px;
		padding: 12px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 16px;
		font-family: inherit;
		resize: vertical;
		transition: border-color 0.2s ease;

		&:focus {
			outline: none;
			border-color: #7c91ff;
		}

		&:disabled {
			background-color: #f3f4f6;
			cursor: not-allowed;
			opacity: 0.7;
		}

		&::placeholder {
			color: #9ca3af;
		}
	}

	.error-message {
		color: #ef4444;
		font-size: 14px;
		margin-top: 5px;
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

	.post-date {
		font-size: 14px;
		color: #6b7280;
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

