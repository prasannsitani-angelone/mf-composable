import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const fundName = params['investment'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();

	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];

	const getSchemeData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		return useFetch(url, {}, fetch);
	};

	const getHoldingsData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}`;
		return useFetch(url, {}, fetch);
	};

	const getHoldingsChartData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}/chart`;
		return useFetch(url, {}, fetch);
	};

	const getOrdersData = () => {
		const reqQuery = `?isin=${isin}&schemeCode=${schemeCode}`;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/transactions${reqQuery}`;
		return useFetch(url, {}, fetch);
	};

	const getBenchmarkData = async (benchMarkCoCode = '') => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/simulate?index=${benchMarkCoCode}&months=240&isin=${isin}`;
		const res = await useFetch(url, {}, fetch);

		if (res?.ok && res?.status === 200) {
			return res?.data;
		}
		return {};
	};

	const getPageData = async () => {
		try {
			const res = await Promise.all([
				getHoldingsData(),
				getHoldingsChartData(),
				getOrdersData(),
				getSchemeData()
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
				benchmarkData
			};
		} catch (e) {
			console.log('the errorrrrrr -- ', e);
		}
	};

	const getHoldingTaxationDetails = async () => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/taxations?isin=${isin}&schemeCode=${schemeCode}`;
			return await useFetch(url, {}, fetch);
		} catch (e) {
			return {};
		}
	};

	return {
		api: {
			allResponse: browser ? getPageData() : await getPageData(),
			taxationDetails: browser ? getHoldingTaxationDetails() : await getHoldingTaxationDetails()
		},
		layoutConfig: {
			title: 'Investment Details',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
