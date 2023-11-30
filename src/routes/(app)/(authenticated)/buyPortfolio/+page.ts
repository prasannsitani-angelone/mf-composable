import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getPortfolioOptions = async () => {
		let portfolioOptions: PortfolioPack[] = [];
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/packs`;

		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			portfolioOptions = res?.data?.packs;
		}
		return portfolioOptions;
	};

	return {
		api: {
			portfolioOptions: hydrate ? getPortfolioOptions() : await getPortfolioOptions()
		},
		layoutConfig: {
			title: 'Select a Portfolio',
			showBackIcon: true,
			layoutType: 'DEFAULT',
			showBottomNavigation: false
		}
	};
}) satisfies PageLoad;
