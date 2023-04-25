import Analytics from '$lib/utils/analytics';

export const failedOrdersRetryCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-RetryPayment',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Retry Payment',
		event_property: null,
		event_id: '305.0.0.4.3'
	});
};

export const ordersDashboardScreenOpenAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Orders',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-Orders',
		event_property: null,
		event_id: '305.0.0.1.0'
	});
};

export const orderCardClickAnalytics = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Orders',
		event_type: 'click',
		event_sub_type: 'card',
		event_name: 'OrderedFundsSelect',
		event_property: null,
		event_id: '305.0.0.1.4',
		event_metadata: eventMetaData
	});
};
