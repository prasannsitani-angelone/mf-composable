import Analytics from '$lib/utils/analytics';

// eslint-disable-next-line
export const appMount = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf-appMount',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'mf-appMount',
		event_property: null,
		event_id: '999.9.9.9.1',
		event_metadata: eventMetaData
	});
};
// eslint-disable-next-line
export const webVitalsAnalytics = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf-webVitals',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'mf-webVitals',
		event_property: null,
		event_id: '999.9.9.9.5',
		event_metadata: eventMetaData
	});
};

export const appForeground = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf_screen',
		event_type: 'AppLaunch',
		event_sub_type: 'Foreground',
		event_name: 'AppForeground_mf',
		event_property: null,
		event_id: '323.0.0.1.0'
	});
};

export const appBackground = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf_screen',
		event_type: 'AppLaunch',
		event_sub_type: 'Background',
		event_name: 'AppBackground_mf',
		event_property: null,
		event_id: '323.0.0.1.1'
	});
};
