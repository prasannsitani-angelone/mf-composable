import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import type { ScreenedSchemes } from '$lib/types/Screener';
import { useFetch } from '$lib/utils/useFetch';

const getScreenerSearch = async (fetch?: FetchType | null, queryPath?: string) => {
	let screenedSchemes: ScreenedSchemes[] = [];
	let url = `${PUBLIC_MF_CORE_BASE_URL}/search/schemes`;

	if (queryPath) {
		url = `${url}?${queryPath}`;
	}
	const res = await useFetch(url, {}, fetch);

	if (res.ok) {
		screenedSchemes = res.data?.data?.schemes;
	}

	return screenedSchemes;
};

export { getScreenerSearch };
