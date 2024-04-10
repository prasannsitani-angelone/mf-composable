import { getBenchmarkData, getHoldingsChartData } from '$lib/api/investment';
import { tags } from '../../schemes/[fund_name]/constants';

export const updateLineChart = async (
	tagIndex: number,
	params: string,
	benchMarkCoCode = '',
	isExternal = false
) => {
	const schemeMetadata = params?.split('-isin-')[1]?.toUpperCase();
	const [isin = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];

	let res;
	const months = tags[tagIndex].months;

	if (benchMarkCoCode) {
		res = await Promise.all([
			getHoldingsChartData(isin, months, isExternal),
			getBenchmarkData(isin, months, benchMarkCoCode, isExternal)
		]);
	} else {
		res = await Promise.all([getHoldingsChartData(isin, months, isExternal)]);
	}

	return res;
};
