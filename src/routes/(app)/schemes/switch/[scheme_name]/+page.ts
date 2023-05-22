import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FolioHoldingType } from '$lib/types/IInvestments';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { getFundUrlDetails } from '$lib/utils/helpers/normalizeFundName';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const { isin } = getFundUrlDetails(url.href);
	let folioHolding: FolioHoldingType;

	const getFolioHoldings = async (): Promise<FolioHoldingType> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}`;

		const res = await useFetch(url, {}, fetch);

		if (res.ok) {
			folioHolding = res?.data || [];
		}

		return folioHolding;
	};

	return {
		api: {
			folioHolding: hydrate ? getFolioHoldings() : await getFolioHoldings()
		},
		layoutConfig: {
			title: 'Switch Funds',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
