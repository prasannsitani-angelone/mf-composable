import DiscoverIcon from '$lib/images/icons/DiscoverIcon.svelte';
import DiscoverActiveIcon from '$lib/images/icons/DiscoverActiveIcon.svelte';
import RupeeInCircleActiveIcon from '$lib/images/icons/RupeeInCircleActiveIcon.svelte';
import RupeeInCircleIcon from '$lib/images/icons/RupeeInCircleIcon.svelte';
import OrdersBottomNavbarActiveIcon from '$lib/images/icons/OrdersBottomNavbarActiveIcon.svelte';
import OrdersBottomNavbarInactiveIcon from '$lib/images/icons/OrdersBottomNavbarInactiveIcon.svelte';
import BookmarkNav from '$lib/components/BookmarkNavItems/BookmarkNav.svelte';
import BookmarkNavFilled from '$lib/components/BookmarkNavItems/BookmarkNavFilled.svelte';
import { base } from '$app/paths';
import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';

export const BOTTOM_NAVBARS = (scheme = '', host = '') => [
	{
		label: 'Discover',
		path: `${getNavigationBaseUrl(base, scheme, host)}/discoverfunds`,
		icon: DiscoverIcon,
		activeIcon: DiscoverActiveIcon
	},
	{
		label: 'Favourites',
		path: `${base}/favourites`,
		icon: BookmarkNav,
		activeIcon: BookmarkNavFilled,
		isInternalNavigation: true
	},
	{
		label: 'Investments',
		path: `${base}/investments`,
		icon: RupeeInCircleIcon,
		activeIcon: RupeeInCircleActiveIcon,
		isInternalNavigation: true
	},
	{
		label: 'Orders',
		path: `${base}/orders/orderspage`,
		icon: OrdersBottomNavbarInactiveIcon,
		activeIcon: OrdersBottomNavbarActiveIcon,
		isInternalNavigation: true
	}
];
