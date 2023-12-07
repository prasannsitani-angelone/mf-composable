<script lang="ts">
	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';
	import type { ScreenedSchemes } from '$lib/types/Screener';
	import { onMount, tick } from 'svelte';
	import { getScreenerSearch } from '$lib/api/screenerSearch';
	import ScreenerTable from './ScreenerTable.svelte';
	import { Button, WMSIcon } from 'svelte-components';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import QuickFilter from './QuickFilter.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import InfiniteScroll from '$components/InfiniteScroll.svelte';
	import { page as pageData } from '$app/stores';
	import NoFilterResult from '$lib/images/NoFilterResult.svg';
	import { bottomFilterClick } from '$lib/analytics/filters/filters';

	let loading = true;
	let page = 0;
	let limit = 25;
	let screenedSchemes: ScreenedSchemes[] = [];
	let newBatch: ScreenedSchemes[] = [];
	let scrollElement: HTMLElement | null = null;
	$: appliedFilterCount = $schemeScreenerStore?.data?.filtersCount;

	const navigateToFilters = async () => {
		bottomFilterClick();
		await goto(`${base}/filters`, { replaceState: true });
	};

	const fetchScreenedData = async () => {
		const queryPath = `limit=${limit}&offset=${page * limit}&${
			$schemeScreenerStore?.data?.queryPath
		}`;

		newBatch = await getScreenerSearch(null, queryPath);
		screenedSchemes = [...screenedSchemes, ...newBatch];

		loading = false;
	};

	const initializeData = async () => {
		loading = true;
		screenedSchemes = [];
		page = 0;
		await fetchScreenedData();
	};

	$: if ($schemeScreenerStore?.data?.queryPath || $schemeScreenerStore?.data?.queryPath === '') {
		initializeData();
	}

	onMount(async () => {
		await tick();
		scrollElement = document.getElementById('main-container');
		const urlSearchParam = $pageData?.url?.search;
		schemeScreenerStore.getFiltersResponse(urlSearchParam);
	});

	$: screenedSchemes = [];
</script>

<article class="mt-1 pb-14">
	<section class="flex flex-col overflow-hidden bg-grey px-1">
		<p class="mb-2 text-xs text-black-bolder">Select Quick Filters</p>
		<QuickFilter pageSource="s_Eexploremutualfunds" />
	</section>
	{#if loading}
		<TableSkeleton rowLength={5} columnLength={2} />
	{:else if screenedSchemes.length}
		<section class="rounded bg-white px-4 py-3">
			<ScreenerTable {screenedSchemes} pageSource="s_Eexploremutualfunds" />
			<InfiniteScroll
				threshold={400}
				hasMore={newBatch.length > 0}
				elementScroll={scrollElement}
				on:loadMore={() => {
					page++;
					fetchScreenedData();
				}}
			/>
		</section>
	{:else}
		<section class="flex w-full flex-col items-center justify-center rounded bg-white py-3">
			<img src={NoFilterResult} width="60" height="60" loading="lazy" alt="No scheme found" />
			<div class="mt-3 w-64 text-center text-xs text-black-bolder">
				No mutual funds found for selected filters. Please change filters or use quick filters
			</div>
		</section>
	{/if}
	<section
		class="fixed bottom-0 flex w-full items-center justify-center bg-white px-4 py-2 shadow-top sm:hidden"
	>
		<Button variant="transparent" on:click={navigateToFilters}>
			<WMSIcon name="filter-square" class="mr-1" />
			<p class="ml-1 uppercase text-blue-primary">Filter</p>
			{#if appliedFilterCount > 0}
				<p class="ml-1 rounded-full bg-red-errorDark px-[6px] pt-[2px] text-white">
					{appliedFilterCount}
				</p>
			{/if}
		</Button>
	</section>
</article>
