<script lang="ts">
	import { onMount } from 'svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import ReturnsCalculatorInput from '$lib/components/Calculator/ReturnsCalculatorInput.svelte';
	import ReturnsCalculatorOutput from '$lib/components/Calculator/ReturnsCalculatorOutput.svelte';
	import Card from '$components/Card.svelte';
	import Button from '$components/Button.svelte';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import Link from '$components/Link.svelte';

	import {
		sipCalculatorScreenOpenAnalytics,
		sipCalculatorInvestButtonClickAnalytics,
		sipCalculatorReturnsSliderAnalytics
	} from './analytics';

	let calculatedOutput: CalculatedValue = {};

	const breadCrumbs = [
		{
			text: 'Home',
			href: '/'
		},
		{
			text: 'SIP Calculator',
			href: '/sipCalculator'
		}
	];

	const onReturnsSliderUpdate = () => {
		if (!(calculatedOutput?.currentCalculatorMode && calculatedOutput?.selectedReturn)) {
			return;
		}

		const eventMetadata = {
			InvestmentType: calculatedOutput.currentCalculatorMode,
			Returns: calculatedOutput.selectedReturn
		};
		sipCalculatorReturnsSliderAnalytics(eventMetadata);
	};

	const investButtonClickAnalyticsFunction = () => {
		sipCalculatorInvestButtonClickAnalytics();
	};

	onMount(() => {
		sipCalculatorScreenOpenAnalytics();
	});
</script>

<section class="col-span-2 col-start-1 row-start-1">
	<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />
</section>
<section class="col-span-1 col-start-1 row-start-2">
	<Card class="!p-0 max-sm:rounded-none max-sm:border-b max-sm:!pt-1 max-sm:shadow-none ">
		<h2
			class="mx-6 hidden border-b border-grey-line pt-7 pb-8 text-base font-normal text-black sm:block"
		>
			SIP Calculator
		</h2>
		<div class="mt-6 px-4 pb-9 lg:px-20">
			<ReturnsCalculatorInput
				bind:outputValues={calculatedOutput}
				roiSelectionChanged={onReturnsSliderUpdate}
				class="max-sm:pb-0"
			/>
		</div>
	</Card>
</section>
<section class="col-span-1 col-start-1 row-start-3 max-sm:mb-16 sm:col-start-2 sm:row-start-2">
	<Card class="max-sm:rounded-none  max-sm:pt-2 max-sm:shadow-none"
		><ReturnsCalculatorOutput isStandAlone outputData={calculatedOutput} class="pt-4" />
		<Link
			to="/explorefunds/sip-with-500?id=102"
			class="inset-x-0 bottom-0 block bg-white pt-7 max-sm:fixed max-sm:p-2"
			><Button
				ariaLabel="start investing"
				onClick={investButtonClickAnalyticsFunction}
				class="w-full">START INVESTING</Button
			></Link
		>
	</Card>
</section>
