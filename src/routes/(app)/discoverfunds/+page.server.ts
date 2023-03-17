import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import type { PageServerLoad } from './$types';
import { get } from '$lib/api';
import { tokenStore } from '$lib/stores/TokenStore';
export const load = (async (event) => {
	// console.log(event)
	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`;
	const discoverFund: DiscoverFund = await get(url, event.locals);
	console.log(tokenStore.activeToken());
	return {
		homePage: discoverFund
	};
}) satisfies PageServerLoad;
