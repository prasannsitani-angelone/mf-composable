import Analytics from '$lib/utils/analytics';

export const promotionsCardImpressionEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'S-banner',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'FundofMonth',
		event_property: null,
		event_id: '308.0.0.6.44'
	});
};
export const promotionsCardClickEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'S-banner',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Explore',
		event_property: null,
		event_id: '308.0.0.6.45'
	});
};
