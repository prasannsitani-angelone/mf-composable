import Logger from '$lib/utils/logger';

export const logWebVitals = (metricName: string, metric) => {
	Logger.info({
		type: 'Web Vitals',
		params: {
			name: metric?.name,
			metric
		}
	});
};
