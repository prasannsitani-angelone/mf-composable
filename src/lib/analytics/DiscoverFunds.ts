import Analytics from '$lib/utils/analytics';

export const nudgeImpression = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'setautopay',
		event_property: null,
		event_id: '308.0.0.1.18'
	});
};

export const nudgeClick = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'setautopay',
		event_property: null,
		event_id: '308.0.0.1.7'
	});
};
