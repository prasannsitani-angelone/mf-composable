import type { SparkStore } from '$lib/stores/SparkStore';
import type { TokenStore } from '$lib/stores/TokenStore';
import type { LayoutServerLoad } from '../$types';
import type { UserProfile } from '$lib/types/IUserProfile';
import { useProfileFetch } from '$lib/utils/useProfileFetch';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import { useUserDetailsFetch } from '$lib/utils/useUserDetailsFetch';
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

const getsearchDashboardData = async (fetch) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`;
	const res = await useFetch(url, {}, fetch);
	if (res.ok) {
		const discoverFundData = res.data;
		return {
			...discoverFundData
		};
	} else {
		return {
			searchOptions: [],
			weeklyTopSchemes: []
		};
	}
};

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

export const load = (async ({ url, request, locals, cookies, fetch }) => {
	const sparkHeaders: SparkStore = getSparkHeaders(request.headers);
	const {
		isGuest,
		userType,
		accountType,
		userDetails,
		profileData,
		token = '',
		refreshToken = '',
		serverTiming
	} = locals;

	const tokenObj: TokenStore = {
		userToken: {
			NTAccessToken: '',
			NTRefreshToken: ''
		},
		guestToken: ''
	};
	let localProfileData: UserProfile = profileData;
	let localUserDetails: IUserDetails = userDetails;
	cookies.set('UserType', userType, getCookieOptions());
	cookies.set('AccountType', accountType, getCookieOptions());

	if (isGuest) {
		tokenObj.guestToken = token;
		cookies.set(NON_LOGGED_IN_COOKIE, tokenObj.guestToken, getCookieOptions(false));
	} else {
		tokenObj.userToken = {
			NTAccessToken: token,
			NTRefreshToken: refreshToken
		};
		cookies.set(
			getUserCookieName(),
			encryptToken(tokenObj.userToken) || '',
			getUserCookieOptions(false)
		);
	}
	if (!localProfileData?.clientId && !isGuest) {
		localProfileData = await useProfileFetch(url.origin, token, fetch);
		cookies.set('AccountType', localProfileData?.dpNumber ? 'D' : 'P', getCookieOptions());
	}
	if (!localUserDetails?.userType && !isGuest) {
		localUserDetails = await useUserDetailsFetch(token, fetch);
		cookies.set('UserType', localUserDetails?.userType, getCookieOptions());
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
				}
			}
		})
	);

	serverTiming.start('getsearchDashboardData', 'Timing of getsearchDashboardData');

	const searchDashboardData = await getsearchDashboardData(fetch);

	serverTiming.end('getsearchDashboardData');
	return {
		sparkHeaders,
		profile: localProfileData,
		tokenObj,
		searchDashboardData,
		isGuest,
		userDetails: localUserDetails
	};
}) satisfies LayoutServerLoad;
