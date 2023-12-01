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
	let loading = true;
	let page = 0;
	let screenedSchemes: ScreenedSchemes[] = [];
	let newBatch: ScreenedSchemes[] = [];
	let scrollElement: HTMLElement | null = null;
	$: appliedFilterCount = $schemeScreenerStore?.data?.filtersCount;

	const navigateToFilters = async () => {
		await goto(`${base}/filters`, { replaceState: true });
	};

	const fetchScreenedData = async () => {
		const queryPath = `limit=25&offset=${page}&${$schemeScreenerStore?.data?.queryPath}`;
		newBatch = await getScreenerSearch(null, queryPath);
		loading = false;
	};

	const initializeData = () => {
		loading = true;
		screenedSchemes = [];
		page = 0;
		fetchScreenedData();
	};

	$: if ($schemeScreenerStore?.data?.queryPath) {
		initializeData();
	}

	onMount(async () => {
		await tick();
		scrollElement = document.getElementById('main-container');
		const urlSearchParam = $pageData?.url?.search;

		schemeScreenerStore.getFiltersResponse(urlSearchParam);
		initializeData();
	});

	$: screenedSchemes = [...screenedSchemes, ...newBatch];
</script>

<article class="mt-1">
	<section class="flex flex-col overflow-hidden bg-grey px-1">
		<p class="mb-2 text-xs text-black-bolder">Select Quick Filters</p>
		<QuickFilter />
	</section>
	{#if loading}
		<TableSkeleton />
	{:else}
		<section class="rounded bg-white px-4 py-3">
			<ScreenerTable {screenedSchemes} class="pb-14" />
			<InfiniteScroll
				threshold={400}
				elementScroll={scrollElement}
				on:loadMore={() => {
					page++;
					fetchScreenedData();
				}}
			/>
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
