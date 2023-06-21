import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import type { InvestmentSummary } from '$lib/types/IInvestments';
import { useFetch } from '$lib/utils/useFetch';

export const getHoldingSummary = async (token: string, fetch: FetchType) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?summary=true`;
	let investmentSummary: InvestmentSummary;
	try {
		const res = await useFetch(
			url,
			{
				headers: {
					authorization: `Bearer ${token}`,
					authtoken: token
				}
			},
			fetch
		);

		if (res?.ok) {
			const summaryData = res.data;
			investmentSummary = summaryData?.data?.summary || {};
		} else {
			investmentSummary = {};
		}
	} catch (e) {
		investmentSummary = {};
	}

	return investmentSummary;
};
