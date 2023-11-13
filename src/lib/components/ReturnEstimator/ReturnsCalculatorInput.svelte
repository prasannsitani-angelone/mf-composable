<script lang="ts">
	import AmountText from '$lib/components/AmountText.svelte';
	import Slider from '@bulatdashiev/svelte-slider';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import InvestmentTypeRadioSelection from './InvestmentTypeRadioSelection.svelte';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { createEventDispatcher } from 'svelte';
	import { debounce } from '$lib/utils/helpers/debounce';

	export let returns3yr = 0;
	export let returns5yr = 0;
	export let categoryName = '';
	export let minSipAmount = 100;
	export let minLumpsumAmount = 500;
	export let outputValues: CalculatedValue = {};

	interface durationButtonsType {
		title: string;
		value: number;
	}

	const durationButtons: durationButtonsType[] = [
		{
			title: '1 Year',
			value: 1
		},
		{
			title: '3 Years',
			value: 3
		},
		{
			title: '5 Years',
			value: 5
		},
		{
			title: '10 Years',
			value: 10
		}
	];

	const dispatch = createEventDispatcher();

	let currentCalculatorMode = 'SIP';
	let duration = 3;
	let returnsTitleBasedOnDuration = `FUND'S ANNUAL RETURN`;

	const fallbackReturnPercentage = categoryName?.toLocaleLowerCase() === 'equity' ? 12 : 7;

	const updateSelectedInvestmentTypeChange = (investmentType: 'SIP' | 'OneTime') => {
		currentCalculatorMode = investmentType;
	};

	const updateDuration = (selectedValue: number) => {
		if (duration !== selectedValue) {
			duration = selectedValue;
		}
		returnsPercentage = getReturnsPercentage();

		setTimeout(() => {
			dispatch('durationSelectionChanged');
		});
	};

	const onAmountChange = () => {
		setTimeout(() => {
			dispatch('amountSelectionChange');
		});
	};

	const getReturnsPercentage = () => {
		if (duration < 5) {
			if (returns3yr > 0) {
				returnsTitleBasedOnDuration = `FUND'S 3Y ANNUAL RETURN`;
				return returns3yr;
			} else {
				returnsTitleBasedOnDuration = 'AVERAGE EQUITY RETURNS';
				return fallbackReturnPercentage;
			}
		} else if (duration >= 5) {
			if (returns5yr > 0) {
				returnsTitleBasedOnDuration = `FUND'S 5Y ANNUAL RETURN`;
				return returns5yr;
			} else {
				returnsTitleBasedOnDuration = 'AVERAGE NON-EQUITY RETURNS';
				return fallbackReturnPercentage;
			}
		} else {
			return fallbackReturnPercentage;
		}
	};

	$: returnsPercentage = getReturnsPercentage();

	$: maxAmountSlider = currentCalculatorMode === 'SIP' ? 10_000 : 5_00_000;
	$: minAmountSlider =
		currentCalculatorMode === 'SIP' ? Math.max(100, minSipAmount) : Math.max(500, minLumpsumAmount);
	$: amountReturnSlider =
		currentCalculatorMode === 'SIP'
			? [minAmountSlider, maxAmountSlider]
			: [Math.max(500, minLumpsumAmount), maxAmountSlider];
	$: amountSliderSteps = currentCalculatorMode === 'SIP' ? 100 : 500;
	$: amountReturnSlider, onAmountChange();

	$: capitalGain = 0;
	$: totalInvestment = 0;
	$: gainLossPercentage = 0;

	$: matuarityAmount = function calculateReturn() {
		const selectedYear = duration;
		const investedAmount = amountReturnSlider[0];

		const CAGR = returnsPercentage;
		const effectiveCAGR = CAGR?.toFixed(2) / 100 / 12;
		const totalMonths = selectedYear * 12;
		let totalProfit = 0;

		if (currentCalculatorMode === 'SIP') {
			totalProfit =
				investedAmount *
				(((Math.pow(1 + effectiveCAGR, totalMonths) - 1) / effectiveCAGR) * (1 + effectiveCAGR));
			totalInvestment = investedAmount * totalMonths;
		} else {
			totalProfit = investedAmount * Math.pow(1 + CAGR / 100, selectedYear);
			totalInvestment = investedAmount;
		}

		capitalGain = Math.floor(totalProfit - totalInvestment);

		gainLossPercentage = (capitalGain / totalInvestment) * 100;

		outputValues = {
			matuarityAmount: Math.floor(totalProfit) || 0,
			totalInvestment: totalInvestment,
			investedAmount: investedAmount,
			selectedYear: selectedYear,
			gainLossPercentage: gainLossPercentage,
			capitalGain: capitalGain,
			currentCalculatorMode: currentCalculatorMode,
			selectedReturn: CAGR
		};

		return Math.floor(totalProfit) || 0;
	};

	const amountSliderChange = debounce(() => {
		dispatch('amountSliderChange');
	}, 500);

	const handleAmountSliderInput = () => {
		amountSliderChange();
	};
