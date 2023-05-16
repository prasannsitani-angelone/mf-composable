import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
	return {
		layoutConfig: {
			title: 'Mutual Funds',
			showCloseIcon: true,
			showSearchIcon: true,
			showBottomNavigation: true,
			layoutType: 'TWO_COLUMN'
		},
		getNudgeData: data.streamed.getNudgeData
	};
}) satisfies PageLoad;
