import type { SparkStore } from '$lib/stores/SparkStore';
import type { TokenStore } from '$lib/stores/TokenStore';
import type { LayoutServerLoad } from '../$types';
import type { UserProfile } from '$lib/types/IUserProfile';

import { useProfileFetch } from '$lib/utils/useProfileFetch';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import { useUserDetailsFetch } from '$lib/utils/useUserDetailsFetch';
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
		refreshToken = ''
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
	cookies.set('UserType', userType, {
		path: '/'
	});
	cookies.set('AccountType', accountType, {
		path: '/'
	});

	if (isGuest) {
		tokenObj.guestToken = token;
	} else {
		tokenObj.userToken = {
			NTAccessToken: token,
			NTRefreshToken: refreshToken
		};
	}
	if (!localProfileData?.clientId && !isGuest) {
		localProfileData = await useProfileFetch(url.origin, token, fetch);

		cookies.set('AccountType', localProfileData?.dpNumber ? 'D' : 'P', {
			path: '/'
		});
	}
	if (!localUserDetails?.userType && !isGuest) {
		localUserDetails = await useUserDetailsFetch(token, fetch);
		cookies.set('UserType', localUserDetails?.userType, {
			path: '/'
		});
	}
	console.log(
		JSON.stringify({
			type: 'Initial Application Params',
			params: {
				locals: {
					...locals,
					token: token ? 'xxxx' : '',
					refreshToken: refreshToken ? 'xxxx' : '',
					profileData: localProfileData
				},
				cookie: cookies.getAll()
			}
		})
	);

	const searchDashboardData = await getsearchDashboardData(fetch);
	return {
		sparkHeaders,
		profile: localProfileData,
		tokenObj,
		searchDashboardData,
		isGuest
	};
}) satisfies LayoutServerLoad;
