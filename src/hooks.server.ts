import getAuthToken from '$lib/server/getAuthToken';
import type { UserProfile } from '$lib/types/IUserProfile';
import type { WMSCookie } from '$lib/types/IWMSCookie';
import { getUserTokenFromCookie } from '$lib/utils/helpers/token';
import { useProfileFetch } from '$lib/utils/useProfileFetch';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parse } from 'cookie-es';

export const handle = (async ({ event, resolve }) => {
	const cookie: WMSCookie = parse(event.request.headers.get('cookie') || '');
	// console.log(event.cookies.set('BGVVVV','XYZZZ',{
	// 	httpOnly:true
	// }))
	// console.log('in Handle', cookie);

	let isAuthenticatedUser = true;
	const ABUserCookie = getUserTokenFromCookie(cookie['ABUserCookie']);
	let token = event.request.headers.get('authtoken') || ABUserCookie?.NTAccessToken || '';
	const refreshToken =
		event.request.headers.get('refreshtoken') || ABUserCookie?.NTRefreshToken || '';
	let userType = cookie['UserType'];
	let accountType = cookie['AccountType'];
	const isGuest = isAuthenticatedUser ? 'false' : 'true';
	let profileData: UserProfile = {
		clientId: '',
		userType: '',
		dpNumber: ''
	};

	if (!token) {
		// TODO: Check if Guest token is in Cookie
		token = await getAuthToken('guest');
		isAuthenticatedUser = false;
	}
	if (!userType && isGuest) {
		userType = 'B2C';
		accountType = 'D';
	} else if (!userType) {
		profileData = await useProfileFetch(event.url.origin, {});
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
		profileData
	};
	const response = await resolve(event);

	return response;
}) satisfies Handle;
export const handleFetch = (async ({ event, request, fetch }) => {
	const authtoken = event.request.headers.get('authToken') || '';
	const { userType = '', accountType = '' } = event.locals;


	request.headers.set('userType', userType);
	request.headers.set('accountType', accountType);
	request.headers.set('authorization', `Bearer ${authtoken}`);

	return fetch(request);
}) satisfies HandleFetch;
