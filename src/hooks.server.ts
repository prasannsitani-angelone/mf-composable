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
import { handleDeviecDetector } from 'sveltekit-device-detector';
import { PRIVATE_MF_CORE_BASE_URL, PRIVATE_MF_CORE_BASE_URL_V2 } from '$env/static/private';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { dev } from '$app/environment';
import { getHoldingSummary } from '$lib/api/holdings';
import type { InvestmentSummary } from '$lib/types/IInvestments';
import { getsearchDashboardData } from '$lib/api/getSearchDashboard';
// import { accountType } from '$lib/utils/getAccountType';
// import { getHashKey } from '$lib/server/getHashKey';
const deviceDetector = handleDeviecDetector({});

// const swCacheHeader = 'X-Sw-Cache';

// const generateCacheHeader = (
// 	userType: 'B2B' | 'B2C',
// 	accountType: 'D' | 'P',
// 	holdings = 0,
// 	deviceType: DevicePayload
// ) => {
// 	const cacheKey = `${userType},${accountType}${holdings}${
// 		deviceType.isMobile ? 'mobile' : 'browser'
// 	}`;

// 	return getHashKey(cacheKey)?.toString();
// };

const addPreloadLinkHeaders = (linkHeader = '', url: string) => {
	linkHeader = `</mutual-funds/fonts/Roboto-Regular.woff2>;rel="preload";as="font";type="font/woff";nopush;crossorigin,</mutual-funds/fonts/Roboto-Medium.woff2>;rel="preload";as="font";type="font/woff";nopush;crossorigin,${linkHeader}`;
	if (url.includes('/discoverfunds')) {
		linkHeader = `<https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail1c2.webp>;rel="preload";as="image";nopush,<https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail2c2.webp>;rel="preload";as="image";nopush,<https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail3c2.webp>;rel="preload";as="image";nopush,<https://cdn.angelone.in/mutualfunds/smallThumbnails/thumbnail4c2.webp>;rel="preload";as="image";nopush,${linkHeader}`;
	}
	return linkHeader;
};
const addSecurityHeaders = (response: Response) => {
	response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Referrer-Policy', 'strict-origin');
	response.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://*.angelone.in;");
	response.headers.set('Strict-Transport-Security', 'max-age=31536000');
	response.headers.set('X-Content-Type-Options', 'nosniff');

	return response;
};
const handler = (async ({ event, resolve }) => {
	try {
		const cookieString = event.request.headers.get('cookie') || '';
		const deviceidFromQuery: string | null = event.url.searchParams.get('deviceid');

		let isAuthenticatedUser = true;
		const ABUserCookie = decryptRightUserCookie(cookieString);
		const sparkHeaderToken = event.request.headers.get('authtoken');
		let token = sparkHeaderToken || ABUserCookie?.NTAccessToken || '';

		const refreshToken =
			event.request.headers.get('refreshtoken') || ABUserCookie?.NTRefreshToken || '';
		let profileData: UserProfile = {
			clientId: '',
			userType: 'B2C',
			dpNumber: 'D'
		};

		let investementSummary: InvestmentSummary = {};
		let userDetails: IUserDetails = {
			userType: 'B2C'
		};
		const scheme = event.url.protocol;
		// using host from x-forwarded & not url.hostname because otherwise we will get container domain and not cloudfare
		const host = event.request.headers.get('x-forwarded-host') || event.request.headers.get('host');

		if (!token) {
			// TODO: Check if Guest token is in Cookie
			token = await getAuthToken('guest');
			isAuthenticatedUser = false;
		}
		const isGuest = isAuthenticatedUser ? false : true;
		let searchDashboardData;

		if (!event.request.url.includes('/api/')) {
			const searchDashboardPromise = getsearchDashboardData(
				token,
				fetch,
				PRIVATE_MF_CORE_BASE_URL_V2
			);

			if (isGuest) {
				searchDashboardData = await searchDashboardPromise;
			} else if (isAuthenticatedUser) {
				const investementSummaryPromise = getHoldingSummary(token, fetch, PRIVATE_MF_CORE_BASE_URL);

				const profilePromise = useProfileFetch(token, fetch);
				const userPromise = useUserDetailsFetch(token, fetch, PRIVATE_MF_CORE_BASE_URL);
				const userData = await Promise.allSettled([
					profilePromise,
					userPromise,
					investementSummaryPromise,
					searchDashboardPromise
				]);

				profileData = userData[0]?.value;
				userDetails = userData[1]?.value;
				investementSummary = userData[2]?.value;
				searchDashboardData = userData[3]?.value;
			}
			if (userDetails?.userType === 'B2B') {
				searchDashboardData = await getsearchDashboardData(
					token,
					fetch,
					PRIVATE_MF_CORE_BASE_URL_V2,
					'B2B'
				);
			}
		}

		const isMissingHeaders: boolean =
			(deviceidFromQuery && !event?.request?.headers?.get('deviceid')) || false;

		event.locals = {
			...event.locals,
			token,
			refreshToken,
			isGuest,
			userDetails,
			profileData,
			scheme,
			host,
			sparkHeaders: event.request.headers,
			sparkQuery: {
				deviceid: deviceidFromQuery
			},
			shouldSetABUserCookie: sparkHeaderToken ? true : false,
			isMissingHeaders,
			pageUrl: event.request.url,
			investementSummary,
			searchDashboardData
		};

		let response = await resolve(event);

		if (response.headers.get('Content-Type') === 'text/html') {
			// Remove Preload link resource to increase FCP
			response.headers.delete('link');
			let linkHeader = response.headers.get('link') || '';
			// Add preload link headers
			linkHeader = addPreloadLinkHeaders(linkHeader, event.request.url);

			response.headers.set('link', linkHeader);

			response = addSecurityHeaders(response);

			// Set the cache header
			// response.headers.set(
			// 	swCacheHeader,
			// 	generateCacheHeader(
			// 		userDetails?.userType,
			// 		accountType(profileData, isGuest),
			// 		investementSummary?.investedValue,
			// 		event?.locals?.deviceType
			// 	)
			// );
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
	const { userDetails, profileData, isGuest, token, sparkHeaders } = event.locals;
	const userType = userDetails?.userType;
	const accountType = isGuest || profileData?.dpNumber ? 'D' : 'P';
	request.headers.set('userType', userType);
	request.headers.set('accountType', accountType);
	request.headers.set('authorization', `Bearer ${token}`);
	request.headers.set(
		'X-Platform',
		`${sparkHeaders?.get('platform')?.toLowerCase() || 'mf-web'}_${
			sparkHeaders?.get('platformvariant')?.toLowerCase() || 'web'
		}`
	);

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
