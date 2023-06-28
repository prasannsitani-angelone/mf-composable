import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from '../$types';
import { browser } from '$app/environment';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ fetch, params }) => {
	const isinSchemeCode = params['scheme'];
	const schemeMetadata = isinSchemeCode?.split('isin-')[1]?.toUpperCase();

	const [isin = '', schemeCode = ''] = schemeMetadata?.split('-SCHEMECODE-') || [];

	let schemeData: SchemeDetails;

	const getSchemeData = async (): Promise<SchemeDetails> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/${schemeCode}`;
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
				goto(`${base}/schemes/error`, { replaceState: true });
			} else {
				throw redirect(302, `${base}/schemes/error`);
			}
		}

		return schemeData;
	};

	return {
		layoutConfig: {
			title: 'Start Your First Investment',
			showBackIcon: true,
			layoutType: 'DEFAULT'
		},
		api: {
			schemeData: browser ? getSchemeData() : await getSchemeData()
		}
	};
}) satisfies PageLoad;
