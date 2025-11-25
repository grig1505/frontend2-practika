export const deletePost = async (postId) => {
	try {
		// Пробуем сначала со строковым id (как в db.json)
		let response = await fetch(`http://localhost:3005/posts/${postId}`, {
			method: 'DELETE',
		});

		// Если не получилось со строкой, пробуем с числом
		if (!response.ok && !isNaN(postId)) {
			const numericId = Number(postId);
			console.log(`Пробуем числовой id вместо строкового для удаления: ${numericId}`);
			response = await fetch(`http://localhost:3005/posts/${numericId}`, {
				method: 'DELETE',
			});
		}

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Ошибка удаления поста ${postId}:`, response.status, errorText);
			throw new Error(
				`Не удалось удалить пост: ${response.status} ${response.statusText}`
			);
		}

		console.log(`Пост ${postId} успешно удалён`);
		return true;
	} catch (error) {
		console.error('Ошибка в deletePost:', error);
		throw error;
	}
};

