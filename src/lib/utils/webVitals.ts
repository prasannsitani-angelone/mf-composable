import Logger from '$lib/utils/logger';

export const logWebVitals = (metricName: string, metric) => {
	if (metricName === 'CLS' || metricName === 'INP') {
		console.log(`${metricName} matching ID ${metric?.id}`, { metric });
		Logger.info({
			type: 'Web Vitals',
			params: {
				name: metric?.name,
				metric
			}
		});
	} else {
		console.log(`${metricName} matching ID ${metric?.id}`, { metric });
	}
};
