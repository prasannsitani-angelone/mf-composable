import { getPromotionData } from '$lib/api/promotions';
import type { PageLoad } from './$types';

let shouldLoadPromotionWidget = false;

const fetchPromotions = async () => {
	shouldLoadPromotionWidget = false;
	const res = await getPromotionData();
	shouldLoadPromotionWidget = true;
	if (res.ok) {
		return res.data;
	}
	return null;
};

export const load = (async ({ parent }) => {
	const { sparkHeaders } = await parent();
	const promotion = await fetchPromotions();
	return {
		api: {
			promotion,
			shouldLoadPromotionWidget
		},
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
