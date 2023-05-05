import {
	expectedNavDateInfoTagClickAnalytics,
	expectedNavDateModalCloseAnalytics,
	expectedNavDateModalOpenAnalytics
} from '$lib/analytics/orders/orders';
import { NAV_DETAILS, NAV_DETAILS_WITHDRAWAL } from '$lib/constants/order';
import type { IOrderDetails } from '$lib/types/IOrderDetails';

export const expectedNavDateOpenAnalytics = (orderDetails: IOrderDetails) => {
	expectedNavDateInfoTagClickAnalytics();
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
