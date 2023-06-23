import Analytics from '$lib/utils/analytics';

// eslint-disable-next-line
export const impressionWithoutHeaders = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf-impressionWithoutHeaders',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'mf-impressionWithoutHeaders',
		event_property: null,
		event_id: '999.9.9.9.3',
		event_metadata: eventMetaData
	});
};
