import type { PageLoad } from './$types';

export const load = (() => {
	return {
		layoutConfig: {
			title: 'Invest With Experts',
			layoutType: 'DEFAULT',
			layoutClass: 'pt-2 md:pt-2',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
