import HomeIcon from '$lib/images/icons/HomeIcon.svelte';
import HomeActiveIcon from '$lib/images/icons/HomeActiveIcon.svelte';
import HoldingActiveIcon from '$lib/images/icons/HoldingActiveIcon.svelte';
import HoldingIcon from '$lib/images/icons/HoldingIcon.svelte';
import OrdersBottomNavbarActiveIcon from '$lib/images/icons/OrdersBottomNavbarActiveIcon.svelte';
import OrdersBottomNavbarInactiveIcon from '$lib/images/icons/OrdersBottomNavbarInactiveIcon.svelte';
import { base } from '$app/paths';
import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';

export const BOTTOM_NAVBARS = (scheme = '', host = '') => [
	{
		label: 'Discover',
		path: `${getNavigationBaseUrl(base, scheme, host)}/discoverfunds`,
		icon: HomeIcon,
		activeIcon: HomeActiveIcon
	},
	{
		label: 'Investments',
		path: `${getNavigationBaseUrl(base, scheme, host)}/investments`,
		icon: HoldingIcon,
		activeIcon: HoldingActiveIcon
	},
	{
		label: 'Orders',
		path: `${getNavigationBaseUrl(base, scheme, host)}/orders/orderspage`,
		icon: OrdersBottomNavbarInactiveIcon,
		activeIcon: OrdersBottomNavbarActiveIcon
	}
];
