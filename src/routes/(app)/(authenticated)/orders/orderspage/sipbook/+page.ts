import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import SipTabSelection from '../TabSelection/SipTabSelection.svelte';
import type { ISipBookData } from '$lib/types/ISipType';

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
	return {
		layoutConfig: {
			title: 'All Orders',
			titleClass: '!text-2xl',
			headerClass: '!bg-grey !p-4',
			component: SipTabSelection,
			showBottomNavigation: true
		},
		sipBookData: sipBookData,
		api: {
			getSipBookData: browser ? getSipBookData() : await getSipBookData()
		}
	};
}) satisfies PageLoad;
