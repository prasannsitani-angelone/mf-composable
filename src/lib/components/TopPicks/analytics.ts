import Analytics from '$lib/utils/analytics';

export const topPicksCategoryImpressionEvent = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'TopPicks',
		event_property: null,
		event_id: '308.0.0.6.47',
		event_metadata: eventMetaData
	});
};

export const topPicksSubCategoryClickEvent = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-TopPicks',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FundName',
		event_property: null,
		event_id: '308.0.0.6.48',
		event_metadata: eventMetaData
	});
};
