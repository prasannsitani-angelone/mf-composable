import { PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import type { CategoryOptionsEntity } from '$lib/types/IDiscoverFunds';

export const load = (async ({ fetch, url }) => {
	const pageID = url.searchParams.get('id');
	const getSearchOption = async () => {
		console.log('getSearchOption called');
		const url = `${PUBLIC_MF_CORE_BASE_URL_V2}/schemes?id=${pageID}`;
		let schemes: ExploreFundsOptions[] = [];
		let filterCategories: CategoryOptionsEntity[] = [];
		const res = await useFetch(url, {}, fetch);

		if (res.ok) {
			const responseData = res.data.data;
			schemes = responseData.schemes?.sort(
				(a: ExploreFundsOptions, b: ExploreFundsOptions) => a.sortBy2 - b.sortBy2
			);
			filterCategories = responseData.categories;
		}

		return { schemes, filterCategories };
	};

	return {
		api: {
			searchOption: hydrate ? getSearchOption() : await getSearchOption()
		},
		layoutConfig: {
			title: 'Explore Mutual Funds',
			showSearchIcon: true,
			showBackIcon: true,
			layoutType: 'DEFAULT',
			layoutBodyClass: '!max-w-full'
		},
		pageID
	};
}) satisfies PageLoad;
