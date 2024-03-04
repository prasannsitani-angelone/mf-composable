import Analytics from '$lib/utils/analytics';

export const trendingFundsImpressionAnalytics = (
	eventMetaData: Record<string, string | Array<Record<string, string | number>>>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Trending',
		event_property: null,
		event_id: '308.0.0.10.14',
		event_metadata: eventMetaData
	});
};
export const trendingFundsSelectFundAnalytics = (
	eventMetaData: Record<string, string | number>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'TrendingFund',
		event_property: null,
		event_id: '308.0.0.10.15',
		event_metadata: eventMetaData
	});
};
