<script lang="ts">
	import LinearVerticalChart from '$components/Charts/LinearVerticalChart.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getDisplayAmount } from '../utils';
	import type { SipCalcBarType } from './types';
	import { getCssVar } from '$lib/utils/colors';

	export let dataSet: [SipCalcBarType];
	export let selectedDataSet: SipCalcBarType | null;

	const dispatch = createEventDispatcher();

	function handleChartClick(item) {
		dispatch('handleChartClick', item);
	}
</script>

<div class="mx-3 flex flex-row justify-evenly {$$props.class}">
	{#each dataSet as item, index (index)}
		{@const total = item.investedAmount + item.gains}
		{@const investPercent = (item.investedAmount * 100) / total}
		{@const gainsPercent = (item.gains * 100) / total}
		{@const isSelected =
			!selectedDataSet?.durationInYears || item.durationInYears === selectedDataSet.durationInYears}
		{@const height = Math.floor(90 * (1 + index / 2))}
		<LinearVerticalChart
			class="mt-auto flex-1"
			style="height: {height}px; min-height: 8px"
			chartInput={[
				{
					color: isSelected ? getCssVar('--BUY') : getCssVar('--BORDER'),
					weightage: gainsPercent
				},
				{
					color: isSelected ? getCssVar('--TINT24-BUY') : getCssVar('--BACKGROUND'),
					weightage: investPercent
				}
			]}
			on:click={() => handleChartClick(item)}
		>
			<div class="mx-auto mb-2 w-fit text-xs font-normal text-title" slot="topLabel">
				₹{getDisplayAmount(total)}
			</div>
			<div class="mx-auto mt-2 w-fit text-xs font-normal text-body" slot="bottomLabel">
				{item.durationInYears}Y
			</div>
		</LinearVerticalChart>
	{/each}
</div>
