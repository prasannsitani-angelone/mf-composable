import Analytics from '$lib/utils/analytics';

export const exploreCardClickEvent = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'MF',
		event_property: null,
		event_id: '308.0.0.1.2',
		event_metadata: eventMetaData
	});
};
