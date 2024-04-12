import {
	onCLSAnalytics,
	onFCPAnalytics,
	onINPAnalytics,
	onLCPAnalytics,
	onTTFBAnalytics
} from '$lib/analytics/AppMounted';
import Logger from '$lib/utils/logger';

export const logWebVitals = (
	metricName: string,
	metric: object,
	pathname: string,
	connectionDetails: object
) => {
	Logger.info({
		type: 'Web Vitals',
		pathname,
		params: {
			name: metricName,
			metric,
			connectionDetails
		}
	});

	const eventMetaData = { metric, connectionDetails };
	switch (metricName?.toUpperCase()) {
		case 'CLS':
			onCLSAnalytics(eventMetaData);
			break;
		case 'INP':
			onINPAnalytics(eventMetaData);
			break;
		case 'LCP':
			onLCPAnalytics(eventMetaData);
			break;
		case 'FCP':
			onFCPAnalytics(eventMetaData);
			break;
		case 'TTFB':
			onTTFBAnalytics(eventMetaData);
			break;
	}
};
