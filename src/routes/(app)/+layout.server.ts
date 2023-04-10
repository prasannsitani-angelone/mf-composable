import type { SparkStore } from '$lib/stores/SparkStore';
import type { TokenStore } from '$lib/stores/TokenStore';
import type { LayoutServerLoad } from '../$types';
import type { UserProfile } from '$lib/types/IUserProfile';

import { useProfileFetch } from '$lib/utils/useProfileFetch';
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

export const load = (async ({ url, request, locals, cookies }) => {
	const sparkHeaders: SparkStore = getSparkHeaders(request.headers);
	const { isGuest, userType, accountType, profileData, scheme, host, token = '', refreshToken = '' } = locals;
	const tokenObj: TokenStore = {
		userToken: {
			NTAccessToken: '',
			NTRefreshToken: ''
		},
		guestToken: ''
	};
	let localProfileData: UserProfile = profileData;

	cookies.set('UserType', userType);
	cookies.set('AccountType', accountType);

	if (isGuest) {
		tokenObj.guestToken = token;
	} else {
		tokenObj.userToken = {
			NTAccessToken: token,
			NTRefreshToken: refreshToken
		};
	}
	if (!localProfileData.clientId && !isGuest) {
		localProfileData = await useProfileFetch(url.origin, locals);
		cookies.set('UserType', localProfileData?.userType);
		cookies.set('AccountType', localProfileData?.dpNumber ? 'D' : 'P');
	}

	return {
		sparkHeaders,
		profile: localProfileData,
		tokenObj,
		scheme,
		host
	};
}) satisfies LayoutServerLoad;
