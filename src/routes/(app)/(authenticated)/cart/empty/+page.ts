import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		layoutConfig: {
			title: 'Cart',
			layoutType: 'DEFAULT',
			showBottomNavigation: true
		}
	};
}) satisfies PageLoad;
