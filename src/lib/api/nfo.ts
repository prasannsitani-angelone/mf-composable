import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { FetchType } from '$lib/types/Fetch';
import type { NFOList } from '$lib/types/INFOList';
import { useFetch } from '$lib/utils/useFetch';

const getactiveNfo = async (fetch?: FetchType) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes?nfo=true`;
	let NfoList: NFOList[] = [];

	const res = await useFetch(url, {}, fetch);

	if (res.ok) {
		NfoList = res?.data;
	}

	return NfoList;
};

export default getactiveNfo;
