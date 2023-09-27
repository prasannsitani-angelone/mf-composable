import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		layoutConfig: {
			title: 'Mutual Funds',
			showCloseIcon: true,
			showSearchIcon: true,
			showBottomNavigation: true,
			layoutType: 'TWO_COLUMN',
			showAskAngelEntry: true
		}
	};
}) satisfies PageLoad;
