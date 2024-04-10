import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const isExternal = true;
	const queryParam = 'external=true';
	const fundName = params['investment'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();

	const [isin = '', schemeCodeAndRTA = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];
	const [schemeCode = '', rtaSchemeCode = ''] = schemeCodeAndRTA?.split('-RTASCHEMECODE-') || [];

	const getSchemeData = () => {
		if (isExternal) {
			return {};
		}

		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		return useFetch(url, {}, fetch);
	};

	const getHoldingsData = () => {
		const reqQuery = `?${queryParam}`;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}${reqQuery}`;
		return useFetch(url, {}, fetch);
	};

	const getHoldingsChartData = () => {
		const reqQuery = `?${queryParam}`;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}/chart${reqQuery}`;
		return useFetch(url, {}, fetch);
	};

	const getOrdersData = () => {
		const reqQuery = `?isin=${isin}&schemeCode=${rtaSchemeCode}&${queryParam}`;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/transactions${reqQuery}`;
		return useFetch(url, {}, fetch);
	};

	const getMappingScheme = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}/mappings?purchaseAllowed=Y&switchAllowed=Y`;
		return useFetch(url, {}, fetch);
	};

	const getBenchmarkData = async (benchMarkCoCode = '') => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/simulate?index=${benchMarkCoCode}&months=240&isin=${isin}&isExternal=true`;
		const res = await useFetch(url, {}, fetch);

		if (res?.ok && res?.status === 200) {
			return res?.data;
		}
		return {};
	};

	const getPageData = async () => {
		const res = await Promise.all([
			getHoldingsData(),
			getHoldingsChartData(),
			getOrdersData(),
			getSchemeData(),
			getMappingScheme()
		]);

		let benchmarkData = {};
		if (res[0].ok && res[0].data?.benchMarkCoCode) {
			const benchMarkCoCode = res[0].data?.benchMarkCoCode;
			benchmarkData = await getBenchmarkData(benchMarkCoCode);
		}

		return {
			holdingsData: res[0].ok ? res[0].data || {} : {},
			chartData: res[1].ok && res[1].data?.status === 'success' ? res[1].data?.data || {} : {},
			ordersData:
				res[2].ok && res[2].data?.status === 'success' ? res[2].data?.transactions || [] : [],
			schemeData: res[3].ok ? res[3].data || {} : {},
			mappingScheme:
				res[4].ok && res[4].data?.status === 'success' ? res[4].data.regularDirectScheme[0] : {},
			benchmarkData
		};
	};

	return {
		api: { allResponse: browser ? getPageData() : await getPageData() },
		isExternal,
		layoutConfig: {
			title: 'Investment Details',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
