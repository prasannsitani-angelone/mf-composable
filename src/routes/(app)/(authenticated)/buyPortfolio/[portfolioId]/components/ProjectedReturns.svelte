<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import { graphImpression } from '$lib/analytics/buyPortfolio/buyPortfolio';
	import ProjectedReturnsGraph from '$lib/images/ProjectedReturnsGraph.svg';
	import { calculateSipReturns } from '$lib/utils/helpers/returns';
	import { onMount } from 'svelte';

	export let threeYearReturns: number;

	onMount(() => {
		graphImpression({ Graph: 'Y' });
	});

	const finalVal =
		Math.round(calculateSipReturns(1000, 5, threeYearReturns)?.matuarityAmount * 100) / 100;
</script>

<section>
	<div class="text-base font-medium">
		Projected value for your Portfolio in 5 years at {threeYearReturns.toFixed(2)}% returns annually
	</div>
	<div
		class="relative left-32 top-8 flex w-48 flex-col justify-end text-left text-xs text-[#008F75] sm:left-72"
	>
		<p>Projected Value <span class="pl-2 text-lg">- - - - - - - -</span></p>
		<p class="font-medium"><AmountText amount={finalVal} /></p>
	</div>
	<div class="flex items-center justify-center">
		<img
			src={ProjectedReturnsGraph}
			width="270px"
			loading="lazy"
			alt="Add Scheme to Cart"
			class=""
		/>
	</div>
	<div class="ml-6 flex w-80 justify-between place-self-center pt-2 text-xs text-body sm:ml-40">
		<div>SIP of ₹1,000</div>
		<div>After 5 years</div>
	</div>
</section>
