import type { PageLoad } from './$types';

export const load = (() => {
	return {
		layoutConfig: {
			title: 'Explore Mutual Funds',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN_RIGHT_LARGE_TEMP',

			showSearchIcon: true
		}
	};
}) satisfies PageLoad;
