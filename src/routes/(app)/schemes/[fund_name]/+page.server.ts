import { MF_CORE_BASE_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import * as api from '$lib/api';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
export const load = (async ({ params, locals }) => {
	const fundName = params['fund_name'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();
	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];
	const url = `${MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
	const schemeData: SchemeDetails = await api.get(url, locals);

	return {
		schemeData
	};
}) satisfies PageServerLoad;
