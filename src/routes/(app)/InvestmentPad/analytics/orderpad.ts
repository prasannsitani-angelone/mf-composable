import Analytics from '$lib/utils/analytics';

export const investmentPadScreenOpenAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-orderpad',
		event_property: null,
		event_id: '310.0.0.1.0',
		event_metadata: eventMetaData
	});
};

export const investmentPadTabSwitchAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'tab',
		event_sub_type: 'button',
		event_name: 's-investments',
		event_property: null,
		event_id: '310.0.0.1.1',
		event_metadata: eventMetaData
	});
};

export const calendarIconClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'calendaricon',
		event_property: null,
		event_id: '310.0.0.1.2'
	});
};

export const dateSelectConfirmButtonClickAnalytics = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-calendar',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Confirm',
		event_property: null,
		event_id: '310.0.0.1.3',
		event_metadata: eventMetaData
	});
};

export const firstTimePaymentCheckboxClickAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'checkbox',
		event_name: 'Makefirstsippaymentnow',
		event_property: null,
		event_id: '310.0.0.1.4',
		event_metadata: eventMetaData
	});
};

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

export const tncButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Termsnconditions',
		event_property: null,
		event_id: '310.0.0.1.7'
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
