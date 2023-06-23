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
