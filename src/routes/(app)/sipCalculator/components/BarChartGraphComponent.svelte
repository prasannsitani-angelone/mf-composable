<script lang="ts">
	import LinearVerticalChart from '$components/Charts/LinearVerticalChart.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { SipCalcBarType } from './types';
	import { getCssVar } from '$lib/utils/colors';
	import { getDisplayAmount } from '../utils';

	export let dataSet: [SipCalcBarType];
	export let selectedDataSet: SipCalcBarType | null;
	export let currentInvestmentMode = 'SIP';

	const dispatch = createEventDispatcher();

	const handleChartClick = (item: SipCalcBarType) => {
		dispatch('handleChartClick', item);
	};

	const maxHeightInPixel = 275;
	$: minData = dataSet[0];
	$: maxData = dataSet[dataSet.length - 1];

	// This function calculates the total height for a component based on the input `item` of type `SipCalcBarType`.
	// The height is determined by adding the calculated invested height and gains height.
	// For SIP only
	const getHeightForComponent = (item: SipCalcBarType) => {
		let investedHeight = 0;
		let gainsHeight = 0;
		if (item === minData) {
			investedHeight = item.investedAmount / item.durationInYears;
		} else {
			investedHeight = minData.investedAmount * (1 + item.durationInYears / 10);
		}
		gainsHeight = (item.gains / item.durationInYears) * 2;
		return investedHeight + gainsHeight;
	};

	const getDisplayHeight = (item: SipCalcBarType) => {
		if (currentInvestmentMode === 'SIP') {
			return (getHeightForComponent(item) / getHeightForComponent(maxData)) * maxHeightInPixel;
		} else {
			return (
				((item.investedAmount + item.gains) / (maxData.investedAmount + maxData.gains)) *
				maxHeightInPixel
			);
		}
	};
</script>

<div class="mx-3 flex flex-row justify-evenly {$$props.class}">
	{#each dataSet as item, index (index)}
		{@const total = item.investedAmount + item.gains}
		{@const investPercent = (item.investedAmount * 100) / total}
		{@const gainsPercent = (item.gains * 100) / total}
		{@const isSelected =
			!selectedDataSet?.durationInYears || item.durationInYears === selectedDataSet.durationInYears}
		{@const height = Math.trunc(getDisplayHeight(item))}

		<LinearVerticalChart
			class="mt-auto flex-1"
			style="height: {height + 48}px; min-height: 8px"
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
