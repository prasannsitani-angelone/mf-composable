import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getSipData = async () => {
		let sipData = {};

		const url = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			sipData = res?.data;
			return sipData;
		}
		return sipData;
	};
	return {
		api: {
			data: browser ? getSipData() : await getSipData()
		}
	};
}) satisfies PageLoad;
