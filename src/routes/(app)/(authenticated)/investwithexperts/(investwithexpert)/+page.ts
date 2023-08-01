import type { PageLoad } from './$types';

export const load = (() => {
	return {
		layoutConfig: {
			title: 'Build Your Portfolio',
			layoutType: 'DEFAULT',
			layoutClass: 'pt-2 md:pt-2',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
