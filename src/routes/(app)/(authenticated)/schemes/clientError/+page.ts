import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		layoutConfig: {
			title: 'Fund details',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
