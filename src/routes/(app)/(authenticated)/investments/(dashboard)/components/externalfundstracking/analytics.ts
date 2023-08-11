import Analytics from '$lib/utils/analytics';

export const stopExternalFundTrackingClickEvent = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-stoptracking',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'stoptracking',
		event_property: null,
		event_id: '313.0.0.0.8'
	});
};

export const stopExternalFundTrackingConfirmClickEvent = (eventMetaData: { confirm: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-stoptrackingfund',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'stoptrackingfund',
		event_property: null,
		event_id: '313.0.0.0.9',
		event_metadata: eventMetaData
	});
};
