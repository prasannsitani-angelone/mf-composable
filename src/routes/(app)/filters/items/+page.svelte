<script lang="ts">
	import { page } from '$app/stores';
	import ScreenerFilterList from '$components/Screener/ScreenerFilterList.svelte';
	import FilterOptions from '$components/ScreenerFilter/FilterOptions.svelte';
	import { exploreMFImpression } from '$lib/analytics/filters/filters';
	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';
	import type { FilterData } from '$lib/types/ScreenerFilters';
	import { debounce } from '$lib/utils/helpers/debounce';
	import { onMount, tick } from 'svelte';

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	let filterData: FilterData;

	$: filterData = $schemeScreenerStore?.data;

	onMount(async () => {
		await tick();
		const urlSearchParam = $page?.url?.search;
		await schemeScreenerStore.getFiltersResponse(urlSearchParam);
		exploreMFImpression();
	});

	const handleOptionChange = (clickedFilterData) => {
		filterData = schemeScreenerStore?.updatetMultiFilter(
			filterData,
			clickedFilterData,
			!clickedFilterData?.selected
		);
		schemeScreenerStore.applyFilters(filterData);
	};

	const handleRangeChange = debounce((rangeFilterData) => {
		filterData = schemeScreenerStore?.updateRangeFilter(
			filterData,
			rangeFilterData,
			rangeFilterData?.minSelectedVal,
			rangeFilterData?.maxSelectedVal,
			rangeFilterData?.mapItemIndex,
			rangeFilterData?.mapType
		);
		schemeScreenerStore.applyFilters(filterData);
	}, 300);

	const handleResetFiltersClick = () => {
		schemeScreenerStore.resetStore();
		schemeScreenerStore.getFiltersResponse();
	};
</script>

<article>
	{#if !(isMobile || isTablet)}
		<div class="overflow-hidden rounded-lg shadow-csm">
			<div class="flex flex-row items-center justify-between bg-background-alt px-6 py-5">
				<div class="text-base font-medium text-title">FILTERS</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="text-sm font-medium text-primary active:opacity-70"
					on:click={handleResetFiltersClick}
				>
					RESET
				</div>
			</div>
			<FilterOptions
				selectedFilter={filterData?.filters}
				filterType="outer"
				on:optionChange={(e) => handleOptionChange(e?.detail)}
				on:rangeChange={(e) => handleRangeChange(e?.detail)}
			/>
		</div>
	{/if}
</article>
<ScreenerFilterList />
