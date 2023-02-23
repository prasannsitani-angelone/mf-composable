import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await useFetch(`/schemes/searchDashboard?options=true`, {}, fetch);
	const discoverFund: DiscoverFund = await res.json();
	console.log(discoverFund);
	return {
		homePage: discoverFund
	};
}) satisfies PageLoad;
