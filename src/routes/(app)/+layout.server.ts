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

const getCartData = async (fetch, isGuest: boolean) => {
	if (isGuest) {
		return {
			data: []
		};
	}
	const url = `${PUBLIC_MF_CORE_BASE_URL}/carts/items`;
	const res = await useFetch(url, {}, fetch);
	if (res.ok) {
		const cartItems = res.data;
		return {
			...cartItems
		};
	} else {
		return {
			data: []
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

export const load = (async ({ request, locals, cookies, fetch }) => {
	const sparkHeaders: SparkStore = getSparkHeaders(request.headers);
	const {
		isGuest,
		userType,
		accountType,
		userDetails,
		profileData,
		token = '',
		refreshToken = '',
		serverTiming,
		scheme,
		host,
		shouldSetABUserCookie
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
	if (!localProfileData?.clientId && !isGuest) {
		localProfileData = await useProfileFetch(`${scheme}//${host}`, token, fetch);
		cookies.set('AccountType', localProfileData?.dpNumber ? 'D' : 'P', getCookieOptions(false));
	}
	if (!localUserDetails?.userType && !isGuest) {
		localUserDetails = await useUserDetailsFetch(token, fetch);
		cookies.set('UserType', localUserDetails?.userType, getCookieOptions(false));
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

	serverTiming.start('getsearchDashboardData', 'Timing of getsearchDashboardData');

	const searchDashboardData = await getsearchDashboardData(fetch);
	const cartItems = await getCartData(fetch, isGuest);

	serverTiming.end('getsearchDashboardData');
	return {
		sparkHeaders,
		profile: localProfileData,
		tokenObj,
		searchDashboardData,
		cartItems,
		isGuest,
		userDetails: localUserDetails
	};
}) satisfies LayoutServerLoad;
