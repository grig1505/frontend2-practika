import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../../icon/icon';
import { Input, Button } from '../../../../';
import { selectUserRole } from '../../../../../components/selectors';
import { ROLE } from '../../../../../constants';
import { useServerRequest } from '../../../../../hooks';

const PostContentContainer = ({ className, post = {} }) => {
    const { id, title, content, imageUrl, publishedAt } = post;
    const roleId = useSelector(selectUserRole);
    const isAdmin = roleId === ROLE.ADMIN;
    const isModerator = roleId === ROLE.MODERATOR;
    const canEdit = isAdmin || isModerator;
    const requestServer = useServerRequest();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [editedPost, setEditedPost] = useState({
        title: title || '',
        imageUrl: imageUrl || '',
        content: content || '',
    });

    // Синхронизируем состояние редактирования с пропсами поста
    useEffect(() => {
        if (!isEditing) {
            setEditedPost({
                title: title || '',
                imageUrl: imageUrl || '',
                content: content || '',
            });
        }
    }, [title, imageUrl, content, isEditing]);

    const handleSaveClick = () => {
        setIsEditing(true);
        setEditedPost({
            title: title || '',
            imageUrl: imageUrl || '',
            content: content || '',
        });
        setError(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedPost({
            title: title || '',
            imageUrl: imageUrl || '',
            content: content || '',
        });
        setError(null);
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        if (!editedPost.title.trim() || !editedPost.content.trim() || isSubmitting) return;

        setError(null);
        setIsSubmitting(true);

        try {
            const response = await requestServer('updatePost', id, {
                title: editedPost.title.trim(),
                imageUrl: editedPost.imageUrl.trim(),
                content: editedPost.content.trim(),
            });

            if (response && !response.error) {
                setIsEditing(false);
                // Перезагружаем страницу для обновления данных
                window.location.reload();
            } else {
                setError(response?.error || 'Ошибка при обновлении статьи');
            }
        } catch (error) {
            console.error('Ошибка обновления статьи:', error);
            setError('Произошла ошибка при обновлении статьи');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить эту статью?')) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            const response = await requestServer('deletePost', id);

            if (response && !response.error) {
                // Перенаправляем на страницу со списком постов
                navigate('/posts');
            } else {
                setError(response?.error || 'Ошибка при удалении статьи');
                setIsDeleting(false);
            }
        } catch (error) {
            console.error('Ошибка удаления статьи:', error);
            setError('Произошла ошибка при удалении статьи');
            setIsDeleting(false);
        }
    };
    if (!id) {
        return <div className={className}>Загрузка...</div>;
    }

    return (
        <div className={className}>
            {isEditing ? (
                <form className="edit-post-form" onSubmit={handleUpdatePost}>
                    <div className="form-group">
                        <Input
                            value={editedPost.title}
                            onChange={(e) => {
                                setEditedPost({ ...editedPost, title: e.target.value });
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
                            value={editedPost.imageUrl}
                            onChange={(e) => {
                                setEditedPost({ ...editedPost, imageUrl: e.target.value });
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
                            value={editedPost.content}
                            onChange={(e) => {
                                setEditedPost({ ...editedPost, content: e.target.value });
                                setError(null);
                            }}
                            placeholder="Содержание статьи"
                            rows={8}
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-actions">
                        <Button
                            type="submit"
                            width="auto"
                            disabled={!editedPost.title.trim() || !editedPost.content.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                        <Button
                            type="button"
                            width="auto"
                            onClick={handleCancelEdit}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="post-header">
                        <h1>{title}</h1>
                        {canEdit && (
                            <div className="admin-actions">
                                <Icon
                                    className="post-row__edit"
                                    onClick={handleSaveClick}
                                    id="fa-pencil"
                                    size="20px"
                                    margin="0 0 0 12px"
                                    title="Редактировать статью"
                                />
                                <Icon
                                    className="post-row__delete"
                                    onClick={handleDeleteClick}
                                    id="fa-trash-o"
                                    size="20px"
                                    margin="0 0 0 12px"
                                    title="Удалить статью"
                                    disabled={isDeleting}
                                />
                            </div>
                        )}
                    </div>
                    <div className="publishedAt">
                        <p>{publishedAt}</p>
                    </div>
                    <div className="content">
                        {imageUrl && <img src={imageUrl} alt={title} />}
                        <p>{content}</p>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </>
            )}
        </div>
    );
};


export const PostContent = styled(PostContentContainer)`
    width: 100%;

    .post-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
        gap: 15px;
    }

    h1 {
        margin: 0;
        flex: 1;
        font-size: 32px;
        color: #1f2937;
    }

    .admin-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }

    .post-row__edit,
    .post-row__delete {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #b0b7cc;
        cursor: pointer;
        transition: color 0.2s ease, transform 0.2s ease;
        
        &:hover:not(:disabled) {
            transform: translateY(-2px);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .post-row__edit:hover {
        color: #4ade80;
    }

    .post-row__delete:hover {
        color: #f87171;
    }

    .edit-post-form {
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

    .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .publishedAt {
        font-size: 14px;
        color: #666;
        margin-bottom: 20px;
        
        p {
            margin: 0;
        }
    }

    .content {
        font-size: 16px;
        color: #333;
        line-height: 1.6;
        display: flex;
        flex-direction: column;
        gap: 15px;

        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        p {
            margin: 0;
        }
    }
`;

PostContentContainer.propTypes = {
	className: PropTypes.string,
	post: PropTypes.shape({
		id: PropTypes.string,
		title: PropTypes.string,
		content: PropTypes.string,
		imageUrl: PropTypes.string,
		publishedAt: PropTypes.string,
	}),
};