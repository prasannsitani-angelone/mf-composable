import type { SvelteComponent } from 'svelte';

export interface IBottomNavItem {
	label: string;
	path: string;
	icon: typeof SvelteComponent;
	activeIcon: typeof SvelteComponent;
}
