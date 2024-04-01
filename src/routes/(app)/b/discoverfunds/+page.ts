import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { sparkHeaders, promotionData, portfolios } = await parent();
	return {
		promotionData,
		portfolios,
		layoutConfig: {
			title: 'Mutual Funds',
			showCloseIcon: true,
			showSearchIcon: true,
			showBottomNavigation: true,
			layoutType: 'TWO_COLUMN',
			showAskAngelEntry: true,
			hideMobileHeader:
				typeof sparkHeaders.isTabView === 'boolean'
					? sparkHeaders.isTabView
					: sparkHeaders.isTabView === 'true'
		}
	};
}) satisfies PageLoad;
