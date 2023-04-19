<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';

	import { getExploreFundsNavigationPath } from '$lib/utils';
	import type { ExploreFundNavItem } from '../types';
	import type { PageData } from './$types';
	import SearchOptionHeader from './SearchOptionTable/SearchOptionHeader.svelte';
	import SearchOptionTable from './SearchOptionTable/SearchOptionTable.svelte';

	let data: PageData;

	$: breadCrumbs = [
		{
			text: 'Home',
			href: '/discoverfunds'
		},
		{
			text: 'Explore Mutual Fund',
			href: '/explorefunds/sip-with-100'
		}
	];

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

	export { data };
</script>

<article class="flex min-h-screen flex-col">
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />

	<h1 class="hidden pb-6 text-lg font-medium text-black-title sm:mt-3 md:block">
		Explore Mutual Funds
	</h1>
	<section
		class="ml-[calc(50%-50vw)] w-screen rounded-lg shadow-csm sm:ml-0 sm:w-full md:bg-white md:pt-4"
	>
		<header class="-mt-2 mb-2 bg-white pb-5 md:mb-0 lg:px-6">
			<SearchOptionHeader {exploreFundsNavigation} />
		</header>
		<section>
			{#await data?.api?.searchOption}
				Loading...
			{:then searchOption}
				<SearchOptionTable {searchOption} />
			{:catch error}
				Error...
			{/await}
		</section>
	</section>
</article>
