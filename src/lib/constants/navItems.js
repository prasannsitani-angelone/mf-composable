import HomeIcon from '$lib/images/icons/HomeIcon.svelte';
import HomeActiveIcon from '$lib/images/icons/HomeActiveIcon.svelte';
import HoldingActiveIcon from '$lib/images/icons/HoldingActiveIcon.svelte';
import HoldingIcon from '$lib/images/icons/HoldingIcon.svelte';
import OrdersBottomNavbarActiveIcon from '$lib/images/icons/OrdersBottomNavbarActiveIcon.svelte';
import OrdersBottomNavbarInactiveIcon from '$lib/images/icons/OrdersBottomNavbarInactiveIcon.svelte';
import { base } from '$app/paths';

export const BOTTOM_NAVBARS = [
	{
		label: 'Discover',
		path: `${base}/discoverfunds`,
		icon: HomeIcon,
		activeIcon: HomeActiveIcon
	},
	{
		label: 'Investments',
		path: `${base}/investments`,
		icon: HoldingIcon,
		activeIcon: HoldingActiveIcon
	},
	{
		label: 'Orders',
		path: '/orders/orderspage',
		icon: OrdersBottomNavbarInactiveIcon,
		activeIcon: OrdersBottomNavbarActiveIcon
	}
];
