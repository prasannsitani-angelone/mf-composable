import getAuthToken from '$lib/server/getAuthToken';
import { tokenStore } from '$lib/stores/TokenStore';
import type { WMSCookie } from '$lib/types/IWMSCookie';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parse } from 'cookie-es';

export const handle = (async ({ event, resolve }) => {
	const cookie: WMSCookie = parse(event.request.headers.get('cookie') || '');
	let isAuthenticatedUser = true;
	let authtoken = event.request.headers.get('authtoken') || cookie['ABUserCookie'] || '';

	if (!authtoken) {
		authtoken = await getAuthToken('guest');
		isAuthenticatedUser = false;
	}
	event.request.headers.set('authToken', authtoken);
	event.request.headers.set('isGuest', isAuthenticatedUser ? 'false' : 'true');
	const response = await resolve(event);

	if (isAuthenticatedUser) {
		response.headers.set('set-cookie', `ABUserCookie=${authtoken}`);
		tokenStore.set({ userToken: authtoken, guestToken: '' });
	} else {
		response.headers.set('set-cookie', `ABGuestCookie=${authtoken}`);
		tokenStore.set({ userToken: '', guestToken: authtoken });
	}

	return response;
}) satisfies Handle;

export const handleFetch = (({ event, request, fetch }) => {
	// Set Auth token for Server api calls
	request.headers.set('authToken', event.request.headers.get('authToken') || '');
	return fetch(request);
}) satisfies HandleFetch;
