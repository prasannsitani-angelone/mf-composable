import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';

import type { PageLoad } from './$types';
import type { SchemeDetails, SchemeHoldings } from '$lib/types/ISchemeDetails';
import { browser } from '$app/environment';
import type { FundComparisons } from './types';
import { useFetch } from '$lib/utils/useFetch';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { goto } from '$app/navigation';
export const load = (async ({ fetch, params }) => {
	const fundName = params['fund_name'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();
	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];
	const getSchemeData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		let schemeData: SchemeDetails | Error;
		const res = await useFetch(
			url,
			{
				headers: {
					'X-LRU': 'true'
				}
			},
			fetch
		);

		if (res.ok) {
			schemeData = res.data;
		} else {
			if (browser) {
				goto(`${base}/schemes/error`);
			} else {
				throw redirect(302, `${base}/schemes/error`);
			}
		}

		return schemeData;
	};

	const getFundHoldings = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/holdings`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: Array<SchemeHoldings> = res.data;

		return holdingData;
	};

	const getFundComparisonsData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/comparisons`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: FundComparisons = res.data;

		return holdingData;
	};

	const getPreviousPaymentDetails = async () => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/user/paymentHandlers`;
			return await useFetch(url, {}, fetch);
		} catch (e) {
			return {};
		}
	};

	return {
		layoutConfig: {
			title: 'Fund Details',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		},
		api: {
			schemeData: browser ? getSchemeData() : await getSchemeData(),
			holdingData: browser ? getFundHoldings() : await getFundHoldings(),
			comparisons: browser ? getFundComparisonsData() : await getFundComparisonsData(),
			previousPaymentDetails: browser
				? getPreviousPaymentDetails()
				: await getPreviousPaymentDetails()
		}
	};
}) satisfies PageLoad;
