import Analytics from '$lib/utils/analytics';

export const selectNetBankingPaymentModeAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangePaymentmethod',
		event_type: 'click',
		event_sub_type: 'radiobutton',
		event_name: 'netbanking',
		event_property: null,
		event_id: '310.0.0.1.10'
	});
};

export const selectUpiPaymentModeAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangePaymentmethod',
		event_type: 'click',
		event_sub_type: 'radiobutton',
		event_name: 'upi',
		event_property: null,
		event_id: '310.0.0.1.11'
	});
};

export const selectGooglePayPaymentModeAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangePaymentmethod',
		event_type: 'click',
		event_sub_type: 'radiobutton',
		event_name: 'googlepay',
		event_property: null,
		event_id: '310.0.0.1.12'
	});
};

export const changeBankButtonClickAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangePaymentmethod',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'bs-ChangeBank',
		event_property: null,
		event_id: '310.0.0.1.13',
		event_metadata: eventMetaData
	});
};

export const changeBankConfirmButtonClickAnalytics = (
	eventMetaData: Record<string, string> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-ChangeBank',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Confirm',
		event_property: null,
		event_id: '310.0.0.1.14',
		event_metadata: eventMetaData
	});
};

export const paymentModeScreenPayButtonClickAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangePaymentmethod',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Pay',
		event_property: null,
		event_id: '310.0.0.1.15',
		event_metadata: eventMetaData
	});
};
