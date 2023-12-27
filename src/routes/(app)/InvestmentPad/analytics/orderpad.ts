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
		event_name: 's-investtype',
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

export const startSipButtonClickAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'orderpadCTA',
		event_property: null,
		event_id: '310.0.0.1.5',
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

export const changePaymentMethodButtonClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'gotopaymentmethod',
		event_property: null,
		event_id: '310.0.0.1.8',
		event_metadata: eventMetaData
	});
};

export const changePaymentMethodScreenImpressionAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ChangePaymentmethod',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'paymentselection',
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

export const orderpadFundCardClickAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'fundcard-orderpad',
		event_property: null,
		event_id: '310.0.0.1.38',
		event_metadata: eventMetaData
	});
};

export const sipWithAutopayConfirmImpressionAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'impression',
		event_sub_type: 'pop-up',
		event_name: 'PayingwithAutopay',
		event_property: null,
		event_id: '310.0.0.2.13',
		event_metadata: eventMetaData
	});
};

export const sipWithAutopayConfirmClickAnalytics = (
	eventMetaData: Record<string, string | boolean> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderpad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Confirm',
		event_property: null,
		event_id: '310.0.0.2.14',
		event_metadata: eventMetaData
	});
};
