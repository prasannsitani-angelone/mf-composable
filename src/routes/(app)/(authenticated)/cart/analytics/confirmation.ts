import Analytics from '$lib/utils/analytics';

export const mountAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CheckOutConfirmation',
		event_type: 'impressions',
		event_sub_type: 'screen',
		event_name: 'ConfirmCheckOut',
		event_property: null,
		event_id: '315.0.0.3.0'
	});
};

export const clickCheckoutAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CheckOutConfirmation',
		event_type: 'click',
		event_sub_type: 'Button',
		event_name: 'CartPayNow',
		event_property: null,
		event_id: '315.0.0.3.1',
		event_metadata: eventMetaData
	});
};

export const changePaymentMethodAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CheckOutConfirmation',
		event_type: 'click',
		event_sub_type: 'Button',
		event_name: 'CartChangePaymentMethod',
		event_property: null,
		event_id: '315.0.0.3.2'
	});
};

export const mountChangePaymentMethodAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangeCartPaymentmethod',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-ChangeCartPaymentmethod',
		event_property: null,
		event_id: '315.0.0.4.0',
		event_metadata: eventMetaData
	});
};

export const paymentModeScreenPayButtonClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangeCartPaymentmethod',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'PayFromPaymentMethodPage',
		event_property: null,
		event_id: '315.0.0.4.5',
		event_metadata: eventMetaData
	});
};

export const paymentPendingScreenAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymenpending',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'bs-paymenpending',
		event_property: null,
		event_id: '315.0.0.5.0',
		event_metadata: eventMetaData
	});
};

export const paymentPendingScreenCloseButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymenpending',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'close',
		event_property: null,
		event_id: '315.0.0.5.1'
	});
};

export const paymentFailedScreenAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymenfailed',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'bs-paymenfailed',
		event_property: null,
		event_id: '315.0.0.6.0',
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
		event_id: '315.0.0.6.1'
	});
};
