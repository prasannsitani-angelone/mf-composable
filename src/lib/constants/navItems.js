import CartNavItem from '$lib/images/icons/CartNavItem.svelte';
import CartNavItemActive from '$lib/images/icons/CartNavItemActive.svelte';
import DiscoverNav from '$components/NavItems/DiscoverNav.svelte';
import DiscoverNavFilled from '$components/NavItems/DiscoverNavFilled.svelte';
import RupeeNav from '$components/NavItems/RupeeNav.svelte';
import RupeeNavFilled from '$components/NavItems/RupeeNavFilled.svelte';
import PadNav from '$components/NavItems/PadNav.svelte';
import PadNavFilled from '$components/NavItems/PadNavFilled.svelte';
import { base } from '$app/paths';

export const BOTTOM_NAVBARS = (version) => [
	{
		label: 'Discover',
		path: version ? `${base}/discoverfunds_${version?.toLowerCase()}` : `${base}/discoverfunds`,
		icon: DiscoverNav,
		activeIcon: DiscoverNavFilled,
		isInternalNavigation: true
	},
	{
		label: 'Cart',
		path: `${base}/cart`,
		icon: CartNavItem,
		activeIcon: CartNavItemActive,
		isInternalNavigation: true
	},
	{
		label: 'Investments',
		path: `${base}/investments`,
		icon: RupeeNav,
		activeIcon: RupeeNavFilled,
		isInternalNavigation: true
	},
	{
		label: 'Orders',
		path: `${base}/orders/orderspage`,
		icon: PadNav,
		activeIcon: PadNavFilled,
		isInternalNavigation: true
	}
];
