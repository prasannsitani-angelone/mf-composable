import Analytics from '$lib/utils/analytics';

export const inactiveSipsButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipbook',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'InactiveSIPs',
		event_property: null,
		event_id: '309.0.0.1.3'
	});
};

export const sipbookDashboardScreenOpenAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipbook',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-sipbook',
		event_property: null,
		event_id: '309.0.0.1.2',
		event_metadata: eventMetaData
	});
};

export const sipCardClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipbook',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'FundName',
		event_property: null,
		event_id: '309.0.0.1.6',
		event_metadata: eventMetaData
	});
};

export const sipPaymentDueNudgeImpressionAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipbook',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 'sippaymentdue',
		event_property: null,
		event_id: '309.0.0.1.26',
		event_metadata: eventMetaData
	});
};

export const ordersSipbookTabClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Orders',
		event_type: 'click',
		event_sub_type: 'Tab',
		event_name: 'tabs',
		event_property: null,
		event_id: '309.0.0.1.1',
		event_metadata: eventMetaData
	});
};

export const cancelSipButtonClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CancelSIP',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'CancelSIP',
		event_property: null,
		event_id: '309.0.0.1.9',
		event_metadata: eventMetaData
	});
};

export const sipCancelConfirmationModalOpenAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'bottomsheet',
		event_name: 'bs-CancelSIP',
		event_property: null,
		event_id: '309.0.0.1.10',
		event_metadata: eventMetaData
	});
};

export const sipCancelledSuccessModalOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-sipcancelled',
		event_property: null,
		event_id: '309.0.0.1.11'
	});
};

export const sipCancelledSuccessModalDoneButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Done',
		event_property: null,
		event_id: '309.0.0.1.12'
	});
};

export const sipCancelledFailureModalOpenAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-cancellationerror',
		event_property: null,
		event_id: '309.0.0.1.13',
		event_metadata: eventMetaData
	});
};

export const sipCancelFailureModalRetryButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Retry',
		event_property: null,
		event_id: '309.0.0.1.14'
	});
};

export const sipInProgressNudgeImpressionAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 's-sipinfo',
		event_property: null,
		event_id: '309.0.0.1.19',
		event_metadata: eventMetaData
	});
};

export const sipCreatedDateImpressionAnalytics = (eventMetaData?: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 's-sipdetailsangelbeescneario',
		event_property: null,
		event_id: '309.0.0.1.21',
		event_metadata: eventMetaData || null
	});
};

export const sipDetailsScreenOpenAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'sipdetails',
		event_property: null,
		event_id: '309.0.0.1.25',
		event_metadata: eventMetaData
	});
};

export const sipHistoryScreenOpenAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-siphistory',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-siphistory',
		event_property: null,
		event_id: '309.0.0.1.18',
		event_metadata: eventMetaData
	});
};

export const inactiveSipsScreenOpenAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InactiveSIPs',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-InactiveSIPs',
		event_property: null,
		event_id: '309.0.0.1.4',
		event_metadata: eventMetaData
	});
};

export const restartSipButtonClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-InactiveSIPs',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'restartsip',
		event_property: null,
		event_id: '309.0.0.1.22',
		event_metadata: eventMetaData
	});
};

export const skipSipButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'skipnextinstalment',
		event_property: null,
		event_id: '309.0.0.1.30'
	});
};

export const skipSipConfirmationModalOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'bs-nextinstallment',
		event_property: null,
		event_id: '309.0.0.1.31'
	});
};

export const skipSipModalButtonClickAnalytics = (eventMetaData: { value: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-nextinstallement',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'YesNO',
		event_property: null,
		event_id: '309.0.0.1.32',
		event_metadata: eventMetaData
	});
};

export const skipSipSkippedSuccessModalOpenAnalytics = (eventMetaData: { value: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-nextinstallement',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'sipskipped',
		event_property: null,
		event_id: '309.0.0.1.33',
		event_metadata: eventMetaData
	});
};

export const skipSipSuccessModalClickDone = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'bs-nextinstallement',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Done',
		event_property: null,
		event_id: '309.0.0.1.75'
	});
};

export const clickSetupAutopayCtaAnalytics = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SetupAutopay',
		event_property: null,
		event_id: '309.0.0.1.37',
		event_metadata: eventMetaData
	});
};

