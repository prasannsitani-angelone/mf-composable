import Analytics from '$lib/utils/analytics';

export const topFundsImpressionAnalytics = (
	eventMetaData: Record<string, string | Array<Record<string, string | number>>>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'TopCategory',
		event_property: null,
		event_id: '318.0.0.10.12',
		event_metadata: eventMetaData
	});
};
export const topFundsSelectFundAnalytics = (eventMetaData: Record<string, string | number>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'TopCategoryFund',
		event_property: null,
		event_id: '318.0.0.10.13',
		event_metadata: eventMetaData
	});
};
