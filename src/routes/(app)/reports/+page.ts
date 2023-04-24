import type { PageLoad } from './$types';

export const load = (() => {
	return {
		layoutConfig: {
			title: 'Reports',
			showBackIcon: true,
			showCloseIcon: true,
			layoutType: 'TWO_COLUMN_RIGHT_LARGE'
		}
	};
}) satisfies PageLoad;
