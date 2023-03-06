import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { DiscoverFund } from '$lib/types/IDiscoverFunds';
import { useFetch } from '$lib/utils/useFetch';
import type { PageServerLoad } from './$types';
import { get } from '$lib/api';
export const load = (async ({ fetch, locals }) => {
	const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard?options=true`;
	const discoverFund: DiscoverFund = await get(url, locals);

	return {
		homePage: discoverFund
	};
}) satisfies PageServerLoad;
