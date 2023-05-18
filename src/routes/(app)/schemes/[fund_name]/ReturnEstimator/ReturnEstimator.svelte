<script lang="ts">
	import Button from '$components/Button.svelte';
	import CalenderIcon from '$lib/images/icons/CalenderIcon.svelte';
	import ReturnEstimatorIcon from '$lib/images/icons/ReturnEstimatorIcon.svelte';
	import Slider from '@bulatdashiev/svelte-slider';
	import { calculateReturnsAmount, calculateReturnsduration } from '../analytics';
	import { WMSIcon } from 'wms-ui-component';

	let returns3yr: number;
	let categoryName: string;
	$: currentCalculatorMode = 'SIP' as 'SIP' | 'OneTime';
	$: yearsReturnSlider = currentCalculatorMode ? [5, 30] : [5, 30];
	$: yearsReturnSlider, onYearChange();

	$: amountReturnSlider = currentCalculatorMode ? [5000, 10000] : [5000, 1000000];
	$: amountReturnSlider, onAmountChange();

	$: capitalGain = 0;

	$: totalInvestment = 0;
	$: gainLossPercentage = 0;
	$: maxAmountSlider = currentCalculatorMode === 'SIP' ? 100000 : 1000000;
	$: capitalGainSlider = (capitalGain / matuarityAmount()) * 100;

	function onAmountChange() {
		const eventMetadata = {
			InvestmentType: currentCalculatorMode,
			Amount: yearsReturnSlider[0]
		};

		calculateReturnsAmount(eventMetadata);
	}

	function onYearChange() {
		const eventMetadata = {
			InvestmentType: currentCalculatorMode,
			Duration: yearsReturnSlider[0]
		};
		calculateReturnsduration(eventMetadata);
	}
	$: matuarityAmount = function calculateReturn() {
		const selectedYear = yearsReturnSlider[0];
		const investedAmount = amountReturnSlider[0];

		let CAGR = returns3yr || getDefaultCagr(categoryName);
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

	export { returns3yr, categoryName };
</script>

<article class="bgv mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm">
	<header class="border border-b border-grey-line">
		<section
			class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
		>
			<section class="flex items-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
					<ReturnEstimatorIcon />
				</div>
				<div class="ml-4 flex flex-col">
					<h2 class="flex items-center text-left font-medium text-black-title">
						<span> Calculate Returns</span>
					</h2>
					<h3 class="text-left font-medium">
						<span class="text-sm text-grey-body">Based on past performance of this fund</span>
					</h3>
				</div>
			</section>
		</section>
	</header>
	<section class="origin-top">
		<div class="mt-6 px-4 pb-9 lg:px-20">
			<div class="flex h-10 gap-4">
				<Button
					variant={`${currentCalculatorMode === 'SIP' ? 'contained' : 'outlined'}`}
					class={`flex-grow basis-0 rounded !py-0 !text-sm !font-medium uppercase`}
					onClick={() => changeCalculatorMode('SIP')}>SIP</Button
				>
				<Button
					variant={`${currentCalculatorMode === 'OneTime' ? 'contained' : 'outlined'}`}
					class="flex-grow basis-0 rounded !py-0 !text-sm !font-medium !uppercase"
					onClick={() => changeCalculatorMode('OneTime')}>One-Time</Button
				>
			</div>
			<div class="mt-11">
				<div class="mb-5 flex justify-between">
					<span
						class="flex items-center justify-center text-xs font-normal text-black-title md:text-sm md:font-medium md:text-grey-body"
					>
						{currentCalculatorMode === 'SIP' ? 'Monthly Investment' : 'Select Amount'}
					</span>
					<div
						class="flex border-b border-t-0 border-l-0 border-r-0 border-grey-disabled text-2xl font-medium text-black-title"
					>
						₹
						<div>{amountReturnSlider[0]}</div>
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
							class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white shadow-csm"
						>
							<div class="h-3 w-3 rounded-full bg-grey-line" />
						</div>
					</Slider>
				</div>
			</div>
			<div class="mt-11">
				<div class="mb-5 flex justify-between">
					<span
						class="flex items-center justify-center text-xs font-normal text-black-title md:text-sm md:font-medium md:text-grey-body"
					>
						Time Period
					</span>
					<div
						class="border-b border-t-0 border-l-0 border-r-0 border-grey-disabled text-2xl font-medium text-black-title"
					>
						<div>{yearsReturnSlider[0]} Y</div>
					</div>
				</div>

				<div class="slider">
					<Slider bind:value={yearsReturnSlider} class="h-[60px]" min={1} max={30} steps={1}>
						<div
							class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white shadow-csm"
						>
							<div class="h-3 w-3 rounded-full bg-grey-line" />
						</div>
					</Slider>
				</div>

				<div class="mt-4 flex justify-between text-xs text-grey-body">
					<span>1Y</span><span>30Y</span>
				</div>
			</div>
			<div
				class="mt-6 mb-9 flex h-9 justify-center rounded bg-grey align-middle font-normal text-grey-body"
			>
				<span class="flex items-center gap-1 text-xs leading-9 md:text-sm">
					<span> When you invest </span>
					<span class="font-bold text-black-title"> ₹<span>{amountReturnSlider[0]}</span></span>
					{#if currentCalculatorMode === 'SIP'}
						<span> monthly for </span>
					{:else}
						<span>and hold it for</span>
					{/if}
					<span class="font-bold text-black-title">{yearsReturnSlider[0]} year<span>s</span></span
					></span
				>
			</div>
			<div class="rounded border border-grey-line p-4">
				<div class="pb-5">
					<div class="mb-3 flex justify-between text-sm font-medium text-grey-body">
						<div>
							<p>Your Investment</p>
							<p class="text-xl text-black-title">₹<span>{totalInvestment}</span></p>
						</div>
						<div>
							<p class="text-right">Gain</p>
							<div class="flex items-center justify-center">
								<p class="text-green-buy">{gainLossPercentage?.toFixed(2)}%</p>
								<p class="ml-1 text-xl text-black-title">₹<span>{capitalGain}</span></p>
							</div>
						</div>
					</div>
					<div />
				</div>
				<div class="slider-disabled">
					<div class="mb-4 flex h-2.5 w-full flex-row-reverse rounded-full bg-grey-line">
						<div class="h-2.5 rounded-r-full bg-green-buy" style={`width: ${capitalGainSlider}%`} />
					</div>
				</div>

				<div class="flex justify-center bg-green-buy/[0.12] py-3">
					{#if matuarityAmount() > 0}
						<WMSIcon name="sparkles" />
					{/if}
					<div
						class="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-green-buy sm:h-12 sm:w-12"
					>
						<CalenderIcon />
					</div>
					<div>
						<div class="text-sm font-normal text-grey-body">Total Value</div>
						<div class="text-2xl font-medium text-black-title">
							₹<span>{matuarityAmount()}</span>
						</div>
					</div>
					{#if matuarityAmount() > 0}
						<WMSIcon name="sparkles" />
					{/if}
				</div>
			</div>
		</div>
	</section>
</article>

<style>
	.slider {
		--progress-bg: #3f5bd9;
		--track-bg: #e8ebf1;
	}
</style>
