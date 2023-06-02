export const removeAuthHeaders = (headers = {}) => {
	const modifiedHeaders = Object.assign({}, headers);

	delete modifiedHeaders['AccessToken'];
	delete modifiedHeaders['accesstoken'];
	delete modifiedHeaders['accessToken'];
	delete modifiedHeaders['authorization'];
	delete modifiedHeaders['authtoken'];
	delete modifiedHeaders['cookie'];

	return modifiedHeaders;
};
