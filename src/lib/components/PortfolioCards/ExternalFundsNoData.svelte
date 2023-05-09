<script lang="ts">
	import { PortfolioCard } from 'wms-ui-component';
	import type { ScenarioMap } from '$lib/types/IInvestments';
	export let scenario: 'errorFetchingInvestments' | 'FetchingInprogress' | 'noInvestmentFound' =
		'noInvestmentFound';
	let totalInvested = '';
	let currentValue = '';

	const scenarioMap: ScenarioMap = {
		errorFetchingInvestments: '₹ --',
		FetchingInprogress: '...',
		noInvestmentFound: '₹0.00'
	};

	const getScenarioBasedValues = (scene: keyof ScenarioMap) => {
		totalInvested = scenarioMap[scene];
		currentValue = scenarioMap[scene];
	};
	$: {
		getScenarioBasedValues(scenario);
	}
</script>

<PortfolioCard class="overflow-hidden max-sm:mb-[10px]" variant="secondary">
	<section class="flex items-center justify-between lg:mx-0">
		<article class="flex flex-col items-start">
			<div class="text-xs md:text-sm">Total Invested</div>
			<div class="text-[18px] font-medium md:text-xl">
				{totalInvested}
			</div>
		</article>

		<article class="flex flex-col items-end">
			<div class="text-xs md:text-sm">Current Value</div>
			<div class="text-[18px] font-medium md:text-xl">
				{currentValue}
			</div>
		</article>
	</section>
</PortfolioCard>
