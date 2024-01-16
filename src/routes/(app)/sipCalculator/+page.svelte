<script lang="ts">
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { BtnVariant, Button, Card } from 'svelte-components';
	import RightChevron from './icons/RightChevron.svelte';
	import { debounce } from '$lib/utils/helpers/debounce';
	import CalculatorInputComponent from './components/CalculatorInputComponent.svelte';
	import LinearVerticalChart from '$components/Charts/LinearVerticalChart.svelte';
	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import { browser } from '$app/environment';
	import { getLumpSumReturns, getSipReturns } from './investmentCalculation';
	import { onMount } from 'svelte';
	import {
		sipCalculatorInvestButtonClickAnalytics,
		sipCalculatorReturnsSliderAnalytics,
		sipCalculatorScreenOpenAnalytics
	} from './analytics';

	let currentInvestmentMode: 'SIP' | 'OTI' = 'SIP';
	const updateSelectedInvestmentTypeChange = (investmentType: 'SIP' | 'OneTime') => {
		currentInvestmentMode = investmentType;
		performCalculation();
	};

	$: MinAmountSlider = currentInvestmentMode === 'SIP' ? 100 : 500;
	$: MaxAmountSlider = currentInvestmentMode === 'SIP' ? 10000 : 500000;
	$: amountSteps = currentInvestmentMode === 'SIP' ? 100 : 500;
	$: amountSlider = [currentInvestmentMode === 'SIP' ? 1000 : 5000];

	const MinRoiSlider = 1;
	const MaxRoiSlider = 40;
	$: roiSlider = [12];

	$: dataSet = [
		{
			durationInYears: 1,
			investedAmount: 0,
			gains: 0
		},
		{
			durationInYears: 3,
			investedAmount: 0,
			gains: 0
		},
		{
			durationInYears: 5,
			investedAmount: 0,
			gains: 0
		},
		{
			durationInYears: 10,
			investedAmount: 0,
			gains: 0
		},
		{
			durationInYears: 15,
			investedAmount: 0,
			gains: 0
		},
		{
			durationInYears: 20,
			investedAmount: 0,
			gains: 0
		}
	];

	$: maxData = [...dataSet].sort(
		(a, b) => b.gains + b.investedAmount - (a.gains + a.investedAmount)
	)[0];

	$: selectedDataSet = {
		durationInYears: null,
		investedAmount: 0,
		gains: 0
	};

	$: amountSlider, performCalculation(), investInputChangeAnalyticEvent();
	$: roiSlider, performCalculation(), investInputChangeAnalyticEvent();

	const performCalculation = () => {
		const investedAmount = amountSlider[0];
		const CAGR = roiSlider[0];

		dataSet = dataSet.map((it) => {
			const selectedYear = it.durationInYears;

			let investmentReturns;
			if (currentInvestmentMode === 'SIP') {
				investmentReturns = getSipReturns(investedAmount, selectedYear, CAGR);
			} else {
				investmentReturns = getLumpSumReturns(investedAmount, selectedYear, CAGR);
			}

			it.investedAmount = investmentReturns.totalInvestment;
			it.gains = investmentReturns.capitalGain;
			return it;
		});

		dataSet.forEach((it) => {
			if (selectedDataSet.durationInYears === it.durationInYears) {
				selectedDataSet = it;
			}
		});
	};

	const getDisplayAmount = (amount: number) => {
		if (amount > 1000000000) {
			return (amount / 1000000000).toFixed(1) + 'Bn';
		}
		if (amount > 10000000) {
			return (amount / 10000000).toFixed(1) + 'Cr';
		}
		if (amount > 100000) {
			return (amount / 100000).toFixed(1) + 'L';
		}
		if (amount > 1000) {
			return (amount / 1000).toFixed(1) + 'K';
		}
		return amount;
	};

	const getExploreFundsPath = async () => {
		const investmentType = currentInvestmentMode;
		const returnRangeStart = Math.max(roiSlider[0] - 2, 0);
		const returnRangeEnd = Math.min(roiSlider[0] + 3, MaxRoiSlider);
		await schemeScreenerStore?.getFiltersResponse(
			`investmentType=${investmentType}&schemeType=Growth&threeYearReturn=${returnRangeStart}_${returnRangeEnd}`
		);
		await goto(`${base}/filters/items`);

		sipCalculatorInvestButtonClickAnalytics({
			InvType: currentInvestmentMode,
			amount: amountSlider[0],
			returnabs: roiSlider[0],
			appliedrange: `${returnRangeStart}% to ${returnRangeEnd}%`
		});
	};

	const handleChartClick = (clickedBar) => {
		if (clickedBar.durationInYears !== selectedDataSet.durationInYears) {
			selectedDataSet = clickedBar;
		} else {
			selectedDataSet = {
				durationInYears: null,
				investedAmount: 0,
				gains: 0
			};
		}
	};

	onMount(() => {
		performCalculation();
		sipCalculatorScreenOpenAnalytics({
			InvType: currentInvestmentMode,
			amount: amountSlider[0],
			returnabs: roiSlider[0],
			totalvalue: maxData?.investedAmount + maxData?.gains,
			investedvalue: maxData?.investedAmount
		});
	});

	const investInputChangeAnalyticEvent = debounce(() => {
		sipCalculatorReturnsSliderAnalytics({
			InvType: currentInvestmentMode,
			amount: amountSlider[0],
			returnabs: roiSlider[0],
			totalvalue: maxData?.investedAmount + maxData?.gains,
			investedvalue: maxData?.investedAmount
		});
	}, 1000);
