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
