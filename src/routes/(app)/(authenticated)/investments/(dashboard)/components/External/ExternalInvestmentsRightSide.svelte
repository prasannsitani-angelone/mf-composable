<script lang="ts">
	import ExternalFundsPortfolioCard from '$components/PortfolioCards/ExternalFundsPortfolioCard.svelte';
	import type { InvestmentSummary } from '$lib/types/IInvestments';

	export let investmentSummary: InvestmentSummary;
	export let partialImportedFundCount = 0;
	export let totalImportedFundCount = 0;
	export let isPartialImport = false;
</script>

<section class="col-span-1 row-start-1 sm:col-span-1 sm:col-start-2 sm:row-span-3">
	<ExternalFundsPortfolioCard
		{investmentSummary}
		{partialImportedFundCount}
		{totalImportedFundCount}
		{isPartialImport}
	/>
</section>
