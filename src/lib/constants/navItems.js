import CartNavItem from '$lib/images/CartOutlined.svg';
import CartNavItemActive from '$lib/images/CartFilled.svg';
import DiscoverNav from '$lib/images/CompassBolderIcon.svg';
import DiscoverNavFilled from '$lib/images/CompassActiveIcon.svg';
import RupeeNav from '$lib/images/RupeeInCircleBolder.svg';
import RupeeNavFilled from '$lib/images/RupeeCircleBlueFilled.svg';
import PadNav from '$lib/images/PadBolder.svg';
import PadNavFilled from '$lib/images/PadActive.svg';
import { base } from '$app/paths';

export const BOTTOM_NAVBARS = (version) => [
	{
		label: 'Discover',
		path: version ? `${base}/discoverfunds_${version?.toLowerCase()}` : `${base}/discoverfunds`,
		icon: DiscoverNav,
		activeIcon: DiscoverNavFilled,
		isInternalNavigation: true,
		width: 25,
		height: 24
	},
	{
		label: 'Cart',
		path: `${base}/cart`,
		icon: CartNavItem,
		activeIcon: CartNavItemActive,
		isInternalNavigation: true,
		width: 25,
		height: 25
	},
	{
		label: 'Investments',
		path: `${base}/investments`,
		icon: RupeeNav,
		activeIcon: RupeeNavFilled,
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
		width: 15,
		height: 20
	}
];
