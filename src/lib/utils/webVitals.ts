import Logger from '$lib/utils/logger';

export const logWebVitals = (metricName: string, metric, pathname: string) => {
	Logger.info({
		type: 'Web Vitals',
		pathname,
		params: {
			name: metricName,
			metric
		}
	});
};
