import Analytics from '$lib/utils/analytics';

export const curatedCardImpressionEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-homepage',
		event_type: 'impression',
		event_sub_type: 'banner',
		event_name: 'PortfolioBuilder_homepage',
		event_property: null,
		event_id: '317.0.0.0.1'
	});
};

export const curatedCardClickEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-homepage',
		event_type: 'click',
		event_sub_type: 'banner',
		event_name: 'PortfolioBuilder_homepage_click',
		event_property: null,
		event_id: '317.0.0.0.2'
	});
};
