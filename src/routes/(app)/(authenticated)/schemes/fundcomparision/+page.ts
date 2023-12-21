import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';

import type { PageLoad } from './$types';
import { useFetch } from '$lib/utils/useFetch';
import { decodeToObject } from '$lib/utils/helpers/params';
import { hydrate } from '$lib/utils/helpers/hydrated';

export const load = (async ({ fetch, url }) => {
	const queryParam = url?.searchParams?.get('params') || '';

	const decodedParams = decodeToObject(queryParam);
	const { comparisionArr } = decodedParams || {};

	const getSchemeData = async (isin: string, schemeCode: string) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		return await useFetch(
			url,
			{
				headers: {
					'X-LRU': 'true'
				}
			},
			fetch
		);
	};

	const getFundHoldings = async (isin: string) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/holdings`;
		return await useFetch(url, {}, fetch);
	};

	const getGraphData = async (isin: string) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/nav?months=36&simulate=true&initialFund=1000`;
		return await useFetch(url, {}, fetch);
	};

	const getSectorData = async (isin: string) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/sectors`;
		return await useFetch(url, {}, fetch);
	};

	const getCompleteData = async (comparisionArr) => {
		const result = [];
		for (let i = 0; i < comparisionArr.length; i++) {
			const { isin, schemeCode } = comparisionArr[i];
			const response = await Promise.all([
				getSchemeData(isin, schemeCode),
				getFundHoldings(isin),
				getGraphData(isin),
				getSectorData(isin)
			]);
			result.push({
				schemeData: response[0].ok ? response[0].data || {} : {},
				holdingsData: response[1].ok ? response[1].data || [] : [],
				chartsData: response[2].ok ? response[2].data || [] : [],
				sectorData: response[3].ok ? response[3].data?.sectorDetails || [] : []
			});
		}

		return result;
	};

	return {
		layoutConfig: {
			title: 'Compare Funds',
			showBackIcon: true
		},
		api: {
			comparisionData: hydrate
				? getCompleteData(comparisionArr)
				: await getCompleteData(comparisionArr)
		},
		comparisionArr
	};
}) satisfies PageLoad;
