import BookmarkNav from '$lib/components/BookmarkNavItems/BookmarkNav.svelte';
import BookmarkNavFilled from '$lib/components/BookmarkNavItems/BookmarkNavFilled.svelte';
import DiscoverNav from '$components/NavItems/DiscoverNav.svelte';
import DiscoverNavFilled from '$components/NavItems/DiscoverNavFilled.svelte';
import RupeeNav from '$components/NavItems/RupeeNav.svelte';
import RupeeNavFilled from '$components/NavItems/RupeeNavFilled.svelte';
import PadNav from '$components/NavItems/PadNav.svelte';
import PadNavFilled from '$components/NavItems/PadNavFilled.svelte';
import { base } from '$app/paths';

export const BOTTOM_NAVBARS = () => [
	{
		label: 'Discover',
		path: `${base}/discoverfunds`,
		icon: DiscoverNav,
		activeIcon: DiscoverNavFilled,
		isInternalNavigation: true
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
