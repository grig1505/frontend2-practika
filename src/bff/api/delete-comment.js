export const deleteComment = async (commentId) =>
	fetch(`http://localhost:3005/comments/${commentId}`, {
		method: 'DELETE',
	}).then((response) => {
		if (response.ok) {
			return { success: true };
		}
		throw new Error('Ошибка при удалении комментария');
	});

