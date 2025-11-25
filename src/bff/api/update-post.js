export const updatePost = async (postId, postData) => {
	try {
		// Пробуем сначала со строковым id (как в db.json)
		let response = await fetch(`http://localhost:3005/posts/${postId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(postData),
		});

		// Если не получилось со строкой, пробуем с числом
		if (!response.ok && !isNaN(postId)) {
			const numericId = Number(postId);
			console.log(`Пробуем числовой id вместо строкового: ${numericId}`);
			response = await fetch(`http://localhost:3005/posts/${numericId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify(postData),
			});
		}

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Ошибка обновления поста ${postId}:`, response.status, errorText);
			throw new Error(
				`Не удалось обновить пост: ${response.status} ${response.statusText}`
			);
		}

		const updatedPost = await response.json();

		if (!updatedPost) {
			console.error(`Пост ${postId} не найден в ответе сервера`);
			return null;
		}

		console.log('Обновлённый пост:', updatedPost);
		return updatedPost;
	} catch (error) {
		console.error('Ошибка в updatePost:', error);
		throw error;
	}
};

