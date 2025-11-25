export const generateDate = () => {
	return new Date().toISOString().substring(0, 16).replace('T', ' ');
};