<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { FilterOption } from '$lib/types/ScreenerFilters';
	import Slider from '@bulatdashiev/svelte-slider';
	import { createEventDispatcher } from 'svelte';

	export let filter: FilterOption;

	const dispatch = createEventDispatcher();

	let rangeSelection = [filter?.minSelectedVal, filter?.maxSelectedVal];

	const updateRangeSelection = () => {
		if (
			rangeSelection[0] !== filter?.minSelectedVal ||
			rangeSelection[1] !== filter?.maxSelectedVal
		) {
			rangeSelection = [filter?.minSelectedVal, filter?.maxSelectedVal];
		}
	};

	$: filter, updateRangeSelection();

	const onRangeSelection = () => {
		if (
			rangeSelection[0] !== filter?.minSelectedVal ||
			rangeSelection[1] !== filter?.maxSelectedVal
		) {
			const filterObj = filter;
			filterObj.minSelectedVal = rangeSelection[0];
			filterObj.maxSelectedVal = rangeSelection[1];
			dispatch('rangeChange', filterObj);
		}
	};

	const onMappedItemClick = (mapItem, index) => {
		const filterObj = { ...filter };
		filterObj.minSelectedVal = mapItem.min;
		filterObj.maxSelectedVal = mapItem.max;
		filterObj.mapItemIndex = index;
		filterObj.mapType = 'buttons';
		dispatch('rangeChange', filterObj);
	};

	$: rangeSelection, onRangeSelection();
</script>

<article>
	<div class="mt-1 text-xs font-normal text-black-bolder">Select Range</div>
	<div class="mt-2 text-sm font-medium text-black-key">
		{rangeSelection[0]}% - {rangeSelection[1]}%
	</div>
	<div class="slider mt-6">
		<Slider bind:value={rangeSelection} min={filter?.min} max={filter?.max} step={1} range order>
			<div
				class="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-blue-primary bg-white shadow-csm md:cursor-pointer"
			>
				<div class="h-3 w-3 rounded-full bg-blue-primary" />
			</div>
		</Slider>
	</div>
	{#if filter?.mapItems && filter.mapItems.length > 0 && filter.mapItems[0].type === 'buttons'}
		<div class="mt-5 flex flex-wrap gap-2">
			{#each filter.mapItems[0].items as mapItem, index (index)}
				<Button
					variant={mapItem.selected ? 'contained' : 'outlined'}
					class="!min-h-6 !h-6 !px-2"
					onClick={() => onMappedItemClick(mapItem, index)}>{mapItem.label}</Button
				>
			{/each}
		</div>
	{/if}
</article>

<style>
	.slider {
		--progress-bg: #3f5bd9;
		--track-bg: #e6ebfe;
	}
</style>
