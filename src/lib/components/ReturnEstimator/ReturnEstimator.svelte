<script lang="ts">
	import ReturnsCalculatorInput from '$components/ReturnEstimator/ReturnsCalculatorInput.svelte';
	import ReturnsCalculatorOutput from '$components/ReturnEstimator/ReturnsCalculatorOutput.svelte';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import { createEventDispatcher, onMount } from 'svelte';

	export let returns3yr: number;
	export let returns5yr: number;
	export let categoryName: string;
	export let minSipAmount: number;
	export let minLumpsumAmount: number;
	let calculatedOutput: CalculatedValue = {};

	const dispatch = createEventDispatcher();

	const onAmountChange = () => {
		dispatch('onAmountChange', calculatedOutput);
	};

	const onYearChange = () => {
		dispatch('onYearChange', calculatedOutput);
	};

	let inViewport = false;
	let impressionEventSent = false;

	const handleIntersection = (entries) => {
		(entries || []).forEach((entry) => {
			inViewport = entry?.isIntersecting;
		});
	};

	onMount(() => {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.5
		};

		const observer = new IntersectionObserver(handleIntersection, options);
		const target = document?.querySelector('#returnEstimator');

		observer?.observe(target);

		return () => {
			observer?.unobserve(target);
			observer?.disconnect();
		};
	});

	const returnEstimatorInViewPort = () => {
		if (inViewport && !impressionEventSent) {
			impressionEventSent = true;
			dispatch('returnEstimatorInViewPort', calculatedOutput);
		}
	};

	const handleAmountSliderChange = () => {
		dispatch('returnCalculatorResult', calculatedOutput);
	};

	$: inViewport, returnEstimatorInViewPort();
</script>

<article
	id="returnEstimator"
	class="mt-4 max-w-4xl rounded-lg bg-white px-4 py-6 text-sm shadow-csm md:px-6 {$$props?.class}"
>
	<section class="origin-top">
		<div class="text-base font-medium text-black-title">Calculate Your Returns</div>

		<ReturnsCalculatorInput
			{returns3yr}
			{returns5yr}
			{categoryName}
			{minSipAmount}
			{minLumpsumAmount}
			bind:outputValues={calculatedOutput}
			class="max-sm:pb-0"
			on:amountSelectionChange={onAmountChange}
			on:durationSelectionChanged={onYearChange}
			on:amountSliderChange={handleAmountSliderChange}
		/>
		<ReturnsCalculatorOutput outputData={calculatedOutput} class="pt-4" />
	</section>
</article>
