import type { SparkStore } from '$lib/stores/SparkStore';
import type { TokenStore } from '$lib/stores/TokenStore';
import type { LayoutServerLoad } from '../$types';
import type { UserProfile } from '$lib/types/IUserProfile';

import type { IUserDetails } from '$lib/types/IUserDetails';
import {
	NON_LOGGED_IN_COOKIE,
	encryptToken,
	getCookieOptions,
	getUserCookieName,
	getUserCookieOptions
} from '$lib/utils/helpers/token';
const sparkHeadersList: Array<keyof SparkStore> = [
	'platform',
	'platformversion',
	'platformvariant',
	'theme',
	'clevertapclientid',
	'guest',
	'deviceid',
	'closecta',
	'deviceosversion'
];

const getSparkHeaders = (headers: Headers) => {
	const sparkHeaders: SparkStore = {
		platform: '',
		platformversion: '',
		platformvariant: '',
		theme: '',
		clevertapclientid: '',
		guest: null,
		deviceid: '',
		closecta: '',
		deviceosversion: ''
	};

	sparkHeadersList.forEach((list) => {
		sparkHeaders[list] = headers.get(list) || '';
	});

	return sparkHeaders;
};

export const load = (async ({ request, locals, cookies }) => {
	const sparkHeaders: SparkStore = getSparkHeaders(request.headers);

	const {
		isGuest,
		userType,
		accountType,
		userDetails,
		profileData,
		token = '',
		refreshToken = '',
		shouldSetABUserCookie,
		investementSummary,
		searchDashboardData
	} = locals;

	const tokenObj: TokenStore = {
		userToken: {
			NTAccessToken: '',
			NTRefreshToken: ''
		},
		guestToken: ''
	};
	const localProfileData: UserProfile = profileData;
	const localUserDetails: IUserDetails = userDetails;
	cookies.set('UserType', userType, getCookieOptions(false));
	cookies.set('AccountType', accountType, getCookieOptions(false));

	if (isGuest) {
		tokenObj.guestToken = token;
		cookies.set(NON_LOGGED_IN_COOKIE, tokenObj.guestToken, getCookieOptions(false));
	} else {
		tokenObj.userToken = {
			NTAccessToken: token,
			NTRefreshToken: refreshToken
		};
		if (shouldSetABUserCookie) {
			cookies.set(
				getUserCookieName(),
				encryptToken(tokenObj.userToken) || '',
				getUserCookieOptions(false)
			);
		}
	}

	console.log(
		JSON.stringify({
			type: 'SSR Navigation',
			params: {
				locals: {
					...locals,
					token: token ? 'xxxx' : '',
					refreshToken: refreshToken ? 'xxxx' : '',
					profileData: localProfileData,
					sparkHeaders
				},
				url: request?.url
			}
		})
	);
	return {
		sparkHeaders,
		profile: localProfileData,
		tokenObj,
		searchDashboardData,
		isGuest,
		userDetails: localUserDetails,
		investementSummary
	};
}) satisfies LayoutServerLoad;
