import Analytics from '$lib/utils/analytics';

export const portfolioCardExpandClickEvent = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'click',
		event_sub_type: 'chevron',
		event_name: 'bluecardchevron',
		event_property: null,
		event_id: '306.0.0.13.22',
		event_metadata: eventMetaData
	});
};
export const portfolioCardExpandImpressionEvent = (eventMetaData: object) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-investments',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'expandedbluecard',
		event_property: null,
		event_id: '306.0.0.13.23',
		event_metadata: eventMetaData
	});
};
