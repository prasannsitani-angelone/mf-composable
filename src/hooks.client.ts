import { tokenStore } from '$lib/stores/TokenStore';
import type { WMSCookie } from '$lib/types/IWMSCookie';
import { parse } from 'cookie-es';

function setUserToken() {
	const cookie: WMSCookie = parse(document.cookie);

	tokenStore.updateStore({
		userToken: cookie['ABUserCookie'] || '',
		guestToken: cookie['ABGuestCookie'] || ''
	});
}

const originalFetch = window.fetch;

function requestInterceptor(options: any) {
	const headers = options.headers;
	const token = tokenStore.activeToken();
	headers.authorization = headers.authorization || `Bearer ${token}`;
	return options;
}

function responseInterceptor(response: any) {
	response = response.json();
	return response;
}

window.fetch = async (url, options) => {
	options = requestInterceptor(options);

	let response = await originalFetch(url, options);
	response = responseInterceptor(response);

	return response;
};

setUserToken();

export {};
