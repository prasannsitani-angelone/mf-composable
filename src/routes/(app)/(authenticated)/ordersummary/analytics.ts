import Analytics from '$lib/utils/analytics';

export const lumpsumScreenOpenAnalytics = (eventMetaData: Record<string, string> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-OTISuccessful',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-OTIordersummary',
		event_property: null,
		event_id: '310.0.0.1.27',
		event_metadata: eventMetaData
	});
};

export const lumpsumGoTODashBoardButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-OTISuccessful',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'GoToDashboard',
		event_property: null,
		event_id: '310.0.0.1.28'
	});
};

export const sipScreenOpenAnalytics = (eventMetaData: Record<string, any> | null) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPPaymentSuccessful',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-SIPordersummary',
		event_property: null,
		event_id: '310.0.0.1.21',
		event_metadata: eventMetaData
	});
};

export const sipGoTODashBoardButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPPaymentSuccessful',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'GOTOOrders',
		event_property: null,
		event_id: '310.0.0.1.23'
	});
};

export const sipGoTOSetupAutopayButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-SIPPaymentSuccessful',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'setautopay',
		event_property: null,
		event_id: '310.0.0.1.22'
	});
};
