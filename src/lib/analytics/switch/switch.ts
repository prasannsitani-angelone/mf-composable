import Analytics from '$lib/utils/analytics';

export const switchHamburgerIconClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-invesmentdetails',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'hamburger',
		event_property: null,
		event_id: '311.0.0.1.1'
	});
};

export const switchOptionsOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-invesmentdetails',
		event_type: 'impression',
		event_sub_type: 'bottomsheet',
		event_name: 'bs-switch',
		event_property: null,
		event_id: '311.0.0.1.2'
	});
};
