import type { PageLoad } from './$types';

export const load = (() => {
	return {
		layoutConfig: {
			title: 'Filter Mutual Funds',
			showBackIcon: true,
			layoutType: 'DEFAULT',
			layoutBodyClass: '!max-w-full'
		}
	};
}) satisfies PageLoad;
