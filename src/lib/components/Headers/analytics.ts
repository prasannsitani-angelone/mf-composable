import Analytics from '$lib/utils/analytics';

export const crossButtonClickEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'close',
		event_name: 'cross_button',
		event_property: null,
		event_id: '308.0.0.6.46'
	});
};
