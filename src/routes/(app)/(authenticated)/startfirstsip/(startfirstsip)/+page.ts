import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from '../$types';
import { browser } from '$app/environment';
import type { SchemeDetails } from '$lib/types/ISchemeDetails';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ fetch }) => {
	let schemeData: [SchemeDetails];

	const getSchemePack = async (): Promise<[SchemeDetails]> => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/packs?packId=start_your_first_sip`;
		const res = await useFetch(url, { headers: { 'X-LRU': 'true' } }, fetch);

		if (res.ok) {
			schemeData = res.data.packs[0].schemes;
		} else {
			if (browser) {
				goto(`${base}/schemes/error`, { replaceState: true });
			} else {
				redirect(302, `${base}/schemes/error`);
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
			schemePack: browser ? getSchemePack() : await getSchemePack()
		}
	};
}) satisfies PageLoad;
