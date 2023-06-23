import Analytics from '$lib/utils/analytics';

// eslint-disable-next-line
export const jsDisabled = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 'mf-jsDisabeld',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'mf-jsDisabeld',
		event_property: null,
		event_id: '999.9.9.9.2',
		event_metadata: eventMetaData
	});
};
