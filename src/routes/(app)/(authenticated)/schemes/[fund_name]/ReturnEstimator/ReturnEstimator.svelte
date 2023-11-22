<script lang="ts">
	import ReturnsCalculatorInput from '$components/Calculator/ReturnsCalculatorInput.svelte';
	import ReturnsCalculatorOutput from '$components/Calculator/ReturnsCalculatorOutput.svelte';
	import ReturnEstimatorIcon from '$lib/images/icons/ReturnEstimatorIcon.svelte';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import { calculateReturnsAmount, calculateReturnsduration } from '$components/Scheme/analytics';

	let calculatedOutput: CalculatedValue = {};
	export let returns3yr: number;
	export let categoryName: string;

	function onAmountChange() {
		if (!(calculatedOutput?.currentCalculatorMode && calculatedOutput?.investedAmount)) {
			return;
		}
		const eventMetadata = {
			InvestmentType: calculatedOutput?.currentCalculatorMode,
			Amount: calculatedOutput.investedAmount
		};
		calculateReturnsAmount(eventMetadata);
	}

	function onYearChange() {
		if (!(calculatedOutput?.currentCalculatorMode && calculatedOutput?.selectedYear)) {
			return;
		}
		const eventMetadata = {
			InvestmentType: calculatedOutput?.currentCalculatorMode,
			Duration: calculatedOutput?.selectedYear
		};
		calculateReturnsduration(eventMetadata);
	}
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
					<h2 class="flex items-center text-left font-normal text-black-title">
						<span> Calculate Returns</span>
					</h2>
					<h3 class="text-left font-normal">
						<span class="text-sm text-grey-body">Based on past performance of this fund</span>
					</h3>
				</div>
			</section>
		</section>
	</header>
	<section class="origin-top">
		<div class="mt-6 px-4 pb-0 sm:pb-9 lg:px-20">
			<ReturnsCalculatorInput
				{returns3yr}
				{categoryName}
				bind:outputValues={calculatedOutput}
				class="max-sm:pb-0"
				amontSelectionChanged={onAmountChange}
				durationSelectionChanged={onYearChange}
			/>
			<ReturnsCalculatorOutput outputData={calculatedOutput} class="pt-4" />
		</div>
	</section>
</article>