export const clickManageAutopayCtaAnalytics = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'ManageAutopay',
		event_property: null,
		event_id: '309.0.0.1.38',
		event_metadata: eventMetaData
	});
};

export const autopayDashboardImpressionAnalytics = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ManageAutopay',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'ManageAutopay',
		event_property: null,
		event_id: '309.0.0.1.51',
		event_metadata: eventMetaData
	});
};

export const autopayDashboardSetupAutopayCtaClickAnalytics = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-ManageAutopay',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SetupAutopay',
		event_property: null,
		event_id: '309.0.0.1.52',
		event_metadata: eventMetaData
	});
};

export const autopayDetailsImpressionAnalytics = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AutopayDetails',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'AutopayDetails',
		event_property: null,
		event_id: '309.0.0.1.53',
		event_metadata: eventMetaData
	});
};

export const autopayDetailsSipLinkedClickAnalytics = (eventMetaData: unknown) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-AutopayDetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SIPSlinked',
		event_property: null,
		event_id: '309.0.0.1.54',
		event_metadata: eventMetaData
	});
};

export const setupAutopayOnNudgeClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SetupAutopay',
		event_property: null,
		event_id: '309.0.0.1.56',
		event_metadata: eventMetaData
	});
};

export const linkAutopayOnNudgeClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'linkAutopay',
		event_property: null,
		event_id: '309.0.0.1.57',
		event_metadata: eventMetaData
	});
};

export const autopayNudgeImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-linkAutopay',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'autopayNudge',
		event_property: null,
		event_id: '309.0.0.1.58',
		event_metadata: eventMetaData
	});
};

export const switchAutopayClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'switchAutopay',
		event_property: null,
		event_id: '309.0.0.1.59',
		event_metadata: eventMetaData
	});
};

export const switchAutopaySuccessImpressionAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-switchAutopay',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'switchAutopaysuccess',
		event_property: null,
		event_id: '309.0.0.1.60',
		event_metadata: eventMetaData
	});
};

export const sipDetailsCancelSipOptionClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'CancelSIP',
		event_property: null,
		event_id: '309.0.0.1.71'
	});
};

export const cancelSipScreenImpressionAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'CancelSIP',
		event_property: null,
		event_id: '309.0.0.1.72'
	});
};

export const sipCancelReasonRadioClickAnalytics = (eventMetaData: Record<string, string>) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CancelSIP',
		event_type: 'click',
		event_sub_type: 'radiobutton',
		event_name: 'cancelationreason',
		event_property: null,
		event_id: '309.0.0.1.73',
		event_metadata: eventMetaData
	});
};

export const sipCancelStayInvestedButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-CancelSIP',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Stay invested',
		event_property: null,
		event_id: '309.0.0.1.74'
	});
};

export const clickOnEditSipAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'editsip',
		event_property: null,
		event_id: '309.0.0.1.76'
	});
};

export const editSipScreenImpressionAnalytics = (eventMetaData: {
	fundName: string;
	sipDate: string;
	amount: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'editsiporderpad',
		event_property: null,
		event_id: '309.0.0.1.77',
		event_metadata: eventMetaData
	});
};

export const editSipUpdateClickAnalytics = (eventMetaData: {
	fundName: string;
	updatedSipDate: string;
	updatedAmount: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-editsip',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'update',
		event_property: null,
		event_id: '309.0.0.1.78',
		event_metadata: eventMetaData
	});
};

export const editSipConfirmImpressionAnalytics = (eventMetaData: {
	fundName: string;
	amount: number;
	updatedAmount: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-editsip',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'ConfirmSIPchanges',
		event_property: null,
		event_id: '309.0.0.1.79',
		event_metadata: eventMetaData
	});
};

export const editSipConfirmClickAnalytics = (eventMetaData: {
	fundName: string;
	amount: number;
	updatedAmount: number;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-editsip',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'confirm',
		event_property: null,
		event_id: '309.0.0.1.80',
		event_metadata: eventMetaData
	});
};

export const editSipConfirmScreenAnalytics = (eventMetaData: {
	fundName: string;
	amount: number;
	updatedAmount: number;
	updatedSipDate: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-editsip',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'SIP updated',
		event_property: null,
		event_id: '309.0.0.1.81',
		event_metadata: eventMetaData
	});
};

export const editSipDoneAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-editsip',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'done',
		event_property: null,
		event_id: '309.0.0.1.82'
	});
};
