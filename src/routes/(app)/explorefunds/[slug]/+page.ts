import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
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
