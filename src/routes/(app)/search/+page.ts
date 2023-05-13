import type { PageLoad } from './$types';
export const load = (async () => {
	return {
		layoutConfig: {
			title: 'Discover Mutual Funds',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
