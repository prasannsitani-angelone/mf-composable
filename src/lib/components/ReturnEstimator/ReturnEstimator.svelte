<script lang="ts">
	import ReturnsCalculatorInput from '$components/ReturnEstimator/ReturnsCalculatorInput.svelte';
	import ReturnsCalculatorOutput from '$components/ReturnEstimator/ReturnsCalculatorOutput.svelte';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import { createEventDispatcher } from 'svelte';

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
</script>

<article
	class="bgv mt-4 max-w-4xl rounded-lg bg-white px-4 py-6 text-sm shadow-csm md:px-6 {$$props?.class}"
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
		/>
		<ReturnsCalculatorOutput outputData={calculatedOutput} class="pt-4" />
	</section>
</article>
