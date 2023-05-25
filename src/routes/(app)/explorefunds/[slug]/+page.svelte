<script lang="ts">
	import type { PageData } from './$types';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import SearchOptionHeader from './SearchOptionHeader/SearchOptionHeader.svelte';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import { onMount } from 'svelte';
	import { fundCardClick, sExploreMutualFunds, taxSavingInfo } from './analytics';
	import SchemeTable from '$components/SchemeTable.svelte';
	import ExploreFundModal from './ExploreFundModal/ExploreFundModal.svelte';
	import { page } from '$app/stores';

	let data: PageData;
	$: pageID = data?.pageID;
	$: modalList = searchDashboardData?.searchOptions?.filter(({ id }) => id === pageID) || [];
	$: isModalOpen = false;
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

	const toggleTaxSavingModal = () => {
		if (!isModalOpen) {
			taxSavingInfo({ Info: 'Learn more about Tax Saving Mutual Funds' });
		}
		isModalOpen = isModalOpen ? false : true;
	};

	const fundRowClicked = (event) => {
		const { schemes } = event.detail;
		const { isin } = schemes;

		const order = schemes?.sortBy2;
		const recommended = order > 0 && order < 3;
		const filter = modalList[0]?.name;
		fundCardClick({
			'Fund Name': `${schemes?.schemeName}(${schemes?.categoryName})`,
			isin,
			recommended,
			filter,
			order
		});
	};
	const searchDashboardData = $page.data.searchDashboardData;

	onMount(() => {
		const filter = modalList[0]?.name;
		sExploreMutualFunds({ filter });
	});

	export { data };
</script>

<article class="flex min-h-screen flex-col">
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />

	<h1 class="hidden pb-6 text-lg font-medium text-black-title sm:mt-3 md:block">
		Explore Mutual Funds
	</h1>

	<SearchOptionHeader {toggleTaxSavingModal} modalList={modalList[0]} {pageID} />

	<section class="ml-[calc(50%-50vw)] w-screen shadow-csm sm:ml-0 sm:w-full md:bg-white md:pt-4">
		<section>
			{#await data?.api?.searchOption}
				<TableSkeleton />
			{:then searchOption}
				<SchemeTable {searchOption} on:fundRowClicked={fundRowClicked} />
			{/await}
		</section>
	</section>
	<ExploreFundModal {isModalOpen} {toggleTaxSavingModal} modalList={modalList[0]} />
</article>
