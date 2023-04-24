import type { ITab } from '$lib/types/ITab';
import { goto } from '$app/navigation';
import { base } from '$app/paths';

const handleOrderTabSelection = () => {
	goto(`${base}/orders/orderspage`, { replaceState: true });
};

const handleSipTabSelection = () => {
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
