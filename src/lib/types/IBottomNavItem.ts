export interface IBottomNavItem {
	name?: string;
	label: string;
	path: string;
	icon: never;
	activeIcon: never;
	isInternalNavigation?: boolean;
	width: number;
	height: number;
	callMethod?: boolean;
	type?: string;
	method?: () => void;
}
