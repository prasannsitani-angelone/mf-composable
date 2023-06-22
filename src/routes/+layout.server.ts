import type { LayoutServerLoad } from './(app)/$types';
import type { SparkStore } from '$lib/stores/SparkStore';

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

export const load = (async ({ request, locals }) => {
	// Device type will be available in PageData across the app
	const sparkHeaders = getSparkHeaders(request.headers);

	const { scheme, host, deviceType, token, isGuest } = locals;

	return {
		scheme,
		host,
		deviceType,
		token,
		isGuest,
		sparkHeaders
	};
}) satisfies LayoutServerLoad;
