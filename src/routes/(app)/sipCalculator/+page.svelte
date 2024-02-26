<script lang="ts">
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { BtnVariant, Button, Card } from 'svelte-components';
	import RightChevron from './icons/RightChevron.svelte';
	import { debounce } from '$lib/utils/helpers/debounce';
	import CalculatorInputComponent from './components/CalculatorInputComponent.svelte';
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
	import { linearInterpolator } from './utils';
	import Background from './icons/Background.svelte';
	import BarChartGraphComponent from './components/BarChartGraphComponent.svelte';
	import type { SipCalcBarType } from './components/types';

	let currentInvestmentMode: 'SIP' | 'OTI' = 'SIP';
	const updateSelectedInvestmentTypeChange = (investmentType: 'SIP' | 'OneTime') => {
		currentInvestmentMode = investmentType;
		selectedDataSet = {
			durationInYears: null,
			investedAmount: 0,
			gains: 0
		};
		performCalculation();
	};

	$: MinAmountSlider = currentInvestmentMode === 'SIP' ? 100 : 500;
	$: MaxAmountSlider = currentInvestmentMode === 'SIP' ? 10000 : 500000;
	$: amountSteps = currentInvestmentMode === 'SIP' ? 100 : 500;
	const amountInitialValue = currentInvestmentMode === 'SIP' ? 1000 : 5000;
	$: amountSlider = [MinAmountSlider];

	const MinRoiSlider = 1;
	const MaxRoiSlider = 40;
	const roiInitialValue = 12;
	$: roiSlider = [MinRoiSlider];

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

	let maxData: {
		durationInYears: number;
		investedAmount: number;
		gains: number;
	};

	let selectedDataSet: SipCalcBarType = {
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
		maxData = dataSet[dataSet.length - 1];
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
		const investmentType = currentInvestmentMode === 'SIP' ? 'SIP' : 'OTI';
		const returnRangeStart = Math.max(roiSlider[0] - 2, 0);
		const returnRangeEnd = roiSlider[0] + 3;
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

		linearInterpolator(MinAmountSlider, amountInitialValue, 500, 0, (progress) => {
			amountSlider = [progress];
		});
		linearInterpolator(MinRoiSlider, roiInitialValue, 500, 0, (progress) => {
			roiSlider = [progress];
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

<svelte:head>
	<meta name="robots" content="noindex, follow" />
</svelte:head>
<section class="col-span-1 col-start-1 row-start-2">
	<Card
		class="mb-6 bg-background-alt px-4 max-sm:rounded-none max-sm:border-b max-sm:border-border max-sm:shadow-none"
	>
		<header class="hidden flex-row items-center sm:flex">
			<Button size="xs" onClick={() => history.back()} variant="transparent" class="!p-0">
				<LeftArrowIcon class="mr-4 cursor-pointer" />
			</Button>
			<div class="h-max text-center text-lg font-medium text-title">Calculate Returns</div>
		</header>

		<div class="light relative mb-6 overflow-hidden rounded-lg">
			<Background class="absolute h-full w-full bg-background-alt" />

			<div
				class="flex h-full w-full flex-col items-center justify-center gap-3 px-1 py-4 opacity-[.99] sm:py-8"
			>
				<div class="flex flex-col items-center justify-start gap-1 self-stretch">
					<div class="flex items-center justify-center gap-2.5 self-stretch px-4">
						<div class="shrink grow basis-0 text-xs font-normal leading-tight text-body">
							<span>
								{#if currentInvestmentMode === 'SIP'}
									Total Value
								{:else}
									Total Value in {maxData?.durationInYears} Years
								{/if}
							</span>
						</div>
					</div>
					<div class="flex items-center justify-center gap-2.5 self-stretch px-4">
						<div class="shrink grow basis-0 text-xl font-medium text-title">
							₹{addCommasToAmountString(maxData?.investedAmount + maxData?.gains)}
						</div>
					</div>
				</div>
				<div class="flex items-center justify-center gap-2.5 self-stretch px-4">
					<div class="shrink grow basis-0 text-xs font-normal leading-tight text-body">
						When you invest ₹{addCommasToAmountString(maxData?.investedAmount)}
						<span>
							{#if currentInvestmentMode === 'SIP'}
								over {maxData?.durationInYears} years
							{:else}
								once
							{/if}
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class="inline-flex w-full flex-col items-start justify-start gap-2 sm:flex-row sm:gap-8">
			<div class="inline-flex items-center justify-start gap-2 sm:min-w-[130px]">
				<div class="h-2 w-3.5 rounded bg-[#C2E4DE]" />
				<div class="text-xs font-normal text-body">
					Investment - ₹{getDisplayAmount(selectedDataSet.investedAmount || maxData.investedAmount)}
				</div>
			</div>
			<div class="inline-flex items-center justify-start gap-2 sm:min-w-[130px]">
				<div class="h-2 w-3.5 rounded bg-[#008F75]" />
				<div class="text-xs font-normal text-body">
					Gains - ₹{getDisplayAmount(selectedDataSet.gains || maxData.gains)}
				</div>
			</div>
		</div>

		<BarChartGraphComponent
			on:handleChartClick={(e) => handleChartClick(e.detail)}
			class="sm:mx-6 {browser ? 'visible' : 'invisible'}"
			bind:dataSet
			bind:selectedDataSet
		/>

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
		class="inset-x-0 bottom-0 !m-0  block bg-background-alt !p-0 max-sm:fixed max-sm:rounded-none max-sm:p-2 max-sm:pt-2 max-sm:shadow-none"
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
				class="w-full bg-background-alt !px-0 text-center text-sm font-medium uppercase text-primary"
			>
				FIND MUTUAL FUNDS
			</Button>
		</div>
	</Card>
</section>
