import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Icon } from '../../../../icon/icon';
import { Input, Button } from '../../../../';
import { selectUserRole, selectUserSession, selectUserId } from '../../../../../components/selectors';
import { ROLE } from '../../../../../constants';
import { useServerRequest } from '../../../../../hooks';

const PostCommentsContainer = ({ className, postId }) => {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingComments, setDeletingComments] = useState({});
	const [error, setError] = useState(null);
	const roleId = useSelector(selectUserRole);
	const session = useSelector(selectUserSession);
	const userId = useSelector(selectUserId);
	const requestServer = useServerRequest();
	const isAuthorized = roleId !== ROLE.GUEST;

	useEffect(() => {
		if (postId) {
			loadComments();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId]);

	const loadComments = async () => {
		if (!postId) return;
		setIsLoading(true);
		try {
			const response = await requestServer('fetchComments', postId);
			if (response && !response.error) {
				setComments(response.res || []);
			}
		} catch (error) {
			console.error('Ошибка загрузки комментариев:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmitComment = async (e) => {
		e.preventDefault();
		if (!newComment.trim() || !isAuthorized || !postId || isSubmitting) return;

		setError(null);
		setIsSubmitting(true);

		try {
			const response = await requestServer('addComment', {
				postId: postId,
				content: newComment.trim(),
			});
			
			if (response && !response.error) {
				setNewComment('');
				await loadComments(); // Перезагружаем комментарии
			} else {
				setError(response?.error || 'Ошибка при добавлении комментария');
			}
		} catch (error) {
			console.error('Ошибка создания комментария:', error);
			setError('Произошла ошибка при отправке комментария');
		} finally {
			setIsSubmitting(false);
		}
	};

	const canDeleteComment = (comment) => {
		if (!isAuthorized) return false;
		const isAdmin = roleId === ROLE.ADMIN;
		const isModerator = roleId === ROLE.MODERATOR;
		const isAuthor = String(userId) === String(comment.authorId);
		return isAdmin || isModerator || isAuthor;
	};

	const handleDeleteComment = async (commentId, commentAuthorId) => {
		if (!canDeleteComment({ authorId: commentAuthorId })) return;

		setDeletingComments((prev) => ({ ...prev, [commentId]: true }));

		try {
			const response = await requestServer('removeComment', commentId, commentAuthorId);
			
			if (response && !response.error) {
				await loadComments(); // Перезагружаем комментарии
			} else {
				setError(response?.error || 'Ошибка при удалении комментария');
			}
		} catch (error) {
			console.error('Ошибка удаления комментария:', error);
			setError('Произошла ошибка при удалении комментария');
		} finally {
			setDeletingComments((prev) => {
				const { [commentId]: omit, ...rest } = prev;
				return rest;
			});
		}
	};

	return (
		<div className={className}>
			<h2>Комментарии</h2>
			{isLoading ? (
				<p>Загрузка комментариев...</p>
			) : comments.length === 0 ? (
				<p>Пока нет комментариев</p>
			) : (
				<div className="comments-list">
					{comments.map((comment) => {
						const canDelete = canDeleteComment(comment);
						const isDeleting = deletingComments[comment.id];
						
						return (
							<div key={comment.id} className="comment-item">
								<div className="comment-header">
									<div className="comment-header-left">
										<Icon id="fa-user" size="16px" margin="0 8px 0 0" />
										<span className="comment-author">{comment.author}</span>
										<span className="comment-date">{comment.publishedAt}</span>
									</div>
									{canDelete && (
										<Icon
											className="comment-delete-icon"
											id="fa-trash-o"
											size="16px"
											onClick={() => handleDeleteComment(comment.id, comment.authorId)}
											title="Удалить комментарий"
											style={{ 
												opacity: isDeleting ? 0.5 : 1,
												cursor: isDeleting ? 'not-allowed' : 'pointer'
											}}
										/>
									)}
								</div>
								<div className="comment-content">{comment.content}</div>
							</div>
						);
					})}
				</div>
			)}
			{isAuthorized && (
				<form className="comment-form" onSubmit={handleSubmitComment}>
					<div className="form-group">
						<textarea
							className="comment-textarea"
							value={newComment}
							onChange={(e) => {
								setNewComment(e.target.value);
								setError(null);
							}}
							placeholder="Напишите комментарий..."
							disabled={isSubmitting}
							rows={4}
						/>
						{error && <div className="error-message">{error}</div>}
					</div>
					<Button 
						type="submit" 
						width="auto" 
						disabled={!newComment.trim() || isSubmitting}
					>
						{isSubmitting ? 'Отправка...' : 'Отправить'}
					</Button>
				</form>
			)}
		</div>
	);
};

export const PostComments = styled(PostCommentsContainer)`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 20px;
	margin-top: 30px;
	padding-top: 30px;
	border-top: 1px solid #ddd;

	h2 {
		font-size: 24px;
		margin: 0 0 10px 0;
		color: #333;
	}

	.comments-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.comment-item {
		padding: 15px;
		background: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
	}

	.comment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
		font-size: 14px;
	}

	.comment-header-left {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.comment-author {
		font-weight: bold;
		color: #333;
		margin-right: 10px;
	}

	.comment-date {
		color: #666;
		font-size: 12px;
	}

	.comment-content {
		color: #555;
		line-height: 1.5;
		font-size: 15px;
	}

	.comment-delete-icon {
		color: #b0b7cc;
		transition: color 0.2s ease, transform 0.2s ease;
		flex-shrink: 0;
		margin-left: 10px;

		&:hover {
			color: #f87171;
			transform: translateY(-1px);
		}
	}

	.comment-form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-top: 20px;
		padding: 20px;
		background: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
	}

	.form-group {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.comment-textarea {
		width: 100%;
		min-height: 100px;
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
`;

PostCommentsContainer.propTypes = {
	className: PropTypes.string,
	postId: PropTypes.string.isRequired,
};