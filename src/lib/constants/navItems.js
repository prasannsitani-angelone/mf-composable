import CartNavItem from '$lib/images/CartOutlined.svelte';
import CartNavItemActive from '$lib/images/CartFilled.svelte';
import DiscoverNav from '$lib/images/CompassBolderIcon.svelte';
import DiscoverNavFilled from '$lib/images/CompassActiveIcon.svelte';
import RupeeNav from '$lib/images/RupeeInCircleBolder.svelte';
import RupeeNavFilled from '$lib/images/RupeeCircleBlueFilled.svelte';
import PadNav from '$lib/images/PadBolder.svelte';
import PadNavFilled from '$lib/images/PadActive.svelte';
import SipsNav from '$lib/images/SipsNav.svelte';
import SipsNavFilled from '$lib/images/SipsNavFilled.svelte';
import { base } from '$app/paths';
import { goBackToSpark } from '$lib/utils';

export const BOTTOM_NAVBARS = (version) => [
	{
		label: 'Discover',
		path: version ? `${base}/${version?.toLowerCase()}/discoverfunds` : `${base}/discoverfunds`,
		icon: DiscoverNav,
		activeIcon: DiscoverNavFilled,
		isInternalNavigation: true,
		width: 24,
		height: 24,
		callMethod: true,
		method: goBackToSpark
	},
	{
		label: 'Cart',
		path: `${base}/cart`,
		icon: CartNavItem,
		activeIcon: CartNavItemActive,
		isInternalNavigation: true,
		width: 24,
		height: 24
	},
	{
		label: 'Portfolio',
		path: `${base}/investments`,
		icon: RupeeNav,
		activeIcon: RupeeNavFilled,
		isInternalNavigation: true,
		width: 24,
		height: 24
	},
	{
		label: 'SIPs',
		path: `${base}/sipbook/dashboard`,
		icon: SipsNav,
		activeIcon: SipsNavFilled,
		isInternalNavigation: true,
		width: 24,
		height: 24
	},
	{
		label: 'Orders',
		path: `${base}/orders/orderspage`,
		icon: PadNav,
		activeIcon: PadNavFilled,
		isInternalNavigation: true,
		width: 24,
		height: 24
	}
];
