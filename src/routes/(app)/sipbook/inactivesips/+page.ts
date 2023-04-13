import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const getInactiveSipData = async () => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
		const res = await useFetch(sipUrl + '?InvestmentType=SIP&status=SIP_CANCELLED', {}, fetch);
		if (res.ok) {
			const sipData = res.data;
			return sipData?.data?.cancelledSips || [];
		}
		return [];
	};

	return {
		api: {
			getInactiveSipData: browser ? getInactiveSipData() : await getInactiveSipData()
		}
	};
}) satisfies PageLoad;
