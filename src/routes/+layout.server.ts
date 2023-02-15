import type { SparkStore } from '$lib/stores/SparkStore';
import type { TokenStore } from '$lib/stores/TokenStore';
import useFetch from '$lib/utils/useFetch';
import type { LayoutServerLoad } from './$types';

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

	const data = await fetch(
		'https://support-web-mf-uat.angelbroking.com/api/link?employeeCode=E12345&limit=5&offset=0'
	);
	const dummy = data.json();

	if (isGuest === 'true') {
		tokenStore.guestToken = authToken;
	} else {
		tokenStore.userToken = authToken;
	}
	return {
		sparkHeaders,
		tokenStore
	};
}) satisfies LayoutServerLoad;
