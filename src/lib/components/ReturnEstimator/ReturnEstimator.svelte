<script lang="ts">
	import ReturnsCalculatorInput from '$components/ReturnEstimator/ReturnsCalculatorInput.svelte';
	import ReturnsCalculatorOutput from '$components/ReturnEstimator/ReturnsCalculatorOutput.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import { createEventDispatcher, onMount } from 'svelte';

	let schemeDetails: SchemeDetails;
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

	export { schemeDetails };
</script>

<article
	id="returnEstimator"
	class="max-w-4xl rounded-lg bg-background-alt px-4 py-6 text-sm shadow-csm md:px-6 {$$props?.class}"
>
	<section class="origin-top">
		<div class="text-base font-medium text-title">Calculate Your Returns</div>
		<ReturnsCalculatorOutput outputData={calculatedOutput} />
		<ReturnsCalculatorInput
			{schemeDetails}
			bind:outputValues={calculatedOutput}
			on:amountSelectionChange={onAmountChange}
			on:durationSelectionChanged={onYearChange}
			on:amountSliderChange={handleAmountSliderChange}
			class="max-sm:pb-0"
		/>
	</section>
</article>
