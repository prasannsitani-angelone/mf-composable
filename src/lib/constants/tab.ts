import type { ITab } from '$lib/types/ITab';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { ordersSipbookTabClickAnalytics } from '$lib/analytics/sipbook/sipbook';

const handleOrderTabSelection = () => {
	const eventMetaData = {
		Tab: 'Orders'
	};
	ordersSipbookTabClickAnalytics(eventMetaData);
	goto(`${base}/orders/orderspage`, { replaceState: true });
};

const handleSipTabSelection = () => {
	const eventMetaData = {
		Tab: 'SIPs'
	};
	ordersSipbookTabClickAnalytics(eventMetaData);
	goto(`${base}/orders/orderspage/sipbook`, { replaceState: true });
};

export const ordersTab: ITab[] = [
	{
		name: 'Orders',
		onClick: handleOrderTabSelection
	},
	{
		name: 'SIPs',
		onClick: handleSipTabSelection
	}
];
