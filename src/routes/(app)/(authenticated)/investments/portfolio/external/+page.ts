import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { ITaxation } from '$lib/types/IInvestments';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getTaxation = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/taxations?external=true`;
		let taxationData: ITaxation = {
			stcgCurPercentage: 0,
			stcgCurAmount: 0,
			stcgInvUnits: 0,
			ltcgCurPercentage: 0,
			ltcgCurAmount: 0,
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

	const getBenchmarkData = async (benchMarkCoCode = '') => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/simulate?index=${benchMarkCoCode}&months=240&isExternal=true`;
		const res = await useFetch(url, {}, fetch);

		if (res?.ok && res?.status === 200) {
			return res?.data;
		}
		return {};
	};

	const getPortfolio = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?external=true`;

		const summaryData = useFetch(url + '&summary=true', {}, fetch);

		const chartData = useFetch(url + '&chart=true' + '&months=240', {}, fetch);

		const distributionData = useFetch(url + '&distribution=true', {}, fetch);

		const resData = await Promise.all([summaryData, chartData, distributionData]);

		let benchmarkData = {};
		if (resData[0].ok && resData[0].data?.data?.isEquityPortfolioFlag) {
			const benchMarkCoCode = resData[0].data?.data?.benchMarkCoCode;
			benchmarkData = await getBenchmarkData(benchMarkCoCode);
		}

		return {
			summaryData: resData[0].ok ? resData[0].data?.data?.summary || {} : {},
			chartData:
				resData[1].ok && resData[1].data?.status === 'success' ? resData[1].data?.data || {} : {},
			distributionData:
				resData[2].ok && resData[2].data?.status === 'success' ? resData[2].data?.data || {} : {},
			benchmarkData
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
