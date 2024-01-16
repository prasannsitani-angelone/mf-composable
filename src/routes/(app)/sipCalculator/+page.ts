import type { PageLoad } from './$types';

export const load = (() => {
	return {
		layoutConfig: {
			title: 'Calculate Returns',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN_REVERSE',
			layoutClass: '!m-0 !p-0'
		}
	};
}) satisfies PageLoad;
