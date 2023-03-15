import type { SparkStore } from '$lib/stores/SparkStore';
import type { TokenStore } from '$lib/stores/TokenStore';
import type { LayoutServerLoad } from '../$types';
import { base } from '$app/paths';
import type { UserProfile } from '$lib/types/IUserProfile';
import { get } from '$lib/api';
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

export const load = (async ({ request, fetch, locals, cookies }) => {
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
		const profilData = await get(`http://127.0.0.1:3000/mutual-funds-v2/api/profile`, locals);
		const { data }: { data: UserProfile } = profilData;
		return {
			...data
		};
	};

	if (isGuest === 'true') {
		tokenObj.guestToken = token;
		cookies.set('UserType', 'B2C')
		cookies.set('AccountType', 'D')
	} else {
		profileData = await getProfileData();
		console.log(profileData)
		tokenObj.userToken = {
			NTAccessToken: token,
			NTRefreshToken: refreshtoken
		};
		cookies.set('UserType', profileData.userType)
		cookies.set('AccountType', "D")
	}

	return {
		sparkHeaders,
		profile: profileData,
		tokenObj
	};
}) satisfies LayoutServerLoad;
