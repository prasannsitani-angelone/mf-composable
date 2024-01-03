import Analytics from '$lib/utils/analytics';

export const orderScreenOpenAnalytics = (
	eventMetaData: Record<string, string | number | boolean | null | undefined> | null | undefined
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderSummary',
		event_type: 'impression',
		event_sub_type: 'card',
		event_name: 's-investordersummary',
		event_property: null,
		event_id: '310.0.0.1.21',
		event_metadata: eventMetaData
	});
};

export const goToDashboardButtonAnalytics = (
	eventMetaData: Record<string, string | number | boolean | null | undefined> | null | undefined
) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderSummary',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'GOTOOrders',
		event_property: null,
		event_id: '310.0.0.1.23',
		event_metadata: eventMetaData
	});
};

export const sipGoTOSetupAutopayButtonAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orderSummary',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'SetUp AutoPay',
		event_property: null,
		event_id: '310.0.0.1.22'
	});
};
