import Analytics from '$lib/utils/analytics';

export const screenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPMandate',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-SIPMandate',
		event_property: null,
		event_id: '302.0.0.1.0'
	});
};

export const accounChangeAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPMandate',
		event_type: 'click',
		event_sub_type: 'text',
		event_name: 'ChangeBank',
		event_property: null,
		event_id: '302.0.0.1.2',
		event_metadata: eventMetaData
	});
};

export const emandateProceedButtonAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPMandate',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Proceed',
		event_property: null,
		event_id: '302.0.0.1.1',
		event_metadata: eventMetaData
	});
};

export const netBankingPopupAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-SIPMandateSetupNetBanking',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-SIPMandateSetupNetBanking',
		event_property: null,
		event_id: '302.0.0.1.3'
	});
};

export const emandateCreatedSuccessfullyAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-eMandateCreatedSuccessfully',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-eMandateCreatedSuccessfully',
		event_property: null,
		event_id: '302.0.0.1.4'
	});
};

export const emandateCreatedSuccessDoneButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-eMandateCreatedSuccessfully',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Done',
		event_property: null,
		event_id: '302.0.0.1.5',
		event_metadata: {
			Message:
				'Future SIP instalments will be paid automatically every month. Please note it takes up to 7 days to activate your eMandate'
		}
	});
};

export const emandateCreateFailedAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-Failedtosetupmandate',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-Failedtosetupmandate',
		event_property: null,
		event_id: '302.0.0.1.6',
		event_metadata: {
			Message: 'Failed to set up an e-mandate autopay request. Please try again'
		}
	});
};

export const emandateCreateFailedDoneButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-Failedtosetupmandate',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Done',
		event_property: null,
		event_id: '302.0.0.1.7',
		event_metadata: {
			Message: 'We were unable to process your request due a technical issue. Please try again'
		}
	});
};

export const goTODashBoardButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-eMandateCreatedSuccessfully',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'GoToOrders',
		event_property: null,
		event_id: '302.0.0.1.22'
	});
};
