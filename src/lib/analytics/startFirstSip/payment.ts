import Analytics from '$lib/utils/analytics';

export const landedOnPaymentScreenAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PaymentScreen',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Paymentscreen',
		event_property: null,
		event_id: '308.0.0.6.28',
		event_metadata: eventMetaData
	});
};

export const paymentRadioClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PaymentScreen',
		event_type: 'click',
		event_sub_type: 'radiobutton',
		event_name: 'PaymentMode',
		event_property: null,
		event_id: '308.0.0.6.29',
		event_metadata: eventMetaData
	});
};

export const paymentOnPayClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PaymentScreen',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Pay',
		event_property: null,
		event_id: '308.0.0.6.30',
		event_metadata: eventMetaData
	});
};

export const paymentOnRequestResponseAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PaymentScreen',
		event_type: 'API',
		event_sub_type: 'RequestResponse',
		event_name: 'PaymentValidationAPI',
		event_property: null,
		event_id: '308.0.0.6.31',
		event_metadata: eventMetaData
	});
};

export const paymentFailureScreenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PaymentScreen',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'bs-paymentfailure',
		event_property: null,
		event_id: '308.0.0.6.32'
	});
};

export const onRetryClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymentfailed',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Retry',
		event_property: null,
		event_id: '308.0.0.6.33'
	});
};

export const paymentPendingScreenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-PaymentScreen',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'bs-paymentpending',
		event_property: null,
		event_id: '308.0.0.6.34'
	});
};

export const onPendingScreenCloseClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymentpending',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Close',
		event_property: null,
		event_id: '308.0.0.6.35'
	});
};

export const onOrderSummaryScreenAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ordersummary',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'ordersummary',
		event_property: null,
		event_id: '308.0.0.6.36',
		event_metadata: eventMetaData
	});
};

export const onGotoOrdersClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ordersummary',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'vieworderdetails',
		event_property: null,
		event_id: '308.0.0.6.37',
		event_metadata: eventMetaData
	});
};

export const exitOrderSummaryScreenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ordersummary',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'cross',
		event_property: null,
		event_id: '308.0.0.6.38'
	});
};
