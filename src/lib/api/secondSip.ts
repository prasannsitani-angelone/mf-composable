import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
export const getInvestmentData = async () => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings`;
	const response = await useFetch(url, {}, fetch);
	if (response?.ok && response?.status === 200) {
		const investmentData = response.data?.data?.holdings || [];
		return investmentData;
	} else {
		return [];
	}
};

export const getSipRecommendationData = async () => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/recommendation/sip`;

	const response = await useFetch(url, {}, fetch);
	if (response?.ok && response?.status === 200) {
		const recommendationData = response.data;
		return {
			...recommendationData
		};
	} else {
		return {};
	}
};
