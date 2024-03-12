import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import { useFetch } from '$lib/utils/useFetch';

const getStoriesData = async (fetch?: FetchType) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/utils/meta?discoverpageconfig=true`;
	const response = await useFetch(url, {}, fetch);
	return response;
};

export { getStoriesData };
