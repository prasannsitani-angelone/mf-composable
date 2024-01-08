<script lang="ts">
	import AoCard from '$components/AOCard/AOCard.svelte';
	import { onMount, tick } from 'svelte';
	import { getScreenerSearch } from '$lib/api/screenerSearch';
	import type { ScreenedSchemes } from '$lib/types/Screener';
	import ScreenerTable from './ScreenerTable.svelte';
	import { WMSIcon, Button } from 'svelte-components';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import QuickFilter from './QuickFilter.svelte';
	import { topfilterClick, viewallfundsClick } from '$lib/analytics/filters/filters';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import SomethingWentWrongSmall from '$components/Error/SomethingWentWrongSmall.svelte';

	let screenedSchemes: ScreenedSchemes[];
	let loading = true;
	let dataFetchFailed = false;
	const navigateToFilters = async () => {
		topfilterClick({ source: 'Homepage' });
		await goto(`${base}/filters`);
	};

	const navigateToFilteredItems = async (source?: 'Homepage' | 's_Eexploremutualfunds') => {
		if (source) {
			viewallfundsClick({
				source
			});
		}
		await goto(`${base}/filters/items`);
	};

	onMount(async () => {
		await tick();
		const queryPath = `limit=5&schemeType=Growth`;
		screenedSchemes = await getScreenerSearch(null, queryPath);

		loading = false;
		dataFetchFailed = screenedSchemes instanceof Error;
	});
</script>

<section class={$$props.class}>
	{#if dataFetchFailed}
		<SomethingWentWrongSmall />
	{:else}
		<AoCard>
			<p slot="heading">Explore Mutual Funds</p>
			<div slot="right" class="ml-auto">
				<Button variant="transparent" class="!pr-0" onClick={navigateToFilters}>
					<WMSIcon name="filter-square" />
				</Button>
			</div>
			<div slot="content" class="overflow-hidden">
				<section class="flex flex-col">
					<p class="mb-2 text-xs text-black-bolder">Select Quick Filters</p>
					<QuickFilter onQuickFilterSelect={navigateToFilteredItems} pageSource="Homepage" />
				</section>
				<section>
					{#if loading}
						<TableSkeleton rowLength={5} columnLength={2} />
					{:else}
						<ScreenerTable {screenedSchemes} pageSource="Homepage" />
					{/if}
				</section>
				<section class="my-3 flex flex-col items-center justify-center">
					<p class="text-[10px] text-black-bolder">8,000+ funds are available on Angel One</p>
					<Button
						variant="transparent"
						class="!text-sm !uppercase"
						size="xs"
						on:click={() => {
							navigateToFilteredItems('Homepage');
						}}>View All Funds</Button
					>
				</section>
			</div>
		</AoCard>
	{/if}
</section>
