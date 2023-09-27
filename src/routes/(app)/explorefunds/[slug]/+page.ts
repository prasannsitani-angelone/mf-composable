import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';

import type { PageLoad } from './$types';
import type { SearchOptionsEntity } from '$lib/types/IDiscoverFunds';

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

	const filterOptions = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard`;
		const res = await useFetch(url, {}, fetch);
		let dashboardData: { searchOptions: SearchOptionsEntity[] } = { searchOptions: [] };
		if (res.ok) {
			dashboardData = res.data;
		}
		const title = dashboardData.searchOptions?.filter(({ id }) => id === pageID) || [];
		return title[0];
	};

	const filter = await filterOptions();

	return {
		api: {
			searchOption: hydrate ? getSearchOption() : await getSearchOption()
		},
		filter,
		layoutConfig: {
			title: filter.name,
			showSearchIcon: true,
			showBackIcon: true,
			layoutType: 'DEFAULT',
			layoutBodyClass: '!max-w-full'
		},
		pageID
	};
}) satisfies PageLoad;
