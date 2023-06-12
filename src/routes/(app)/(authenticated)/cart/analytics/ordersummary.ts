import Analytics from '$lib/utils/analytics';

export const mountAnalytics = (eventMetaData: Record<string, number | Array<object>>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CartPaymentSuccessful',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-Cartordersummary',
		event_property: null,
		event_id: '315.0.0.7.0',
		event_metadata: eventMetaData
	});
};

export const setUpAutoPayClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CartPaymentSuccessful',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SetUp AutoPay',
		event_property: null,
		event_id: '315.0.0.7.1'
	});
};

export const goToOrders = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CartPaymentSuccessful',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'GOTOOrders',
		event_property: null,
		event_id: '315.0.0.7.2'
	});
};
