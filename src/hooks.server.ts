import getAuthToken from '$lib/server/getAuthToken';
import type { WMSCookie } from '$lib/types/IWMSCookie';
import { getUserTokenFromCookie } from '$lib/utils/helpers/token';
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie-es';

export const handle = (async ({ event, resolve }) => {
	const cookie: WMSCookie = parse(event.request.headers.get('cookie') || '');
	let isAuthenticatedUser = true;
	let ABUserCookie = getUserTokenFromCookie(cookie['ABUserCookie']);
	let token = event.request.headers.get('authtoken') || ABUserCookie?.NTAccessToken || '';
	let refreshToken =
		event.request.headers.get('refreshtoken') || ABUserCookie?.NTRefreshToken || '';

	if (!token) {
		// TODO: Check if Guest token is in Cookie
		token = await getAuthToken('guest');
		isAuthenticatedUser = false;
	}

	event.locals = {
		...event.locals,
		token,
		refreshToken,
		isGuest: isAuthenticatedUser ? 'false' : 'true',
		userType: cookie['UserType'],
		accountType: cookie['AccountType']
	};
	const response = await resolve(event);

	return response;
}) satisfies Handle;
