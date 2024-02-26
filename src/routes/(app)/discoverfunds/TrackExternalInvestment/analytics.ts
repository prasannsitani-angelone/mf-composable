import Analytics from '$lib/utils/analytics';

export const externalFundsNudgeImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'TrackFunds',
		event_property: null,
		event_id: '308.0.0.10.20'
	});
};

export const externalFundsNudgeClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Homepage',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'Tracknow',
		event_property: null,
		event_id: '308.0.0.10.21'
	});
};
