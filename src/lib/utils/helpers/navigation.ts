import { PUBLIC_IS_EXTERNAL_NAVIGATION_ENABLED } from '$env/static/public';
import { isDevMode } from '$lib/utils/helpers/dev';

export const getNavigationBaseUrl = (baseUrl = '', scheme = '', host = '', prefix = '') => {
	if (isExternalNavigation()) {
		return `${scheme}://${host}/mutual-funds${prefix}`;
	}
	return baseUrl;
};

export const isExternalNavigation = () => {
	if (PUBLIC_IS_EXTERNAL_NAVIGATION_ENABLED && !isDevMode()) {
		return true;
	}
	return false;
};

export const getNavigationV1Url = (scheme = '', host = '', prefix = '') => {
	return `${scheme}://${host}/mutual-funds${prefix}`;
};
