import getAuthToken from '$lib/server/getAuthToken';
import type { IUserDetails } from '$lib/types/IUserDetails';
import type { UserProfile } from '$lib/types/IUserProfile';
import { isDevMode } from '$lib/utils/helpers/dev';
import { removeAuthHeaders } from '$lib/utils/helpers/logging';
import { decryptRightUserCookie } from '$lib/utils/helpers/token';
import Logger from '$lib/utils/logger';
import { useProfileFetch } from '$lib/utils/useProfileFetch';
import { useUserDetailsFetch } from '$lib/utils/useUserDetailsFetch';
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { parse } from 'cookie-es';
import { handleDeviecDetector } from 'sveltekit-device-detector';
const deviceDetector = handleDeviecDetector({});

const handler = (async ({ event, resolve }) => {
	const cookieString = event.request.headers.get('cookie') || '';
	const cookie: Record<string, string> = parse(cookieString);

	let isAuthenticatedUser = true;
	const ABUserCookie = decryptRightUserCookie(cookieString);
	let token = event.request.headers.get('authtoken') || ABUserCookie?.NTAccessToken || '';

	const refreshToken =
		event.request.headers.get('refreshtoken') || ABUserCookie?.NTRefreshToken || '';
	let userType = cookie['UserType'] === 'undefined' ? null : cookie['UserType'];
	let accountType = cookie['AccountType'] || null;
	let profileData: UserProfile = {
		clientId: '',
		userType: 'B2C',
		dpNumber: 'D'
	};

	let userDetails: IUserDetails;
	const scheme = event.request.headers.get('x-forwarded-proto') || (isDevMode() ? 'http' : 'https');
	const host = event.request.headers.get('x-forwarded-host') || event.request.headers.get('host');

	if (!token) {
		// TODO: Check if Guest token is in Cookie
		token = await getAuthToken('guest');
		isAuthenticatedUser = false;
	}

	const isGuest = isAuthenticatedUser ? false : true;
	if (!userType && isGuest) {
		userType = 'B2C';
		accountType = 'D';
	} else if (!userType && !event.request.url.includes('/api/profile')) {
		profileData = await useProfileFetch(event.url.origin, token, fetch);
		userDetails = await useUserDetailsFetch(token, fetch);
		userType = userDetails?.userType || null;
		accountType = profileData?.dpNumber ? 'D' : 'P';
	}

	event.locals = {
		...event.locals,
		token,
		refreshToken,
		isGuest,
		userType,
		userDetails,
		accountType,
		profileData,
		scheme,
		host
	};

	const response = await resolve(event);
	response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
	response.headers.set('Pragma', 'no-cache');
	response.headers.set('Expires', '0');
	return response;
}) satisfies Handle;

export const handleFetch = (async ({ event, request, fetch }) => {
	const { userType = '', accountType = '', token } = event.locals;
	request.headers.set('userType', userType);
	request.headers.set('accountType', accountType);
	request.headers.set('authorization', `Bearer ${token}`);
	request.headers.set('authtoken', token);

	Logger.debug({
		type: 'Network request',
		params: {
			url: request.url,
			opts: {
				method: request.method,
				headers: removeAuthHeaders(Object.fromEntries(request.headers))
			}
		}
	});

	return fetch(request);
}) satisfies HandleFetch;

export const handle = sequence(deviceDetector, handler);

export const handleError = (async ({ error, event }) => {
	const errorId = crypto.randomUUID();

	Logger.error({
		type: 'Runtime Exception in server',
		params: {
			error,
			errorId
		}
	});
	return {
		message: 'Something went wrong',
		errorId
	};
}) satisfies HandleServerError;
