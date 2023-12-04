<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import PageTitle from '$components/PageTitle.svelte';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import type { ITab } from '$lib/types/ITab';
	import InvestmentTab from '../(dashboard)/components/InvestmentTab.svelte';
	import type { PageData } from './$types';
	import TaxationTable from './TaxationTable.svelte';
	export let data: PageData;

	const navigateToEquite = async () => {
		await goto(`${base}/investments/ltcg-stcg-gains?taxType=${data?.taxType}&holdingType=EQUITY`, {
			replaceState: true
		});
	};
	$: activeTab = data?.holdingType === 'NON_EQUITY' ? 'Non Equity' : 'Equity';
	const navigateToNonEquity = async () => {
		await goto(
			`${base}/investments/ltcg-stcg-gains?taxType=${data?.taxType}&holdingType=NON_EQUITY`,
			{ replaceState: true }
		);
	};

	const tabs: ITab[] = [
		{
			name: 'Equity',
			onClick: navigateToEquite
		},
		{
			name: 'Non Equity',
			onClick: navigateToNonEquity
		}
	];
</script>

<article class="flex flex-col items-center justify-center sm:items-start">
	<header class="mb-2 hidden sm:block">
		<PageTitle title={data?.title} class="mb-0 sm:mb-4 sm:flex" />
	</header>
	{#if data?.taxType === 'STCG'}
		<p
			class="sticky -top-2 z-100 -mt-2 ml-[calc(50%-50vw)] w-screen border-b border-grey-line bg-white px-4 py-3 text-xs text-black-key sm:relative sm:top-0 sm:ml-0 sm:w-full sm:rounded-lg sm:py-6"
		>
			Short Term Capital Gain for <span class="font-medium">Equity</span> (less than 1Y) and
			<span class="font-medium">Non Equity</span> (less than 3Y) funds are taxed differently on redeeming.
		</p>
	{:else}
		<p
			class="sticky -top-2 z-100 -mt-2 ml-[calc(50%-50vw)] w-screen border-b border-grey-line bg-white px-4 py-3 text-xs text-black-key sm:relative sm:top-0 sm:ml-0 sm:w-full sm:rounded-lg sm:py-6"
		>
			Long Term Capital Gain for <span class="font-medium">Equity</span> (less than 1Y) and
			<span class="font-medium">Non Equity</span> (less than 3Y) funds are taxed differently on redeeming.
		</p>
	{/if}
	<InvestmentTab {tabs} {activeTab} class="mt-2 !px-0 max-sm:ml-0" />
	{#await data?.api?.getTaxationDetails}
		<TableSkeleton />
	{:then taxationDetails}
		{#if taxationDetails.length}
			<TaxationTable {taxationDetails} class="bg-white px-4 pt-3" />
		{/if}
	{/await}
</article>
