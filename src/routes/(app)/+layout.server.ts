import type { SparkStore } from '$lib/stores/SparkStore';
import type { TokenStore } from '$lib/stores/TokenStore';
import type { LayoutServerLoad } from '../$types';
import { base } from '$app/paths';
import type { User } from '$lib/types/IUserType';
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

export const load = (async ({ request, fetch }) => {
	const sparkHeaders: SparkStore = getSparkHeaders(request.headers);

	const authToken = request.headers.get('authToken') || '';
	const isGuest = request.headers.get('isGuest');
	const tokenStore: TokenStore = {
		userToken: '',
		guestToken: ''
	};

	if (isGuest === 'true') {
		tokenStore.guestToken = authToken;
	} else {
		tokenStore.userToken = authToken;
	}

	const userData = async () => {
		const res = await fetch(`${base}/api/user`, {});
		const user: User = await res.json();
		return {
			...user
		};
	};

	const profileData = async () => {
		const res = await fetch(`${base}/api/profile`, {});
		const resData = await res.json();
		const { data }: { data: UserProfile } = resData;
		return {
			...data
		};
	};
	return {
		sparkHeaders,
		tokenStore,
		user: await userData(),
		profile: await profileData()
	};
}) satisfies LayoutServerLoad;
