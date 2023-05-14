<script lang="ts">
	import type { PageData } from './$types';
	import SearchOptionTable from './SearchOptionTable/SearchOptionTable.svelte';
	import TaxSavingModal from './TaxSavingModal/TaxSavingModal.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import SearchOptionHeader from './SearchOptionHeader/SearchOptionHeader.svelte';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import { onMount } from 'svelte';
	import { sExploreMutualFunds, taxSavingInfo } from './analytics';
	let data: PageData;
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

	onMount(() => {
		sExploreMutualFunds();
	});
	export { data };
</script>

<article class="flex min-h-screen flex-col">
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />

	<h1 class="hidden pb-6 text-lg font-medium text-black-title sm:mt-3 md:block">
		Explore Mutual Funds
	</h1>

	<SearchOptionHeader {toggleTaxSavingModal} />

	<section class="ml-[calc(50%-50vw)] w-screen shadow-csm sm:ml-0 sm:w-full md:bg-white md:pt-4">
		<section>
			{#await data?.api?.searchOption}
				<TableSkeleton />
			{:then searchOption}
				<SearchOptionTable {searchOption} />
			{:catch error}
				Error...
			{/await}
		</section>
	</section>
	<TaxSavingModal {isModalOpen} {toggleTaxSavingModal} />
</article>
