<script lang="ts">
	import SearchOptionTableHeader from '../SearchOptionTable/SearchOptionTableHeader.svelte';
	import { page } from '$app/stores';

	import { getExploreFundsNavigationPath } from '$lib/utils';
	import type { ExploreFundNavItem, ExploreModalData } from '../../types';

	let toggleTaxSavingModal: (() => void) | null = null;
	let modalList: ExploreModalData;
	$: exploreFundsNavigation = <ExploreFundNavItem[]>(function () {
		const searchDashboardData = $page.data.searchDashboardData;
		const result: ExploreFundNavItem[] = [];
		searchDashboardData.searchOptions?.forEach((options) => {
			result.push({
				href: getExploreFundsNavigationPath(options),
				title: options.name
			});
		});
		return result;
	})();

	export { toggleTaxSavingModal, modalList };
</script>

<header
	class="-mt-2 mb-2 ml-[calc(50%-50vw)] w-screen bg-white pb-5 sm:ml-0 sm:w-full md:mb-0 lg:px-6"
>
	<SearchOptionTableHeader {modalList} {exploreFundsNavigation} {toggleTaxSavingModal} />
</header>
