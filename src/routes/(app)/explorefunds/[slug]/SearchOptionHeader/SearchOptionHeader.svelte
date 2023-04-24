<script lang="ts">
	import Button from '$components/Button.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import TaxSavingIcon from '$lib/images/icons/TaxSavingIcon.svelte';
	import SearchOptionTableHeader from '../SearchOptionTable/SearchOptionTableHeader.svelte';
	import { page } from '$app/stores';

	import { getExploreFundsNavigationPath } from '$lib/utils';
	import type { ExploreFundNavItem } from '../../types';

	let toggleTaxSavingModal: (() => void) | null = null;

	$: isTaxSavingFund = $page.data.pageID == '41';

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

	export { toggleTaxSavingModal };
</script>

<header
	class="-mt-2 mb-2 ml-[calc(50%-50vw)] w-screen bg-white pb-5 sm:ml-0 sm:w-full md:mb-0 lg:px-6"
>
	<SearchOptionTableHeader {exploreFundsNavigation} />

	{#if isTaxSavingFund}
		<Button variant="transparent" class="no-animation w-full px-0" onClick={toggleTaxSavingModal}>
			<aside class="mt-5 flex w-full cursor-pointer items-center rounded bg-grey px-5 py-3">
				<TaxSavingIcon />
				<span class="ml-3 text-sm font-medium text-black-title"
					>Learn more about Tax Saving Mutual Funds</span
				>
				<RightIcon class="ml-auto" />
			</aside>
		</Button>
	{/if}
</header>
