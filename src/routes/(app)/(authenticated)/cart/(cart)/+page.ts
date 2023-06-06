import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		layoutConfig: {
			title: 'Cart',
			showBackIcon: true,
			layoutType: 'DEFAULT',
			showBottomNavigation: true
		}
	};
}) satisfies PageLoad;
