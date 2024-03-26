<script lang="ts">
	import AoCard from '$components/AOCard/AOCard.svelte';
	import { onMount, tick } from 'svelte';
	import { getScreenerSearch } from '$lib/api/screenerSearch';
	import type { ScreenedSchemes } from '$lib/types/Screener';
	import ScreenerTable from './ScreenerTable.svelte';
	import { WMSIcon, Button } from 'svelte-components';
	import { base } from '$app/paths';
	import QuickFilter from './QuickFilter.svelte';
	import { topfilterClick, viewallfundsClick } from '$lib/analytics/filters/filters';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import SomethingWentWrongSmall from '$components/Error/SomethingWentWrongSmall.svelte';
	import { modifiedGoto } from '$lib/utils/goto';

	let screenedSchemes: ScreenedSchemes[];
	let loading = true;
	let dataFetchFailed = false;
	const navigateToFilters = async () => {
		topfilterClick({ source: 'Homepage' });
		await modifiedGoto(`${base}/filters`);
	};

	const navigateToFilteredItems = async (source?: 'Homepage' | 's_Eexploremutualfunds') => {
		if (source) {
			viewallfundsClick({
				source
			});
		}
		await modifiedGoto(`${base}/filters/items`);
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
				<Button variant="transparent" class="!h-0 !min-h-0 !pr-0" onClick={navigateToFilters}>
					<WMSIcon name="filter-square" fill="var(--PRIMARY)" />
				</Button>
			</div>
			<div slot="content" class="overflow-hidden">
				<section class="flex flex-col">
					<p class="mb-2 text-xs text-body">Select Quick Filters</p>
					<QuickFilter onQuickFilterSelect={navigateToFilteredItems} pageSource="Homepage" />
				</section>
				<section>
					{#if loading}
						<TableSkeleton rowLength={5} columnLength={2} />
					{:else}
						<ScreenerTable {screenedSchemes} pageSource="Homepage" />
					{/if}
				</section>
				<section class="flex flex-col items-center justify-center">
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
