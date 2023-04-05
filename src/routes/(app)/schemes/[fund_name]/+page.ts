import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';

import type { PageLoad } from './$types';
import type { SchemeDetails, SchemeHoldings } from '$lib/types/ISchemeDetails';
import { browser } from '$app/environment';
import { MFCommonHeader } from '$lib/utils';
import type { FundComparisons } from './types';
export const load = (async ({ fetch, params }) => {
	const fundName = params['fund_name'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();
	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];
	const headers = MFCommonHeader();
	const getSchemeData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		const res = await fetch(url, {
			headers
		});
		const schemeData: SchemeDetails = await res.json();

		return schemeData;
	};

	const getFundHoldings = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/holdings`;
		const res = await fetch(url, {
			headers
		});
		const holdingData: Array<SchemeHoldings> = await res.json();

		return holdingData;
	};

	const getFundComparisonsData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/comparisons`;
		const res = await fetch(url, {
			headers
		});

		const holdingData: FundComparisons = await res.json();

		return holdingData;
	};
	return {
		api: {
			schemeData: browser ? getSchemeData() : await getSchemeData(),
			holdingData: browser ? getFundHoldings() : await getFundHoldings(),
			comparisons: browser ? getFundComparisonsData() : await getFundComparisonsData()
		}
	};
}) satisfies PageLoad;
