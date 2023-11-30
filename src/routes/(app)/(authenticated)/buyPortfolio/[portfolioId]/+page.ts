import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const getPortfolioOption = async () => {
		let portfolioOption: PortfolioPack = {
			packId: '',
			packName: '',
			packLogoUrl: '',
			description: '',
			minSipAmount: 0,
			threeYrReturnAvgPer: 0,
			totalUsersInvested: 0,
			benefits: [],
			features: [],
			schemes: []
		};
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/packs?packId=${params?.portfolioId}`;

		const res = await useFetch(url, {}, fetch);
		if (res.ok && res?.data?.packs.length > 0) {
			portfolioOption = res?.data?.packs[0];
		}
		return portfolioOption;
	};

	return {
		api: {
			portfolioOption: hydrate ? getPortfolioOption() : await getPortfolioOption()
		},
		layoutConfig: {
			title: 'Portfolio Details',
			showBackIcon: true,
			layoutType: 'DEFAULT',
			showBottomNavigation: false
		}
	};
}) satisfies PageLoad;
