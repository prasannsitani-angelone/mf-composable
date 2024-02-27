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
		// removing start_your_first_sip as temporary fix until final API changes from BE
		portfolioOptions = portfolioOptions.filter((x) => {
			return x.packId !== 'start_your_first_sip' && x.packId !== 'BEST_FUNDS_FOR_SIP';
		});
		return portfolioOptions;
	};

	return {
		api: {
			portfolioOptions: hydrate ? getPortfolioOptions() : await getPortfolioOptions()
		},
		layoutConfig: {
			title: 'Select a Portfolio',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN',
			showBottomNavigation: false
		}
	};
}) satisfies PageLoad;
