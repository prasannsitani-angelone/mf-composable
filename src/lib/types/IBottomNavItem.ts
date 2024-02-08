export interface IBottomNavItem {
	label: string;
	path: string;
	icon: never;
	activeIcon: never;
	isInternalNavigation?: boolean;
	width: number;
	height: number;
}
