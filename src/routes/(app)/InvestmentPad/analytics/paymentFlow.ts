import Analytics from '$lib/utils/analytics';

export const upiInitiateScreenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-upiinitiatescreen',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-upiinitiatescreen',
		event_property: null,
		event_id: '310.0.0.1.16'
	});
};

export const paymentFailedScreenAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymenfailed',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'bs-paymenfailed',
		event_property: null,
		event_id: '310.0.0.1.19',
		event_metadata: eventMetaData
	});
};

export const paymentFailedScreenCloseButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymenfailed',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'retry',
		event_property: null,
		event_id: '310.0.0.1.20'
	});
};
