<script lang="ts">
	import AmountText from '$lib/components/AmountText.svelte';
	import Slider from '@bulatdashiev/svelte-slider';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import InvestmentTypeRadioSelection from './InvestmentTypeRadioSelection.svelte';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { createEventDispatcher } from 'svelte';
	import { debounce } from '$lib/utils/helpers/debounce';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { allDurationTags } from '$lib/constants/tags';
	import { BtnVariant } from 'svelte-components';
	import type { Tags } from '$lib/types/ITags';

	const dispatch = createEventDispatcher();

	let schemeDetails: SchemeDetails;
	let outputValues: CalculatedValue = {};

	let currentCalculatorMode = 'SIP';
	let filteredDurations: Tags[] = allDurationTags;
	let selectedDuration = filteredDurations[5];
	let isDefaultReturn = false;
	const minLumpsumAmount = schemeDetails?.minLumpsumAmount || 500;
	const fallbackReturnPercentage =
		(schemeDetails?.categoryName || '')?.toLocaleLowerCase() === 'equity' ? 12 : 7;

	const getFilteredDurations = () => {
		if (schemeDetails?.returns10yr > 0) {
			filteredDurations = allDurationTags?.filter(
				(duration) =>
					duration?.months === 12 ||
					duration?.months === 36 ||
					duration?.months === 60 ||
					duration?.months === 120
			);
			selectedDuration = filteredDurations[1];
		} else if (schemeDetails?.returns5yr > 0) {
			filteredDurations = allDurationTags?.filter(
				(duration) =>
					duration?.months === 6 ||
					duration?.months === 12 ||
					duration?.months === 36 ||
					duration?.months === 60
			);
			selectedDuration = filteredDurations[2];
		} else if (schemeDetails?.returns3yr > 0) {
			filteredDurations = allDurationTags?.filter(
				(duration) =>
					duration?.months === 3 ||
					duration?.months === 6 ||
					duration?.months === 12 ||
					duration?.months === 36
			);
			selectedDuration = filteredDurations[3];
		} else if (schemeDetails?.returns2yr > 0) {
			filteredDurations = allDurationTags?.filter(
				(duration) =>
					duration?.months === 3 ||
					duration?.months === 6 ||
					duration?.months === 12 ||
					duration?.months === 24
			);
			selectedDuration = filteredDurations[2];
		} else {
			filteredDurations = allDurationTags?.filter(
				(duration) =>
					duration?.months === 6 ||
					duration?.months === 12 ||
					duration?.months === 36 ||
					duration?.months === 60
			);
			selectedDuration = filteredDurations[1];
		}
	};

	getFilteredDurations();
	const updateSelectedInvestmentTypeChange = (investmentType: 'SIP' | 'OneTime') => {
		currentCalculatorMode = investmentType;
	};

	const updateDuration = (selectedValue: Tags) => {
		if (selectedDuration?.months !== selectedValue?.months) {
			selectedDuration = selectedValue;
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
		if (schemeDetails[selectedDuration?.returnPeriod] > 0) {
			isDefaultReturn = false;
			return schemeDetails[selectedDuration?.returnPeriod];
		} else {
			isDefaultReturn = true;
			return fallbackReturnPercentage;
		}
	};

	$: returnsPercentage = getReturnsPercentage();

	$: maxAmountSlider = currentCalculatorMode === 'SIP' ? 10_000 : 5_00_000;
	$: minAmountSlider =
		currentCalculatorMode === 'SIP'
			? Math.max(100, schemeDetails?.minSipAmount || 100)
			: Math.max(500, schemeDetails?.minLumpsumAmount || 500);
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
		const investedAmount = amountReturnSlider[0];

		const CAGR = returnsPercentage;
		const effectiveCAGR = CAGR?.toFixed(2) / 100 / 12;
		const totalMonths = selectedDuration?.months;
		let totalProfit = 0;

		if (currentCalculatorMode === 'SIP') {
			totalProfit =
				investedAmount *
				(((Math.pow(1 + effectiveCAGR, totalMonths) - 1) / effectiveCAGR) * (1 + effectiveCAGR));
			totalInvestment = investedAmount * totalMonths;
		} else {
			totalProfit = investedAmount * Math.pow(1 + CAGR / 100, selectedDuration?.months / 12);
			totalInvestment = investedAmount;
		}

		capitalGain = Math.floor(totalProfit - totalInvestment);

		gainLossPercentage = (capitalGain / totalInvestment) * 100;

		outputValues = {
			matuarityAmount: Math.floor(totalProfit) || 0,
			totalInvestment: totalInvestment,
			investedAmount: investedAmount,
			selectedDuration,
			gainLossPercentage: gainLossPercentage,
			capitalGain: capitalGain,
			currentCalculatorMode: currentCalculatorMode,
			selectedReturn: CAGR,
			categoryName: schemeDetails?.categoryName,
			isDefaultReturn
		};

		return Math.floor(totalProfit) || 0;
	};

	const amountSliderChange = debounce(() => {
		dispatch('amountSliderChange');
	}, 500);

	const handleAmountSliderInput = () => {
		amountSliderChange();
	};

	export { schemeDetails, outputValues };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-background-alt text-sm md:mt-8 {$$props.class || ''}">
	<section class="origin-top">
		<InvestmentTypeRadioSelection
			selectedInvestmentType={currentCalculatorMode}
			on:investmentTypeChange={(e) => updateSelectedInvestmentTypeChange(e?.detail)}
			class="!items-start"
			secondRadioClass="!ml-6"
		/>

		<section class="mt-4 md:mt-6">
			<article class="flex items-center justify-between">
				<div class="text-xs font-normal text-body">
					{currentCalculatorMode === 'SIP' ? 'Monthly Investment' : 'One Time Investment'}
				</div>
				<div
					class="rounded-md bg-background px-2 py-1 text-center text-base font-medium text-title"
				>
					<AmountText amount={amountReturnSlider[0]} />
				</div>
			</article>
			<div class="slider -mx-2">
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
						class="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-primary bg-primary shadow-csm md:cursor-pointer"
					>
						<div class="h-3 w-3 rounded-full bg-primary" />
					</div>
				</Slider>
			</div>
		</section>

		<section class="flex flex-col justify-between md:flex-row md:items-end">
			<section class="mt-0">
				<div class="text-xs font-normal text-body">Select Duration</div>

				<section class="mt-3 flex items-center justify-start">
					{#each filteredDurations as durationButton, index (durationButton.months)}
						<ButtonMedium
							onClick={() => {
								updateDuration(durationButton);
							}}
							class="!h-fit !min-h-fit !border-border px-3 py-2 text-xs font-medium !capitalize md:px-4 md:py-3 {selectedDuration?.months ===
							durationButton.months
								? ''
								: '!text-body'} {index > 0 ? 'ml-2' : ''}"
							variant={selectedDuration?.months === durationButton.months
								? BtnVariant?.Contained
								: BtnVariant?.Outlined}
						>
							{durationButton?.text}
						</ButtonMedium>
					{/each}
				</section>
			</section>
		</section>
	</section>

	<div class="hidden">{matuarityAmount()}</div>
</article>
