<script lang="ts">
	import SearchOptionTableHeader from '../SearchOptionTable/SearchOptionTableHeader.svelte';
	import { page } from '$app/stores';

	import { getExploreFundsNavigationPath } from '$lib/utils';
	import type { ExploreFundNavItem, ExploreModalData } from '../../types';

	let toggleTaxSavingModal: (() => void) | null = null;
	let modalList: ExploreModalData;
	let pageID: string;
	$: exploreFundsNavigation = <ExploreFundNavItem[]>(function () {
		const searchDashboardData = $page.data.searchDashboardData;
		const result: ExploreFundNavItem[] = [];
		searchDashboardData.searchOptions?.forEach((options) => {
			result.push({
				href: getExploreFundsNavigationPath(options),
				title: options.name,
				id: options.id
			});
		});
		return result;
	})();

	export { toggleTaxSavingModal, modalList, pageID };
</script>

<header
	class="-mt-2 mb-2 ml-[calc(50%-50vw)] w-screen rounded-t-lg bg-white pb-5 sm:ml-0 sm:w-full md:mb-0 lg:px-6"
>
	<SearchOptionTableHeader {modalList} {exploreFundsNavigation} {toggleTaxSavingModal} {pageID} />
</header>
