import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';
import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, parent }) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`;
	const headers = {
		userType: `${profileStore.userType()}`,
		accountType: `${profileStore?.accountType()}`,
		authorization: `Bearer ${tokenStore.activeToken()}`
	};
	const res = await fetch(url, {
		headers
	});
	console.log(res);

	if (res.ok) {
		const discoverFundData = await res.json();
		return {
			homePage: discoverFundData
		};
	} else {
		return {};
	}
}) satisfies PageLoad;
