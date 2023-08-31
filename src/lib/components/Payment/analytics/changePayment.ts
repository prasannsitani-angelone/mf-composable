import Analytics from '$lib/utils/analytics';

export const selectPaymentModeAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangePaymentmethod',
		event_type: 'click',
		event_sub_type: 'radiobutton',
		event_name: 'pmtmodeselection',
		event_property: null,
		event_id: '310.0.0.1.10',
		event_metadata: eventMetaData
	});
};
