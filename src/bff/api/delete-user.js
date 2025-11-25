export const deleteUser = async (userId) => {
	try {
		// Пробуем сначала со строковым id (как в db.json)
		let response = await fetch(`http://localhost:3005/users/${userId}`, {
			method: 'DELETE',
		});

		// Если не получилось со строкой, пробуем с числом
		if (!response.ok && !isNaN(userId)) {
			const numericId = Number(userId);
			console.log(`Пробуем числовой id вместо строкового для удаления: ${numericId}`);
			response = await fetch(`http://localhost:3005/users/${numericId}`, {
				method: 'DELETE',
			});
		}

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Ошибка удаления пользователя ${userId}:`, response.status, errorText);
			throw new Error(
				`Не удалось удалить пользователя: ${response.status} ${response.statusText}`
			);
		}

		console.log(`Пользователь ${userId} успешно удалён`);
		return true;
	} catch (error) {
		console.error('Ошибка в deleteUser:', error);
		throw error;
	}
};

