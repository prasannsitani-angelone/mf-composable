import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		layoutConfig: {
			title: 'Favourites',
			showBackIcon: true,
			layoutType: 'DEFAULT',
			showBottomNavigation: true,
			showSearchIcon: true
		}
	};
}) satisfies PageLoad;
