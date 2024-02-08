import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		layoutConfig: {
			title: 'Ask Angel',
			showBackIcon: true,
			layoutType: 'DEFAULT',
			layoutClass: 'bg-background-alt',
			headerClass: 'hidden'
		}
	};
}) satisfies PageLoad;
