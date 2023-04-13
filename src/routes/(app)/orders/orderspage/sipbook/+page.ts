import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getSipBookData = async () => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
		const res = await useFetch(sipUrl + '?InvestmentType=SIP', {}, fetch);
		if (res.ok) {
			const sipBookData = res?.data?.data || [];
			return sipBookData;
		}
		return [];
	};

	return {
		api: {
			getSipBookData: browser ? getSipBookData() : await getSipBookData()
		}
	};
}) satisfies PageLoad;
