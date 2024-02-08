<script lang="ts">
	import AmountText from '$lib/components/AmountText.svelte';
	import Button from '$components/Button.svelte';
	import Slider from '@bulatdashiev/svelte-slider';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';

	let returns3yr = 0;
	let categoryName = '';
	let outputValues: CalculatedValue = {};
	let hideReturnsSlider = false;
	let amontSelectionChanged = () => '';
	let roiSelectionChanged = () => '';
	let durationSelectionChanged = () => '';

	$: currentCalculatorMode = 'SIP' as 'SIP' | 'OneTime';
	$: yearsReturnSlider = currentCalculatorMode ? [5, 30] : [5, 30];
	$: yearsReturnSlider, onYearChange();

	$: ROISlider = currentCalculatorMode
		? [returns3yr || getDefaultCagr(categoryName), 30]
		: [returns3yr || getDefaultCagr(categoryName), 30];
	$: ROISlider, onROIChange();

	$: amountReturnSlider = currentCalculatorMode ? [5000, 10000] : [5000, 1000000];
	$: amountReturnSlider, onAmountChange();

	$: capitalGain = 0;

	$: totalInvestment = 0;
	$: gainLossPercentage = 0;
	$: maxAmountSlider = currentCalculatorMode === 'SIP' ? 100000 : 1000000;

	function onROIChange() {
		roiSelectionChanged();
	}

	function onAmountChange() {
		amontSelectionChanged();
	}

	function onYearChange() {
		durationSelectionChanged();
	}
	$: matuarityAmount = function calculateReturn() {
		const selectedYear = yearsReturnSlider[0];
		const investedAmount = amountReturnSlider[0];

		let CAGR = ROISlider[0];
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

	function getDefaultCagr(categoryName: string) {
		const category = {
			Equity: 12,
			Debt: 8,
			Liquid: 4
		};

		return category[categoryName] || category.Equity;
	}
	const changeCalculatorMode = (mode: string) => {
		currentCalculatorMode = mode;
	};

	export {
		returns3yr,
		categoryName,
		outputValues,
		hideReturnsSlider,
		amontSelectionChanged,
		roiSelectionChanged,
		durationSelectionChanged
	};
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-background-alt pb-4 text-sm {$$props.class || ''}">
	<section class="origin-top">
		<div class="flex h-10 gap-4">
			<Button
				variant={`${currentCalculatorMode === 'SIP' ? 'contained' : 'outlined'}`}
				class={`flex-grow basis-0 rounded !py-0 !text-sm !font-normal uppercase`}
				onClick={() => changeCalculatorMode('SIP')}>SIP</Button
			>
			<Button
				variant={`${currentCalculatorMode === 'OneTime' ? 'contained' : 'outlined'}`}
				class="flex-grow basis-0 rounded !py-0 !text-sm !font-normal !uppercase"
				onClick={() => changeCalculatorMode('OneTime')}>One-Time</Button
			>
		</div>
		<div class="mt-11">
			<div class="mb-5 flex justify-between">
				<span
					class="flex items-center justify-center text-xs font-normal text-title md:text-sm md:font-normal md:text-body"
				>
					{currentCalculatorMode === 'SIP' ? 'Monthly Investment' : 'Select Amount'}
				</span>
				<div
					class="flex border-b border-l-0 border-r-0 border-t-0 border-disabled text-2xl font-normal text-title"
				>
					<AmountText amount={amountReturnSlider[0]} />
				</div>
			</div>
			<div class="slider">
				<Slider
					bind:value={amountReturnSlider}
					class="h-[60px]"
					min={500}
					max={maxAmountSlider}
					step={500}
					on
				>
					<div
						class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-background-alt shadow-csm"
					>
						<div class="h-3 w-3 rounded-full bg-border" />
					</div>
				</Slider>
			</div>
		</div>
		{#if !hideReturnsSlider}
			<div class="mt-11">
				<div class="mb-5 flex justify-between">
					<span
						class="flex items-center justify-center text-xs font-normal text-title md:text-sm md:font-normal md:text-body"
					>
						Expected Return (Yearly)
					</span>
					<div
						class="border-b border-l-0 border-r-0 border-t-0 border-disabled text-2xl font-normal text-title"
					>
						<div>{ROISlider[0]} %</div>
					</div>
				</div>

				<div class="slider">
					<Slider bind:value={ROISlider} class="h-[60px]" min={1} max={30} steps={1}>
						<div
							class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-background-alt shadow-csm"
						>
							<div class="h-3 w-3 rounded-full bg-border" />
						</div>
					</Slider>
				</div>

				<div class="mt-4 flex justify-between text-xs text-body">
					<span>1%</span><span>30%</span>
				</div>
			</div>
		{/if}
		<div class="mt-11">
			<div class="mb-5 flex justify-between">
				<span
					class="flex items-center justify-center text-xs font-normal text-title md:text-sm md:font-normal md:text-body"
				>
					Time Period
				</span>
				<div
					class="border-b border-l-0 border-r-0 border-t-0 border-disabled text-2xl font-normal text-title"
				>
					<div>{yearsReturnSlider[0]} Y</div>
				</div>
			</div>

			<div class="slider">
				<Slider bind:value={yearsReturnSlider} class="h-[60px]" min={1} max={30} steps={1}>
					<div
						class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-background-alt shadow-csm"
					>
						<div class="h-3 w-3 rounded-full bg-border" />
					</div>
				</Slider>
			</div>

			<div class="mt-4 flex justify-between text-xs text-body">
				<span>1Y</span><span>30Y</span>
			</div>
		</div>
	</section>
	<div class="hidden">{matuarityAmount()}</div>
</article>

<style>
	.slider {
		--progress-bg: #3f5bd9;
		--track-bg: #e8ebf1;
	}
</style>
