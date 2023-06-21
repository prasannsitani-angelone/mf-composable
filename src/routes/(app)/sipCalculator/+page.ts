import type { PageLoad } from './$types';

export const load = (() => {
	return {
		layoutConfig: {
			title: 'SIP Calculator',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN_REVERSE'
		}
	};
}) satisfies PageLoad;
