import { PUBLIC_IS_EXTERNAL_NAVIGATION_ENABLED } from '$env/static/public';
import { isDevMode } from '$lib/utils/helpers/dev';

export const getNavigationBaseUrl = (baseUrl = '', scheme = '', host = '') => {
	if (PUBLIC_IS_EXTERNAL_NAVIGATION_ENABLED && !isDevMode()) {
		return `${scheme}://${host}/mutual-funds`;
	}
	return baseUrl;
};
