import { PUBLIC_ANALYTICS_URL, PUBLIC_ANALYTICS_ENABLED } from '$env/static/public';
import type { PageServerLoad } from './$types';
import Analytics from '$lib/utils/analytics';
import { jsDisabled } from '$lib/analytics/JsDisabled';

export const load = (async ({ request, parent }) => {
	const layoutData = await parent();
	await Analytics.init({
		batchSize: 1,
		baseUrl: '',
		url: PUBLIC_ANALYTICS_URL,
		enabled: PUBLIC_ANALYTICS_ENABLED,
		initialised: true
	});
	const jsDisabledLogs = {
		...layoutData,
		token: layoutData?.token ? 'xxxx' : '',
		refreshToken: layoutData?.refreshToken ? 'xxxx' : '',
		sparkHeaders: layoutData?.sparkHeaders,
		tokenObj: {},
		searchDashboardData: {},
		cohortConfig: {}
	};
	jsDisabled({
		...jsDisabledLogs
	});
	console.log(
		JSON.stringify({
			type: 'JS Disabled',
			params: {
				layoutData: jsDisabledLogs,
				url: request?.url
			}
		})
	);
	return {};
}) satisfies PageServerLoad;
