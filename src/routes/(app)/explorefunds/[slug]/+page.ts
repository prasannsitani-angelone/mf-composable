import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { useFetch } from '$lib/utils/useFetch';
import type { ExploreFundsOptions } from '../types';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const pageID = url.searchParams.get('id');
	const getSearchOption = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes?options=${pageID}`;
		let searchOption: ExploreFundsOptions[] = [];
		const res = await useFetch(url, {}, fetch);

		if (res.ok) {
			searchOption = res.data;
		}

		return searchOption;
	};
	return {
		api: {
			searchOption: browser ? getSearchOption() : await getSearchOption()
		},
		layoutConfig: {
			title: 'Explore Mutual Funds',

			showSearchIcon: true,
			showBackIcon: true,
			layoutType: 'DEFAULT'
		},
		pageID
	};
}) satisfies PageLoad;