</script>

<section class="col-span-1 col-start-1 row-start-2">
	<Card class="mb-6 bg-white px-4 max-sm:rounded-none max-sm:border-b max-sm:shadow-none">
		<header class="hidden flex-row items-center sm:flex">
			<Button size="xs" onClick={() => history.back()} variant="transparent" class="!p-0">
				<LeftArrowIcon class="mr-4 cursor-pointer" />
			</Button>
			<div class="h-max text-center text-lg font-medium text-black">Calculate Returns</div>
		</header>
		<div
			class="mb-6 flex w-full flex-col items-center justify-start gap-3 rounded-lg bg-opacity-60 bg-gradient-to-r from-[#E8EBFA] to-[#94A7FF] py-4 shadow"
		>
			<div class="flex flex-col items-center justify-start gap-1 self-stretch">
				<div class="flex items-center justify-center gap-2.5 self-stretch px-4">
					<div class="shrink grow basis-0 text-xs font-normal leading-tight text-black-bolder">
						Total Value
					</div>
				</div>
				<div class="flex items-center justify-center gap-2.5 self-stretch px-4">
					<div class="shrink grow basis-0 text-xl font-medium text-black-key">
						₹{addCommasToAmountString(maxData?.investedAmount + maxData?.gains)}
					</div>
				</div>
			</div>
			<div class="flex items-center justify-center gap-2.5 self-stretch px-4">
				<div class="shrink grow basis-0 text-xs font-normal leading-tight text-black-bolder">
					When you invest ₹{addCommasToAmountString(maxData?.investedAmount)}
					over {maxData?.durationInYears} years
				</div>
			</div>
		</div>

		<div class="inline-flex w-full flex-col items-start justify-start gap-2 sm:flex-row sm:gap-8">
			<div class="inline-flex items-center justify-start gap-2 sm:min-w-[130px]">
				<div class="h-2 w-3.5 rounded bg-[#008F75]" />
				<div class="text-xs font-normal text-black-bolder">
					Investment - ₹{getDisplayAmount(selectedDataSet.investedAmount || maxData.investedAmount)}
				</div>
			</div>
			<div class="inline-flex items-center justify-start gap-2 sm:min-w-[130px]">
				<div class="h-2 w-3.5 rounded bg-[#C2E4DE]" />
				<div class="text-xs font-normal text-black-bolder">
					Gains - ₹{getDisplayAmount(selectedDataSet.gains || maxData.gains)}
				</div>
			</div>
		</div>

		<div class="mx-3 mb-6 flex flex-row justify-evenly sm:mx-6 {browser ? 'visible' : 'invisible'}">
			{#each dataSet as item, index (index)}
				{@const total = item.investedAmount + item.gains}
				{@const investPercent = (item.investedAmount * 100) / total}
				{@const gainsPercent = (item.gains * 100) / total}
				{@const isSelected =
					!selectedDataSet.durationInYears ||
					item.durationInYears === selectedDataSet.durationInYears}
				{@const height = Math.floor(90 * (1 + index / 2))}
				<LinearVerticalChart
					class="mt-auto flex-1"
					style="height: {height}px; min-height: 8px"
					chartInput={[
						{
							color: isSelected ? '#008F75' : '#E8EBF1',
							weightage: investPercent
						},
						{
							color: isSelected ? '#C2E4DE' : '#F4F6FB',
							weightage: gainsPercent
						}
					]}
					on:click={() => handleChartClick(item)}
				>
					<div class="mx-auto mb-2 w-fit text-xs font-normal text-black-key" slot="topLabel">
						₹{getDisplayAmount(total)}
					</div>
					<div class="mx-auto mt-2 w-fit text-xs font-normal text-black-bolder" slot="bottomLabel">
						{item.durationInYears}Y
					</div>
				</LinearVerticalChart>
			{/each}
		</div>

		<CalculatorInputComponent
			bind:amountSlider
			bind:roiSlider
			{MaxRoiSlider}
			{MinRoiSlider}
			{MinAmountSlider}
			{MaxAmountSlider}
			steps={amountSteps}
			class="block sm:hidden"
			bind:selectedInvestmentType={currentInvestmentMode}
			on:investmentTypeChange={(e) => updateSelectedInvestmentTypeChange(e?.detail)}
		/>
	</Card>
</section>
<section class="col-span-1 col-start-1 row-start-3 max-sm:mb-16 sm:col-start-2 sm:row-start-2">
	<Card
		class="inset-x-0 bottom-0 !m-0  block bg-white !p-0 max-sm:fixed max-sm:rounded-none max-sm:p-2 max-sm:pt-2 max-sm:shadow-none"
	>
		<CalculatorInputComponent
			class="hidden px-4 pt-5 sm:block"
			bind:amountSlider
			bind:roiSlider
			{MaxRoiSlider}
			{MinRoiSlider}
			{MinAmountSlider}
			{MaxAmountSlider}
			steps={amountSteps}
			bind:selectedInvestmentType={currentInvestmentMode}
			on:investmentTypeChange={(e) => updateSelectedInvestmentTypeChange(e?.detail)}
		/>

		<div class="border-t p-2">
			<Button
				on:click={getExploreFundsPath}
				endAdornment={RightChevron}
				variant={BtnVariant.Transparent}
				class="w-full bg-white !px-0 text-center text-sm font-medium uppercase text-blue-primary"
			>
				FIND MUTUAL FUNDS
			</Button>
		</div>
	</Card>
</section>
