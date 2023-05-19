import {
	expectedNavDateModalCloseAnalytics,
	expectedNavDateModalOpenAnalytics,
	infoTagClickAnalytics
} from '$lib/analytics/orders/orders';
import { NAV_DETAILS, NAV_DETAILS_WITHDRAWAL } from '$lib/constants/order';
import { ORDER_STATUS_MAP } from '$lib/constants/orderFlowStatuses';
import type { IOrderDetails } from '$lib/types/IOrderDetails';
import { getExpectedNavDate } from '$lib/utils/helpers/order';

export const expectedNavDateOpenAnalytics = (orderDetails: IOrderDetails) => {
	const infoEventMetaData = {
		Status: ORDER_STATUS_MAP[orderDetails.status?.toUpperCase()] || 'In progress',
		'Ex. NAV Date': getExpectedNavDate(orderDetails),
		Message: NAV_DETAILS
	};
	infoTagClickAnalytics(infoEventMetaData);
	const eventMetaData = {
		Message:
			orderDetails?.transactionType === 'PURCHASE'
				? NAV_DETAILS
				: orderDetails?.transactionType === 'REDEEM'
				? NAV_DETAILS_WITHDRAWAL
				: ''
	};
	expectedNavDateModalOpenAnalytics(eventMetaData);
};

export const expectedNavDateCloseAnalytics = () => {
	expectedNavDateModalCloseAnalytics();
};
