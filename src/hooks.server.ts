import getAuthToken from '$lib/server/getAuthToken';
import type { UserProfile } from '$lib/types/IUserProfile';
import type { WMSCookie } from '$lib/types/IWMSCookie';
import { isDevMode } from '$lib/utils/helpers/dev';
import { getUserTokenFromCookie } from '$lib/utils/helpers/token';
import { useProfileFetch } from '$lib/utils/useProfileFetch';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parse } from 'cookie-es';

export const handle = (async ({ event, resolve }) => {
	const cookie: WMSCookie = parse(event.request.headers.get('cookie') || '');

	let isAuthenticatedUser = true;
	const ABUserCookie = getUserTokenFromCookie(cookie['ABUserCookie']);
	let token = event.request.headers.get('authtoken') || ABUserCookie?.NTAccessToken || '';
	const refreshToken =
		event.request.headers.get('refreshtoken') || ABUserCookie?.NTRefreshToken || '';
	let userType = cookie['UserType'] === 'undefined' ? null : cookie['UserType'];
	let accountType = cookie['AccountType'];
	let profileData: UserProfile = {
		clientId: '',
		userType: 'B2C',
		dpNumber: 'D'
	};
	const scheme = event.request.headers.get('x-forwarded-proto') || (isDevMode() ? 'http' : 'https')
	const host = event.request.headers.get('x-forwarded-host') || event.request.headers.get('host')

	if (!token) {
		// TODO: Check if Guest token is in Cookie
		token = await getAuthToken('guest');
		isAuthenticatedUser = false;
	}

	const isGuest = isAuthenticatedUser ? false : true;
	if (!userType && isGuest) {
		userType = 'B2C';
		accountType = 'D';
	} else if (!userType) {
		profileData = await useProfileFetch(event.url.origin, {});
		console.log('profiledata call');
		userType = profileData?.userType;
		accountType = profileData?.dpNumber ? 'D' : 'P';
	}

	event.locals = {
		...event.locals,
		token,
		refreshToken,
		isGuest,
		userType,
		accountType,
		profileData,
		scheme,
		host
	};

	const response = await resolve(event);

	return response;
}) satisfies Handle;
export const handleFetch = (async ({ event, request, fetch }) => {
	const { userType = '', accountType = '', token } = event.locals;

	request.headers.set('userType', userType);
	request.headers.set('accountType', accountType);
	request.headers.set('authorization', `Bearer ${token}`);

	return fetch(request);
}) satisfies HandleFetch;
