import { browser } from '$app/environment';
import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { hydratedStore } from '$lib/stores/AppHydratedStore';
import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
import { useFetch } from '$lib/utils/useFetch';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	let hydrate = false;
	const pageID = url.searchParams.get('id');
	const getSearchOption = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes?options=${pageID}`;
		let searchOption: ExploreFundsOptions[] = [];
		const res = await useFetch(url, {}, fetch);

		if (res.ok) {
			searchOption = res.data;
			searchOption = searchOption?.sort(
				(a: ExploreFundsOptions, b: ExploreFundsOptions) => a.sortBy2 - b.sortBy2
			);
		}

		return searchOption;
	};

	hydratedStore.subscribe(({ isHydrated }) => (hydrate = isHydrated));

	return {
		api: {
			searchOption: hydrate ? getSearchOption() : await getSearchOption()
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
