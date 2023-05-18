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
		const reqQuery = `?status=ORDER_COMPLETE&isin=${isin}`;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders${reqQuery}`;
		return useFetch(url, {}, fetch);
	};

	const getPreviousPaymentDetails = async () => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/user/paymentHandlers`;
			return await useFetch(url, {}, fetch);
		} catch (e) {
			return {};
		}
	};

	const getPageData = async () => {
		try {
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
		} catch (e) {
			console.log('the errorrrrrr -- ', e);
		}
	};

	return {
		api: {
			allResponse: browser ? getPageData() : await getPageData(),
			previousPaymentDetails: browser
				? getPreviousPaymentDetails()
				: await getPreviousPaymentDetails()
		},
		layoutConfig: {
			title: 'Investment Details',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		}
	};
}) satisfies PageLoad;
