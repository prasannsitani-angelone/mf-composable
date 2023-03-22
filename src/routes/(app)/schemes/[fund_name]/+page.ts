import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';

import type { PageLoad } from './$types';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
import { profileStore } from '$lib/stores/ProfileStore';
import { tokenStore } from '$lib/stores/TokenStore';
import { browser } from '$app/environment';
export const load = (async ({ fetch, params }) => {
	const fundName = params['fund_name'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();
	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];

	const getSchemeData = async () => {
		const headers = {
			userType: `${profileStore.userType()}`,
			accountType: `${profileStore?.accountType()}`,
			authorization: `Bearer ${tokenStore.activeToken()}`
		};
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		const res = await fetch(url, {
			headers
		});
		const schemeData: SchemeDetails = await res.json();

		return schemeData;
	};

	return {
		api: {
			schemeData: browser ? getSchemeData() : await getSchemeData()
		}
	};
}) satisfies PageLoad;
