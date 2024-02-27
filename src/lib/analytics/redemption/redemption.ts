import Analytics from '$lib/utils/analytics';

export const withdrawOrderSummaryScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-WithdrawOrderPlaced',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-WithdrawOrderPlaced',
		event_property: null,
		event_id: '307.0.0.1.0',
		event_metadata: eventMetaData
	});
};

export const withdrawOrderSummaryFooterCtaClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-WithdrawOrderPlaced',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'GotoDashboard',
		event_property: null,
		event_id: '307.0.0.1.1',
		event_metadata: eventMetaData
	});
};

export const withdrawFlowStartClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Withdraw',
		event_property: null,
		event_id: '307.0.0.1.2',
		event_metadata: eventMetaData
	});
};

export const withdrawProceedButtonClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'WithdrawProceed',
		event_property: null,
		event_id: '307.0.0.1.3',
		event_metadata: eventMetaData
	});
};

export const confirmWithdrawButtonAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ConfirmAndWithdraw',
		event_property: null,
		event_id: '307.0.0.1.4',
		event_metadata: eventMetaData
	});
};

export const changeBankAccountAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ChangeBankAccount',
		event_property: null,
		event_id: '307.0.0.1.5',
		event_metadata: eventMetaData
	});
};

export const changeFolioAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'click',
		event_sub_type: 'dropdown',
		event_name: 'ChangeFolio',
		event_property: null,
		event_id: '307.0.0.1.6',
		event_metadata: eventMetaData
	});
};

export const confirmChangeFolioAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ConfirmChangeFolio',
		event_property: null,
		event_id: '307.0.0.1.6',
		event_metadata: eventMetaData
	});
};

export const withdrawFullAmountCheckboxAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'WithdrawFullAmountTickBox',
		event_property: null,
		event_id: '307.0.0.1.7',
		event_metadata: eventMetaData
	});
};

export const withdrawInfoAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'infoiconforWithdrawableAmount',
		event_property: null,
		event_id: '307.0.0.1.8'
	});
};

export const verifyWithEdisModalOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-WithdrawVerifyOrderwithE-DIS',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-WithdrawVerifyOrderwithE-DIS',
		event_property: null,
		event_id: '307.0.0.1.9'
	});
};

export const regenerateTpinButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-WithdrawVerifyOrderwithE-DIS',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'RegenerateTPIN',
		event_property: null,
		event_id: '307.0.0.1.10'
	});
};

export const tpinProceedAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-WithdrawVerifyOrderwithE-DIS',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'WithdrawVerifyOrderProceed',
		event_property: null,
		event_id: '307.0.0.1.11'
	});
};

export const edisAboutModalOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-AboutE-DIS',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-AboutE-DIS',
		event_property: null,
		event_id: '307.0.0.1.12'
	});
};

export const edisAboutModalCloseAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-AboutE-DIS',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'close',
		event_property: null,
		event_id: '307.0.0.1.13'
	});
};

export const verifyWithOtpModalOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-VerifyOrderwithOTP',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-VerifyOrderwithOTP',
		event_property: null,
		event_id: '307.0.0.1.19',
		event_metadata: eventMetaData
	});
};

export const verifyWithOtpProceedButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-VerifyOrderwithOTP',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'p-VerifyOrderwithOTPProceed',
		event_property: null,
		event_id: '307.0.0.1.20'
	});
};

export const authFailedModalOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-AuthorizationFailed',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-AuthorizationFailed',
		event_property: null,
		event_id: '307.0.0.1.21',
		event_metadata: eventMetaData
	});
};

export const authFailedRetryClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-AuthorizationFailed',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'AuthorizationFailedRetry',
		event_property: null,
		event_id: '307.0.0.1.22'
	});
};

export const serverErrorModalOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-ServerError',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-ServerError',
		event_property: null,
		event_id: '307.0.0.1.23',
		event_metadata: eventMetaData
	});
};

export const serverErrorRetryCloseClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-ServerError',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'close',
		event_property: null,
		event_id: '307.0.0.1.24'
	});
};

export const tpinVerifiedModalOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TPINVerified',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-TPINVerified',
		event_property: null,
		event_id: '307.0.0.1.25',
		event_metadata: eventMetaData
	});
};

export const tpinVerifiedModalGoBackClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TPINVerified',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'GoBack',
		event_property: null,
		event_id: '307.0.0.1.26'
	});
};

export const tpinVerifiedModalProceedClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-TPINVerified',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Proceed',
		event_property: null,
		event_id: '307.0.0.1.27'
	});
};

export const withdrawableAmountModalOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-WithdrawableAmount',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-WithdrawableAmount',
		event_property: null,
		event_id: '307.0.0.1.31',
		event_metadata: eventMetaData
	});
};

export const withdrawableAmountModalCloseButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-WithdrawableAmount',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'Close',
		event_property: null,
		event_id: '307.0.0.1.32'
	});
};

export const proceedButtonClickAfterRegenerateTpinAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-WithdrawVerifyOrderwithE-DIS',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ProceedAfterRegenerate',
		event_property: null,
		event_id: '307.0.0.1.33'
	});
};

export const redemptionResendOtpClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-VerifyOrderwithOTP',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'resendOTP',
		event_property: null,
		event_id: '307.0.0.1.34'
	});
};

export const withdrawableAmountLessThanMinimumLimitAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Investments-Withdraw',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'withdrawalamountlessthanminwithdrawalamount',
		event_property: null,
		event_id: '307.0.0.1.35',
		event_metadata: eventMetaData
	});
};

export const stayInvestedImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-potentialreturns',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'potentialreturns',
		event_property: null,
		event_id: '307.0.0.1.36'
	});
};

export const stayInvestedPrimaryCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-potentialreturns',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'StayInvested',
		event_property: null,
		event_id: '307.0.0.1.37'
	});
};

export const stayInvestedSecondaryCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-potentialreturns',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Withdraw',
		event_property: null,
		event_id: '307.0.0.1.38'
	});
};

export const withdrawalTaxesModalImpressionAnalytics = (
	eventMetaData: Record<string, string | number | undefined>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-TaxesonWithdrawal',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'bs-TaxesonWithdrawal',
		event_property: null,
		event_id: '307.0.0.1.39',
		event_metadata: eventMetaData
	});
};

export const withdrawalTaxesModalCtaClickAnalytics = (
	eventMetaData: Record<string, string | number | undefined>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-TaxesonWithdrawal',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Continue',
		event_property: null,
		event_id: '307.0.0.1.40',
		event_metadata: eventMetaData
	});
};

export const redemptionOrderpadTaxInfoIconClickAnalytics = (
	eventMetaData: Record<string, string | number | undefined>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-WithdrawOrderPad',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'iicon',
		event_property: null,
		event_id: '307.0.0.1.41',
		event_metadata: eventMetaData
	});
};

export const redemptionOrderpadTaxDetailsModalImpressionAnalytics = (
	eventMetaData: Record<string, string | number | undefined>
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-WithdrawOrderPad',
		event_type: 'Impression',
		event_sub_type: 'pop-up',
		event_name: 'iicon',
		event_property: null,
		event_id: '307.0.0.1.42',
		event_metadata: eventMetaData
	});
};
