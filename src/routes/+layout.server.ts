import type { SparkStore } from '$lib/stores/SparkStore';
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
	'deviceosversion',
	'paymentapps',
	'sessionId',
	'linkedmembers',
	'isTabView'
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
		deviceosversion: '',
		paymentapps: '',
		sessionId: '',
		linkedmembers: {
			selected: []
		},
		isTabView: false
	};

	sparkHeadersList.forEach((list) => {
		sparkHeaders[list] = headers.get(list) || '';
	});

	return sparkHeaders;
};

export const load = (async ({ request, locals }) => {
	// Device type will be available in PageData across the app
	const sparkHeaders = getSparkHeaders(request.headers);

	const { scheme, host, deviceType, token, isMissingHeaders, isGuest, sparkQuery } = locals;

	console.log(
		JSON.stringify({
			type: 'SSR Navigation Route Level',
			params: {
				locals: {
					sparkHeaders,
					sparkQuery
				},
				url: request?.url
			}
		})
	);

	return {
		scheme,
		host,
		deviceType,
		token,
		isGuest,
		sparkHeaders,
		isMissingHeaders,
		sparkQuery
	};
}) satisfies LayoutServerLoad;
