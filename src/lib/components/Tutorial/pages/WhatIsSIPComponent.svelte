<script lang="ts">
	import Icon2 from '$components/Tutorial/icons/WhaiIsSipBgIcon.svelte';
	import Slider from '@bulatdashiev/svelte-slider';
	import AmountText from '$components/AmountText.svelte';
	import { createEventDispatcher } from 'svelte';
	import { debounce } from '$lib/utils/helpers/debounce';
	import Graph from '$components/Tutorial/icons/Graph.svelte';
	import { HEIGHT_OFFSET } from '$components/Tutorial/pages/const';

	let options = [
		'A Systematic Investment Plan (SIP) is an approach for long term investing',
		'A fixed amount is invested every month in the mutual fund of your choice, automatically from your bank account'
	];

	export let minSipAmount = 100;
	$: maxAmountSlider = 10_000;
	$: minAmountSlider = Math.max(100, minSipAmount);

	$: amountReturnSlider = [minAmountSlider, maxAmountSlider];
	$: amountSliderSteps = 100;
	$: amountReturnSlider, onAmountChange();
	let returnsPercentage = 12;
	let duration = 10;

	$: matuarityAmount = function calculateReturn() {
		const selectedYear = duration;
		const investedAmount = amountReturnSlider[0];

		const CAGR = returnsPercentage;
		const effectiveCAGR = CAGR?.toFixed(2) / 100 / 12;
		const totalMonths = selectedYear * 12;
		let totalProfit = 0;

		totalProfit =
			investedAmount *
			(((Math.pow(1 + effectiveCAGR, totalMonths) - 1) / effectiveCAGR) * (1 + effectiveCAGR));

		return Math.floor(totalProfit) || 0;
	};

	const dispatch = createEventDispatcher();

	const onAmountChange = () => {
		setTimeout(() => {
			dispatch('amountSelectionChange');
		});
	};

	const handleAmountSliderInput = () => {
		debounce(() => {
			dispatch('amountSliderChange');
		}, 500);
	};

	let clientHeight = 0;
</script>

<div bind:clientHeight class="h-screen bg-[#80E0EA] p-5 {$$props.class}">
	<p class="mb-3 mt-10 text-2xl font-medium text-title">What is an SIP?</p>
	{#if clientHeight > HEIGHT_OFFSET}
		<Icon2 class="mx-auto mb-3" />
	{/if}
	<ul class="mb-4 ml-3">
		{#each options as option}
			<li class="mb-2 list-disc text-sm font-normal leading-6 text-title">
				{option}
			</li>
		{/each}
	</ul>

	<p class="mb-3 text-lg font-medium text-title">Calculate SIP Returns</p>

	<div class="slider flex items-center" id="disable-swipe">
		<Slider
			bind:value={amountReturnSlider}
			class="h-[60px]"
			min={minAmountSlider}
			max={maxAmountSlider}
			step={amountSliderSteps}
			on:input={handleAmountSliderInput}
		>
			<div class="p-6">
				<div
					class="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-primary bg-background-alt shadow-csm md:cursor-pointer"
				>
					<div class="h-3 w-3 rounded-full bg-primary" />
				</div>
			</div>
		</Slider>
		<div
			class="min-w-28 max-w-28 my-auto ml-3 w-28 rounded-md border border-primary bg-background-alt p-2.5 text-center text-sm font-medium text-title"
		>
			<AmountText amount={amountReturnSlider[0]} />
		</div>
	</div>

	<div class="relative mx-6 mt-5">
		<p class="ml-auto w-fit text-sm font-normal text-title">
			Projected Value
			<span class="text-[#0099A8]">- - - - - - - - - - - - - -</span>
			<br />
			<span>
				<AmountText class="text-base font-semibold" amount={matuarityAmount()} />
			</span>
		</p>
		<Graph class="-mt-10" />
	</div>
	<div class="mb-4 flex flex-row justify-between text-xs font-normal text-title">
		<p>Today</p>
		<p>After 10 years</p>
	</div>

	<p class="mx-auto w-fit text-[11px] font-medium text-title">
		Projected value for your SIP in {duration} years at {returnsPercentage}% returns annually
	</p>
</div>

<style>
	.slider {
		--progress-bg: #3f5bd9;
		--track-bg: #f4f6fb;
	}
</style>
