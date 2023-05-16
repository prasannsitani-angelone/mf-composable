import { tokenStore } from '$lib/stores/TokenStore';
import type { WMSCookie } from '$lib/types/IWMSCookie';
import Logger from '$lib/utils/logger';

import type { HandleClientError } from '@sveltejs/kit';
import { parse } from 'cookie-es';

function setUserToken() {
	const cookie: WMSCookie = parse(document.cookie);

	tokenStore.updateStore({
		userToken: cookie['ABUserCookie'] || '',
		guestToken: cookie['ABGuestCookie'] || ''
	});
}

export const handleError = (async ({ error }) => {
	const errorId = crypto.randomUUID();
	// example integration with https://sentry.io/
	const errorStr = error?.stack?.toString() || error?.toString();
	Logger.error({
		type: 'Runtime Exception in Client',
		params: {
			errorStr,
			errorId
		}
	});

	return {
		message: 'Something went wrong',
		errorId
	};
}) satisfies HandleClientError;

setUserToken();
