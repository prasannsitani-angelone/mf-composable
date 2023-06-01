import Analytics from '$lib/utils/analytics';

export const startSipButtonClickAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Start SIP',
		event_property: null,
		event_id: '310.0.0.1.5',
		event_metadata: eventMetaData
	});
};

export const payNowLumpsumButtonClickAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'PayNow',
		event_property: null,
		event_id: '310.0.0.1.6',
		event_metadata: eventMetaData
	});
};

export const changePaymentMethodButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 's-ChangePaymentmethod',
		event_property: null,
		event_id: '310.0.0.1.8'
	});
};

export const changePaymentMethodScreenImpressionAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangePaymentmethod',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-ChangePaymentmethod',
		event_property: null,
		event_id: '310.0.0.1.9',
		event_metadata: eventMetaData
	});
};

export const lumspsumToSipSleeveAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipratherthanoti',
		event_type: 'impression',
		event_sub_type: 'sleeve',
		event_name: 'SIPRatherThanOTI',
		event_property: null,
		event_id: '310.0.0.1.34'
	});
};

export const lumspsumToSipSleeveCreateSipCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipratherthanoti',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'CreateSIP',
		event_property: null,
		event_id: '310.0.0.1.35'
	});
};

export const lumspsumToSipSleeveContinueOtiCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipratherthanoti',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ContinueWithOTI',
		event_property: null,
		event_id: '310.0.0.1.36'
	});
};
