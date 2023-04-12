<script lang="ts">
	import TrendingFunds from './TrendingFunds/TrendingFunds.svelte';
	import type { PageData } from './$types';
	import StartNewInvestment from './StartNewInvestment.svelte';
	import ExploreScheme from './ExploreScheme/ExploreScheme.svelte';
	import PortfolioCard from '$components/PortfolioCards/PortfolioCard.svelte';
	import type { InvestmentSummary } from '$lib/types/IInvestments';

	$: showPortfoliocard = true;

	const onPortfolioDataReceived = (
		event: CustomEvent<{ investmentSummary: InvestmentSummary }>
	) => {
		const { currentValue } = event.detail.investmentSummary;
		if (!currentValue) {
			showPortfoliocard = false;
		}
	};

	export let data: PageData;
</script>

<article>
	<!-- <InvestmentsStories /> -->
	{#if showPortfoliocard}
		<div class=" sm:hidden">
			<PortfolioCard discoverPage={true} on:portfolidataReceived={onPortfolioDataReceived} />
		</div>
	{/if}
	<article class="mt-2 max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-0">
		<ExploreScheme searchOptions={data?.schemeData?.searchOptions} />
	</article>
	<TrendingFunds tableData={data?.schemeData?.weeklyTopSchemes} />
</article>

<article class="hidden sm:block">
	{#if showPortfoliocard}
		<PortfolioCard discoverPage={true} on:portfolidataReceived={onPortfolioDataReceived} />
	{:else}
		<StartNewInvestment />
	{/if}
</article>
