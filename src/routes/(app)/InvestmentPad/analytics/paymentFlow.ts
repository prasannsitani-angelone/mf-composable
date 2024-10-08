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

export const paymentFailedRetrySameMethodCtaClickAnalytics = (
	eventMetaData: Record<string, string> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymenfailed',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Retry_same_method',
		event_property: null,
		event_id: '310.0.0.1.20',
		event_metadata: eventMetaData
	});
};

export const paymentFailedUseDifferentMethodCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-paymentfailed',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'UseOtherPaymentMethod',
		event_property: null,
		event_id: '310.0.0.1.40'
	});
};

export const wrongBankPaymentFailedCautionModalImpressionAnalytics = (
	eventMetaData: Record<string, string> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-lastpaymentcomms',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'bank_confirmation',
		event_property: null,
		event_id: '310.0.0.1.41',
		event_metadata: eventMetaData
	});
};

export const wrongBankPaymentFailedCautionModalCtaClickAnalytics = (
	eventMetaData: Record<string, string> | null
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-lastpaymentcomms',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'pay_after_bank_confirmation',
		event_property: null,
		event_id: '310.0.0.1.42',
		event_metadata: eventMetaData
	});
};

// integerated flow
export const onIntegeratedFlowPopupImpressionAnalytics = (
	eventMetaData: Record<string, string>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-IntegratedFlow',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'upiautopayintegrated',
		event_property: null,
		event_id: '310.0.0.1.43',
		event_metadata: eventMetaData
	});
};

export const onIntegeratedFlowPopupClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-IntegratedFlow',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'upiautopayintegratedcta',
		event_property: null,
		event_id: '310.0.0.1.44',
		event_metadata: eventMetaData
	});
};

export const onIntegeratedFlowFailureImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-IntegratedFlow',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'bs-integratedfailed',
		event_property: null,
		event_id: '310.0.0.1.45'
	});
};

export const onIntegeratedFlowFailureClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-IntegratedFlow',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'bs-integratedfailedPay',
		event_property: null,
		event_id: '310.0.0.1.46'
	});
};
