import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FolioHoldingType } from '$lib/types/IInvestments';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { getFundUrlDetails } from '$lib/utils/helpers/normalizeFundName';
import { decodeToObject } from '$lib/utils/helpers/params';
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

	const getSwitchInSchemeData = async () => {
		const params = url.searchParams.get('params');
		const decodedParams = decodeToObject(params);
		const { isin, schemeCode } = decodedParams;
		if (isin) {
			const fundUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
			const res = await useFetch(fundUrl, {});
			return res;
		}
		return {};
	};

	return {
		api: {
			folioHolding: hydrate ? getFolioHoldings() : await getFolioHoldings(),
			getSwitchInSchemeData: hydrate ? getSwitchInSchemeData() : await getSwitchInSchemeData()
		},
		layoutConfig: {
			title: 'Switch Funds',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
