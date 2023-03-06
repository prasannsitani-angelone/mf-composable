import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await useFetch(`${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`, {}, fetch);
	let discoverFund: DiscoverFund;
	console.log(res)
	if (res.ok) {
		discoverFund = await res.json();
		console.log(discoverFund);
	}

	return {
		homePage: discoverFund
	};
}) satisfies PageLoad;
