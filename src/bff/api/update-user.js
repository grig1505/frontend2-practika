import { transformUser } from '../transformers';

export const updateUser = async (userId, updates = {}) => {
	try {
		// Пробуем сначала со строковым id (как в db.json)
		let response = await fetch(`http://localhost:3005/users/${userId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(updates),
		});

		// Если не получилось со строкой, пробуем с числом
		if (!response.ok && !isNaN(userId)) {
			const numericId = Number(userId);
			console.log(`Пробуем числовой id вместо строкового: ${numericId}`);
			response = await fetch(`http://localhost:3005/users/${numericId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify(updates),
			});
		}

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Ошибка обновления пользователя ${userId}:`, response.status, errorText);
			throw new Error(
				`Не удалось обновить данные пользователя: ${response.status} ${response.statusText}`
			);
		}

		const updatedUser = await response.json();

		if (!updatedUser) {
			console.error(`Пользователь ${userId} не найден в ответе сервера`);
			return null;
		}

		const transformed = transformUser(updatedUser);
		console.log('Обновлённый пользователь:', transformed);
		return transformed;
	} catch (error) {
		console.error('Ошибка в updateUser:', error);
		throw error;
	}
};