</script>

<article class="bgv mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm md:mt-8 {$$props.class || ''}">
	<section class="origin-top">
		<InvestmentTypeRadioSelection
			selectedInvestmentType={currentCalculatorMode}
			on:investmentTypeChange={(e) => updateSelectedInvestmentTypeChange(e?.detail)}
		/>

		<section class="mt-4 md:mt-6">
			<div class="text-xs font-normal text-grey-body">
				{currentCalculatorMode === 'SIP' ? 'Choose SIP Amount' : 'Choose One Time Amount'}
			</div>
			<div class="slider -ml-2 mt-2 flex items-center">
				<Slider
					bind:value={amountReturnSlider}
					class="h-[60px]"
					min={minAmountSlider}
					max={maxAmountSlider}
					step={amountSliderSteps}
					on
					on:input={handleAmountSliderInput}
				>
					<div
						class="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-blue-primary bg-white shadow-csm md:cursor-pointer"
					>
						<div class="h-3 w-3 rounded-full bg-blue-primary" />
					</div>
				</Slider>
				<div
					class="min-w-28 max-w-28 my-auto ml-3 w-28 rounded-md border border-blue-primary p-2.5 text-center text-sm font-medium text-black-title"
				>
					<AmountText amount={amountReturnSlider[0]} />
				</div>
			</div>
		</section>

		<section class="flex flex-col justify-between md:flex-row md:items-end">
			<section class="mt-4">
				<div class="text-xs font-normal text-grey-body">Select Duration</div>

				<section class="mt-3 flex items-center justify-start">
					{#each durationButtons as durationButton, index (durationButton.value)}
						<ButtonMedium
							onClick={() => {
								updateDuration(durationButton?.value);
							}}
							class="!h-fit !min-h-fit !border-grey-line px-3 py-2 text-xs font-medium !capitalize md:px-4 md:py-3 {duration ===
							durationButton.value
								? ''
								: '!text-grey-body'} {index > 0 ? 'ml-2' : ''}"
							variant={duration === durationButton.value ? 'contained' : 'outlined'}
						>
							{durationButton?.title}
						</ButtonMedium>
					{/each}
				</section>
			</section>

			<section class="mt-6 flex items-center justify-between md:mt-0">
				<article class="flex flex-col font-normal">
					<div class="text-xs text-grey-body">Expected Returns</div>

					<div class="mt-1 text-[11px] uppercase text-black-bolder">
						{returnsTitleBasedOnDuration}
					</div>
				</article>

				<article class="md:ml-8">
					<div class="text-base font-medium text-black-title">
						{returnsPercentage?.toFixed(2)}% p.a.
					</div>
				</article>
			</section>
		</section>
	</section>

	<div class="hidden">{matuarityAmount()}</div>
</article>

<style>
	.slider {
		--progress-bg: #3f5bd9;
		--track-bg: #f4f6fb;
	}
</style>
