import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';
import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, parent }) => {
	const getSchemeData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`;
		const res = await useFetch(url, {}, fetch);
		if (res.ok) {
			const discoverFundData = res.data;
			return {
				...discoverFundData
			};
		} else {
			return {
				searchOptions: [],
				weeklyTopSchemes: []
			};
		}
	};

	return {
		api: {
			homePage: browser ? getSchemeData() : await getSchemeData()
		}
	};
}) satisfies PageLoad;
