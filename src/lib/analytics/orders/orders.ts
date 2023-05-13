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

export const ordersDropdownClickAnalytics = (eventMetaData) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Orders',
		event_type: 'click',
		event_sub_type: 'dropdown',
		event_name: 'dropdown',
		event_property: null,
		event_id: '305.0.0.1.1',
		event_metadata: eventMetaData
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

export const orderDetailsPageScreenOpenAnalytics = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Orderdetails',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 's-Orderdetails',
		event_property: null,
		event_id: '305.0.0.2.0',
		event_metadata: eventMetaData
	});
};

export const placeNewOrderCtaClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Orderdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'PlaceNewOrder',
		event_property: null,
		event_id: '305.0.0.2.1'
	});
};

export const retryCtaClickAnalytics = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Orderdetails',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Retry',
		event_property: null,
		event_id: '305.0.0.2.2',
		event_metadata: eventMetaData
	});
};

export const expectedNavDateInfoTagClickAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Orderdetails',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'infoNAVDate',
		event_property: null,
		event_id: '305.0.0.2.3'
	});
};

export const expectedNavDateModalOpenAnalytics = (eventMetaData: any) => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-ExpectedNAVDate',
		event_type: 'impression',
		event_sub_type: 'popup',
		event_name: 'p-ExpectedNAVDate',
		event_property: null,
		event_id: '305.0.0.3.0',
		event_metadata: eventMetaData
	});
};

export const expectedNavDateModalCloseAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 'p-ExpectedNAVDate',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'Close',
		event_property: null,
		event_id: '305.0.0.3.1'
	});
};
