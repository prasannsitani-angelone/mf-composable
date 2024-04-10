import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';

export const getHoldingsChartData = async (isin: string, months: number, isExternal = false) => {
	let url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/${isin}/chart?months=${months}`;
	if (isExternal) {
		url = `${url}&external=${isExternal}`;
	}

	const res = await useFetch(url, {}, fetch);

	if (res.ok && res.data?.status === 'success') {
		return res?.data?.data?.chart;
	}
	return [];
};

export const getBenchmarkData = async (
	isin: string,
	months: number,
	benchMarkCoCode = '',
	isExternal = false
) => {
	let url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/simulate?index=${benchMarkCoCode}&months=${months}&isin=${isin}`;
	if (isExternal) {
		url = `${url}&isExternal=${isExternal}`;
	}

	const res = await useFetch(url, {}, fetch);

	if (res?.ok && res?.status === 200) {
		return res?.data;
	}
	return {};
};
