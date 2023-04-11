import { PUBLIC_ENV_NAME } from '$env/static/public';
import { isDevMode } from '$lib/utils/helpers/dev';

export const getNavigationBaseUrl = (baseUrl = '', scheme = '', host = '') => {
	if (PUBLIC_ENV_NAME === 'uat' && !isDevMode()) {
		return `${scheme}://${host}/mutual-funds`;
	}
	return baseUrl;
};
