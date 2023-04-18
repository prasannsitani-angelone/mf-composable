import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const fundName = params['investment'];
	const schemeMetadata = fundName?.split('-isin-')[1]?.toUpperCase();

	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];

	const getSchemeData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
		const res = await useFetch(url, {}, fetch);
		const schemeData: SchemeDetails = res.data;

		return schemeData;
	};
	return {
		layoutConfig: {
			title: 'Order Pad',
			showBackIcon: true,
			layoutType: 'TWO_COLUMN'
		},
		api: {
			schemeData: browser ? getSchemeData() : await getSchemeData()
		}
	};
}) satisfies PageLoad;
