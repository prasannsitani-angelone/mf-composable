<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import FilterPageFooter from '$components/ScreenerFilter/FilterPageFooter.svelte';
	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';
	import type { FilterData, FilterOption } from '$lib/types/ScreenerFilters';
	import { onMount } from 'svelte';
	import FilterOptions from '$components/ScreenerFilter/FilterOptions.svelte';
	import {
		applyFiltersClickAnalytics,
		resetFiltersClickAnalytics,
		screenersFiltersPageImpression
	} from '$lib/analytics/filters/filters';
	import { getSelectedFilterData } from '$lib/utils/helpers/screenersFilters';

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	let currentFilterDataFromStore: FilterData = schemeScreenerStore?.getData();
	schemeScreenerStore.subscribe(() => {
		currentFilterDataFromStore = schemeScreenerStore.getData() || [];
	});

	let filterData: FilterData = schemeScreenerStore?.getData();
	let selectedParentFilterIndex = 0;
	let selectedParentFilterName: string =
		filterData?.filters[selectedParentFilterIndex]?.label || '';

	const resetSelectedAttributes = () => {
		selectedParentFilterIndex = 0;
		selectedParentFilterName = filterData?.filters[selectedParentFilterIndex]?.label || '';
	};

	$: appliedFilterCount = filterData?.partiallySelectedTopLevelNodes;

	const redirectToSchemeResults = () => {
		goto(`${base}/filters/items`, { replaceState: true });
	};

	const handleApplyFiltersClick = () => {
		schemeScreenerStore?.applyFilters(filterData);
		applyFiltersClickAnalytics(getSelectedFilterData(filterData?.filters));
		redirectToSchemeResults();
	};

	const handleResetFiltersClick = () => {
		schemeScreenerStore?.resetStore();
		resetFiltersClickAnalytics(getSelectedFilterData(filterData?.filters));
	};

	onMount(async () => {
		if (!isMobile && !isTablet) {
			goto(`${base}/filters/items`, { replaceState: true });
		} else {
			screenersFiltersPageImpression();
		}

		setTimeout(() => {
			resetSelectedAttributes();
		}, 100);

		await schemeScreenerStore.getFiltersResponse();
	});

	const handleParentFilterClick = (parentFilter: FilterOption, selectedIndex: number) => {
		selectedParentFilterIndex = selectedIndex;
		selectedParentFilterName = parentFilter?.label;
	};

	const updateFiltersDataFromStore = () => {
		filterData = schemeScreenerStore?.getData();
		appliedFilterCount = filterData?.partiallySelectedTopLevelNodes;
	};

	const handleOptionChange = (clickedFilterData) => {
		filterData = schemeScreenerStore?.updatetMultiFilter(
			filterData,
			clickedFilterData,
			!clickedFilterData?.selected
		);
	};

	const handleRangeChange = (rangeFilterData) => {
		filterData = schemeScreenerStore?.updateRangeFilter(
			filterData,
			rangeFilterData,
			rangeFilterData?.minSelectedVal,
			rangeFilterData?.maxSelectedVal,
			rangeFilterData?.mapItemIndex,
			rangeFilterData?.mapType
		);
	};

	$: currentFilterDataFromStore, updateFiltersDataFromStore();
</script>

<section class="-m-2 bg-background-alt" data-testid="schemeFilters">
	<div class="border-b px-3 py-4 text-xs font-normal text-title">
		Selected: {appliedFilterCount}
	</div>
	<section class="mb-[72px] flex">
		<!-- left column -->
		<section class="columnClass w-[35%] overflow-auto bg-background">
			{#each filterData?.filters || [] as filter, index}
				<div class="mb-3">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="mb-9 mt-6 px-3 text-xs font-normal text-body md:cursor-pointer {selectedParentFilterName ===
						filter?.label
							? 'border-r-2 border-primary'
							: ''}"
						on:click={() => handleParentFilterClick(filter, index)}
					>
						<span class={selectedParentFilterName === filter?.label ? 'text-primary' : ''}>
							{filter?.label}
						</span>
						{#if filter?.count}
							<div class="ml-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
						{/if}
					</div>
				</div>
			{/each}
		</section>

		<!-- right column -->
		<section class="columnClass mx-1 w-[65%] overflow-auto pb-3 pt-2">
			<FilterOptions
				selectedFilter={filterData?.filters[selectedParentFilterIndex]?.options}
				filterType={filterData?.filters[selectedParentFilterIndex]?.type}
				filterLabel={filterData?.filters[selectedParentFilterIndex]?.label}
				showSearch={filterData?.filters[selectedParentFilterIndex]?.search}
				sections={filterData?.filters[selectedParentFilterIndex]?.section || []}
				on:optionChange={(e) => handleOptionChange(e?.detail)}
				on:rangeChange={(e) => handleRangeChange(e?.detail)}
			/>
		</section>
	</section>

	<FilterPageFooter
		on:applyFiltersClick={handleApplyFiltersClick}
		on:resetFilterClick={handleResetFiltersClick}
		class="shadow-csm"
	/>
</section>

<style>
	.columnClass {
		height: calc(100vh - 177px);
	}
</style>
