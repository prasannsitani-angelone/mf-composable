export interface IBottomNavItem {
	label: string;
	path: string;
	icon: string;
	activeIcon: string;
	isInternalNavigation?: boolean;
	width: number;
	height: number;
}
