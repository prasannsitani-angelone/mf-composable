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

export const sipbookDashboardScreenOpenAnalytics = (eventMetaData: any) => {
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

export const sipCardClickAnalytics = (eventMetaData: any) => {
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

export const sipPaymentDueNudgeImpressionAnalytics = (eventMetaData: any) => {
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

export const ordersSipbookTabClickAnalytics = (eventMetaData: any) => {
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

export const cancelSipButtonClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-sipdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'CancelSIP',
		event_property: null,
		event_id: '309.0.0.1.9'
	});
};

export const sipCancelConfirmationModalOpenAnalytics = (eventMetaData: any) => {
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

export const sipCancelledFailureModalOpenAnalytics = (eventMetaData: any) => {
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

export const sipInProgressNudgeImpressionAnalytics = (eventMetaData: any) => {
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

export const sipCreatedDateImpressionAnalytics = (eventMetaData?: any) => {
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

export const sipDetailsScreenOpenAnalytics = (eventMetaData: any) => {
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

export const sipHistoryScreenOpenAnalytics = (eventMetaData: any) => {
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

export const inactiveSipsScreenOpenAnalytics = (eventMetaData: any) => {
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

export const restartSipButtonClickAnalytics = (eventMetaData: any) => {
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
		screen_name: 's-sipdetails',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'sipskipped',
		event_property: null,
		event_id: '309.0.0.1.33',
		event_metadata: eventMetaData
	});
};
