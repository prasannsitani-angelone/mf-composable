import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { ITaxation } from '$lib/types/IInvestments';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getTaxation = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/taxations`;
		let taxationData: ITaxation = {
			stcgInvPercentage: 0,
			stcgInvAmount: 0,
			stcgInvUnits: 0,
			ltcgInvPercentage: 0,
			ltcgInvAmount: 0,
			ltcgInvUnits: 0,
			totalElssInvestedFy: 0,
			maxElssInvestAllowed: 0,
			elssInvestmentCap: 0
		};
		const response = await useFetch(url, {}, fetch);

		if (response.ok) {
			taxationData = response?.data?.data;
		}
		return taxationData;
	};

	const getPortfolio = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings`;

		const summaryData = useFetch(url + '?summary=true', {}, fetch);

		const chartData = useFetch(url + '?chart=true' + '&months=6', {}, fetch);

		const distributionData = useFetch(url + '?distribution=true', {}, fetch);

		const resData = await Promise.all([summaryData, chartData, distributionData]);

		return {
			summaryData:
				resData[0].ok && resData[0].data?.status === 'success' ? resData[0].data?.data || {} : {},
			chartData:
				resData[1].ok && resData[1].data?.status === 'success' ? resData[1].data?.data || {} : {},
			distributionData:
				resData[2].ok && resData[2].data?.status === 'success' ? resData[2].data?.data || {} : {}
		};
	};

	return {
		api: {
			allResponse: browser ? getPortfolio() : await getPortfolio(),
			taxation: browser ? getTaxation() : await getTaxation()
		},
		layoutConfig: {
			title: 'Portfolio Analysis',
			showBackIcon: true
		}
	};
}) satisfies PageLoad;
