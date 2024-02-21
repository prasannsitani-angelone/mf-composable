import Analytics from '$lib/utils/analytics';

export const trendingCardImpressionEvent = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Mostboughtonangelone',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'Mostboughtonangelone',
		event_property: null,
		event_id: '308.0.0.6.12',
		event_metadata: eventMetaData
	});
};

export const trendingCardClickEvent = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Mostboughtonangelone',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FundName',
		event_property: null,
		event_id: '308.0.0.6.13',
		event_metadata: eventMetaData
	});
};

export const trendingCartClickEvent = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Mostboughtonangelone',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'AddtoCart',
		event_property: null,
		event_id: '308.0.0.6.14',
		event_metadata: eventMetaData
	});
};
