import type { SparkStore } from '$lib/stores/SparkStore';
import type { TokenStore } from '$lib/stores/TokenStore';
import type { LayoutServerLoad } from '../$types';
import { base } from '$app/paths';
import type { UserProfile } from '$lib/types/IUserProfile';
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

export const load = (async ({ request, fetch, locals }) => {
	const sparkHeaders: SparkStore = getSparkHeaders(request.headers);
	const token = locals.token || '';
	const refreshtoken = locals.refreshToken || '';
	const isGuest = locals.isGuest;
	const tokenObj: TokenStore = {
		userToken: {
			NTAccessToken: '',
			NTRefreshToken: ''
		},
		guestToken: ''
	};
	let profileData = {};

	const getProfileData = async () => {
		const res = await fetch(`${base}/api/profile`, {});
		const resData = await res.json();
		const { data }: { data: UserProfile } = resData;
		return {
			...data
		};
	};

	if (isGuest === 'true') {
		tokenObj.guestToken = token;
	} else {
		profileData = await getProfileData();
		tokenObj.userToken = {
			NTAccessToken: token,
			NTRefreshToken: refreshtoken
		};
	}

	return {
		sparkHeaders,
		profile: profileData,
		tokenObj
	};
}) satisfies LayoutServerLoad;
