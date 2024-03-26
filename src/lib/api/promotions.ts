import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';

const getPromotionData = async (fetch?: FetchType) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/promotion`;
	const response = await useFetch(url, {}, fetch);
	return response;
};

export { getPromotionData };
