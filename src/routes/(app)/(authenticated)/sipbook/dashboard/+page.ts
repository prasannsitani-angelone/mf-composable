import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import type { ISipBookData } from '$lib/types/ISipType';
import { encodeObject } from '$lib/utils/helpers/params';

export const load = (async ({ fetch, depends }) => {
	let sipBookData: ISipBookData | null = null;

	const getSipBookData = async () => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
		const res = await useFetch(sipUrl + '?InvestmentType=SIP', {}, fetch);
		if (res.ok) {
			sipBookData = res?.data?.data || [];
			return sipBookData;
		}
		return [];
	};
	depends('app:sipbook');

	const faqParams = encodeObject({
		tag: 'sips',
		showRecentOrders: true
	});

	return {
		layoutConfig: {
			title: 'SIPs',
			titleClass: '!text-xl',
			headerClass: '!bg-grey !py-2.5 !px-4 shadow-none',
			showBottomNavigation: true,
			showFaqIcon: true,
			faqParams
		},
		sipBookData: sipBookData,
		api: {
			getSipBookData: browser ? getSipBookData() : await getSipBookData()
		}
	};
}) satisfies PageLoad;
