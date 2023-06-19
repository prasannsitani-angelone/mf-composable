import getAuthToken from '$lib/server/getAuthToken';
import type { IUserDetails } from '$lib/types/IUserDetails';
import type { UserProfile } from '$lib/types/IUserProfile';
import { removeAuthHeaders } from '$lib/utils/helpers/logging';
import { decryptRightUserCookie } from '$lib/utils/helpers/token';
import Logger from '$lib/utils/logger';
import { useProfileFetch } from '$lib/utils/useProfileFetch';
import { useUserDetailsFetch } from '$lib/utils/useUserDetailsFetch';
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { parse } from 'cookie-es';
import { handleDeviecDetector } from 'sveltekit-device-detector';
import * as servertime from 'servertime';
import { PRIVATE_MF_CORE_BASE_URL } from '$env/static/private';
import { PUBLIC_ENV_NAME, PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { dev } from '$app/environment';
const deviceDetector = handleDeviecDetector({});

const addPreloadLinkHeaders = (linkHeader = '', url: string) => {
	linkHeader = `</mutual-funds/fonts/7cHqv4kjgoGqM7E3_-gs51ostz0rdg.woff2>;rel="preload";as="font";type="font/woff";nopush;crossorigin,</mutual-funds/fonts/7cHpv4kjgoGqM7E_DMs5ynghnQ.woff2>;rel="preload";as="font";type="font/woff";nopush;crossorigin,</mutual-funds/fonts/7cHqv4kjgoGqM7E30-8s51ostz0rdg.woff2>;rel="preload";as="font";type="font/woff";nopush;crossorigin,${linkHeader}`;
	if (url.includes('/discoverfunds')) {
		linkHeader = `<https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail1c1.webp>;rel="preload";as="image";nopush,<https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail2c1.webp>;rel="preload";as="image";nopush,<https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail3c1.webp>;rel="preload";as="image";nopush,<https://cdn.angelone.in/mutualfunds/thumbnails/thumbnail4c1.webp>;rel="preload";as="image";nopush,${linkHeader}`;
	}
	return linkHeader;
};
const handler = (async ({ event, resolve }) => {
	try {
		const serverTiming = servertime.createTimer();
		const cookieString = event.request.headers.get('cookie') || '';
		const cookie: Record<string, string> = parse(cookieString);
		const deviceidFromQuery: string | null = event.url.searchParams.get('deviceid');

		let isAuthenticatedUser = true;
		const ABUserCookie = decryptRightUserCookie(cookieString);
		const sparkHeaderToken = event.request.headers.get('authtoken');
		let token = sparkHeaderToken || ABUserCookie?.NTAccessToken || '';

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
		const scheme = event.url.protocol;
		// using host from x-forwarded & not url.hostname because otherwise we will get container domain and not cloudfare
		const host = event.request.headers.get('x-forwarded-host') || event.request.headers.get('host');

		if (!token) {
			// TODO: Check if Guest token is in Cookie
			token = await getAuthToken('guest');
			isAuthenticatedUser = false;
		}
		serverTiming.start('Get profile and User', 'Timing of get Profile and User');
		const isGuest = isAuthenticatedUser ? false : true;
		if (!userType && isGuest) {
			userType = 'B2C';
			accountType = 'D';
		} else if (!userType && !event.request.url.includes('/api/profile')) {
			profileData = await useProfileFetch(`${scheme}//${host}`, token, fetch);
			userDetails = await useUserDetailsFetch(token, fetch);
			serverTiming.start('ssr generation', 'Timing of SSR generation');
			userType = userDetails?.userType || null;
			accountType = profileData?.dpNumber ? 'D' : 'P';
		}
		serverTiming.end('Get profile and User');

		const isMissingHeaders: boolean =
			(deviceidFromQuery && !event?.request?.headers?.get('deviceid')) || false;

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
			host,
			sparkHeaders: event.request.headers,
			serverTiming,
			shouldSetABUserCookie: sparkHeaderToken ? true : false,
			isMissingHeaders,
			pageUrl: event.request.url
		};
		serverTiming.start('ssr generation', 'Timing of SSR generation');
		const response = await resolve(event);
		serverTiming.end('ssr generation');
		const headers = serverTiming.getHeader() || '';
		if (PUBLIC_ENV_NAME !== 'prod') {
			response.headers.set('Server-Timing', headers);
		}

		if (response.headers.get('Content-Type') === 'text/html') {
			let linkHeader = response.headers.get('link') || '';
			// Add preload link headers
			linkHeader = addPreloadLinkHeaders(linkHeader, event.request.url);

			// Reset and set link headers
			response.headers.delete('link');
			response.headers.set('link', linkHeader);
		}

		return response;
	} catch (e) {
		console.log(
			JSON.stringify({
				level: 'error',
				type: 'Runtime Exception in hooks server',
				params: {
					error: e?.toString()
				}
			})
		);
	}
}) satisfies Handle;

export const handleFetch = (async ({ event, request, fetch }) => {
	const { userType = '', accountType = '', token, sparkHeaders } = event.locals;
	request.headers.set('userType', userType);
	request.headers.set('accountType', accountType);
	request.headers.set('authorization', `Bearer ${token}`);
	request.headers.set('authtoken', token);
	request.headers.set('X-Platform', sparkHeaders?.get('platform') || 'mf-web');

	/* Use MF core internal API for SSR rendered app to avoid internet roundtrip during SSR
	 * Disabled in dev mode
	 */
	if (!dev && PRIVATE_MF_CORE_BASE_URL && request.url.startsWith(PUBLIC_MF_CORE_BASE_URL)) {
		request = new Request(
			request.url.replace(PUBLIC_MF_CORE_BASE_URL, PRIVATE_MF_CORE_BASE_URL),
			request
		);
	}
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

export const handleError = (async ({ error }) => {
	const errorId = crypto.randomUUID();
	const errorStr = error?.stack?.toString() || error?.toString();
	console.log(
		JSON.stringify({
			level: 'error',
			type: 'Runtime Exception in server',
			params: {
				error: errorStr,
				errorId
			}
		})
	);
	return {
		message: 'Something went wrong',
		errorId
	};
}) satisfies HandleServerError;
