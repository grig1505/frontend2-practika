export const getSession = async (sessionHash) =>
	fetch(`http://localhost:3005/sessions?hash=${sessionHash}`)
		.then((response) => response.json())
		.then((sessions) => sessions && sessions.length > 0 ? sessions[0] : null);

