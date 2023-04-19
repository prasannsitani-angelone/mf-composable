import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const fundName = params['investment'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();

	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];

	const getSchemeData = () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		return useFetch(url, {}, fetch);
		// debugger;
		// const schemeData: SchemeDetails = res.data;

		// return schemeData;
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
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders?status=ORDER_COMPLETE&isin=${isin}`;
		return useFetch(url, {}, fetch);
	};

	const getPageData = async () => {
		const res = await Promise.all([
			getHoldingsData(),
			getHoldingsChartData(),
			getOrdersData(),
			getSchemeData()
		]);
		return {
			holdingsData: res[0].ok ? res[0].data || {} : {},
			chartData: res[1].ok && res[1].data?.status === 'success' ? res[1].data?.data || {} : {},
			ordersData: res[2].ok && res[2].data?.status === 'success' ? res[2].data?.data || {} : {},
			schemeData: res[3].ok ? res[3].data || {} : {}
		};
	};

	return {
		api: browser ? getPageData() : await getPageData(),
		layoutConfig: {
			title: 'Investment Details',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
