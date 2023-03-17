import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';
import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, parent }) => {
	const getSchemeData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`;

		const headers = {
			userType: `${profileStore.userType()}`,
			accountType: `${profileStore?.accountType()}`,
			authorization: `Bearer ${tokenStore.activeToken()}`
		};
		const res = await fetch(url, {
			headers
		});
		if (res.ok) {
			const discoverFundData = await res.json();
			console.log(discoverFundData);
			return {
				...discoverFundData
			};
		} else {
			return {};
		}
	};
	return {
		api: {
			homePage: browser ? getSchemeData() : await getSchemeData()
		}
	};
}) satisfies PageLoad;
