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

export const clickInProgressCheckboxAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orders',
		event_type: 'click',
		event_sub_type: 'checkbox',
		event_name: 'In Progress',
		event_property: null,
		event_id: '305.0.0.4.7'
	});
};

export const clickCompletedCheckboxAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orders',
		event_type: 'click',
		event_sub_type: 'checkbox',
		event_name: 'completed',
		event_property: null,
		event_id: '305.0.0.4.8'
	});
};

export const clickFailedCheckboxAnalytics = () => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orders',
		event_type: 'click',
		event_sub_type: 'checkbox',
		event_name: 'failed',
		event_property: null,
		event_id: '305.0.0.4.9'
	});
};

export const orderDetailsPageCompletedOrdersScreenOpenAnalytics = (eventMetaData: {
	FundName: string;
	Status: string;
	OrderType: string;
	Amount: number;
	EXNAVDATE: string;
	Message: string | undefined;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-completedorders',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'completedorders',
		event_property: null,
		event_id: '305.0.0.4.17',
		event_metadata: eventMetaData
	});
};

export const orderDetailsPageInProgressOrdersScreenOpenAnalytics = (eventMetaData: {
	FundName: string;
	Status: string;
	OrderType: string;
	Amount: number;
	EXNAVDATE: string;
	Message: string | undefined;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-Inprogressorders',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'Inprogressorders',
		event_property: null,
		event_id: '305.0.0.4.15',
		event_metadata: eventMetaData
	});
};

export const orderDetailsPageFailedOrdersScreenOpenAnalytics = (eventMetaData: {
	FundName: string;
	Status: string;
	OrderType: string;
	Amount: number;
	EXNAVDATE: string;
	Message: string | undefined;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-failedorders',
		event_type: 'impression',
		event_sub_type: 'screen',
		event_name: 'failedorders',
		event_property: null,
		event_id: '305.0.0.4.12',
		event_metadata: eventMetaData
	});
};

export const retryPaymentClick = (eventMetaData: { Status: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-failedorders',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Retry payment',
		event_property: null,
		event_id: '305.0.0.4.13',
		event_metadata: eventMetaData
	});
};

export const retryWithdrawClick = (eventMetaData: { Status: string }) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-failedorders',
		event_type: 'click',
		event_sub_type: 'button',
		event_name: 'Retry withdrawal',
		event_property: null,
		event_id: '305.0.0.4.14',
		event_metadata: eventMetaData
	});
};

export const infoTagClickAnalytics = (eventMetaData: {
	Status: string;
	'Ex. NAV Date': string;
	Message: string;
}) => {
	Analytics.logAnalyticEvent({
		screen_name: 's-orders',
		event_type: 'click',
		event_sub_type: 'icon',
		event_name: 'EXnavdate',
		event_property: null,
		event_id: '305.0.0.4.18',
		event_metadata: eventMetaData
	});
};
