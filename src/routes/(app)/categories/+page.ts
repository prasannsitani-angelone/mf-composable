import { PUBLIC_MF_CORE_BASE_URL, PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
import { hydrate } from '$lib/utils/helpers/hydrated';
import { useFetch } from '$lib/utils/useFetch';
import type { PageLoad } from './$types';
import type { CategoryOptionsEntity, SearchOptionsEntity } from '$lib/types/IDiscoverFunds';
import { EXPLORE_FUND_PAGE_TYPE } from '$lib/constants/exploreFunds';

export const load = (async ({ fetch, url }) => {
	const pageID = url.searchParams.get('id');
	const pageType = url.searchParams.get('type');
	const getSearchOption = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL_V2}/schemes?id=${pageID}`;
		let schemes: ExploreFundsOptions[] = [];
		let filterCategories: CategoryOptionsEntity[] = [];
		const res = await useFetch(url, {}, fetch);

		if (res.ok) {
			const responseData = res.data.data;
			schemes = responseData.schemes?.sort(
				(a: ExploreFundsOptions, b: ExploreFundsOptions) => a.sortBy2 - b.sortBy2
			);
			if (pageType === EXPLORE_FUND_PAGE_TYPE.CATEGORIES) {
				filterCategories = res?.data?.data?.categories;
			}
		}

		return { schemes, filterCategories };
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

	let filter = [];
	if (pageType !== EXPLORE_FUND_PAGE_TYPE.CATEGORIES) filter = await filterOptions();

	return {
		api: {
			searchOption: hydrate ? getSearchOption() : await getSearchOption(),
			url
		},
		filter,
		layoutConfig: {
			title: 'Explore Mutual Funds',
			showSearchIcon: true,
			showBackIcon: true,
			layoutType: 'DEFAULT',
			layoutBodyClass: '!max-w-full'
		},
		pageID,
		pageType
	};
}) satisfies PageLoad;
