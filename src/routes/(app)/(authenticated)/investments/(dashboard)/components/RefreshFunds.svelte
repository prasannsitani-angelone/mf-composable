<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { InvestmentSummary } from '$lib/types/IInvestments';

	export let onButtonClick = () => '';
	export let summary: InvestmentSummary;

	const showRefreshEnums = ['REFRESHED', 'UPDATE FAILED'];
	/**
	 * UPDATE FAILED
	 * 1. status is 200OK && values not zero && && lastImportStatus=FAILED then user has previous import and last import failed
	 *
	 * UPDATE ONGOING - REFRESHING
	 * 2. status is 200OK && values not zero && && lastImportStatus=(STARTED|PENDING) then user has previous import and last import in progress, show refreshing
	 *
	 * REFRESH SUCCESSFUL
	 * 3. status is 200OK && values not zero && && lastImportStatus=COMPLETED then user has previous import and last import in successful
	 */

	const getUpdateScenarios = (summary: InvestmentSummary) => {
		if (
			(summary?.lastImportStatus === 'STARTED' || summary?.lastImportStatus === 'PENDING') &&
			summary?.investedValue !== 0
		) {
			return 'REFRESHING';
		} else if (summary?.investedValue !== 0 && summary?.lastImportStatus === 'COMPLETED') {
			return 'REFRESHED';
		} else if (summary?.investedValue !== 0 && summary?.lastImportStatus === 'FAILED') {
			return 'UPDATE FAILED';
		} else {
			return 'REFRESHED';
		}
	};

	let showRefreshButton: boolean;
	$: showRefreshButton = showRefreshEnums.includes(getUpdateScenarios(summary));

	$: lastSuccessfulImportDate = summary?.lastSuccessfullImportTs
		? new Date(summary?.lastSuccessfullImportTs).toLocaleDateString('en-GB', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
		  })
		: '--';
</script>

<section class="flex justify-between py-2 text-title sm:border-b sm:bg-background sm:px-6">
	<div class="pt-1 text-xs sm:pt-[2px] sm:text-sm">
		Last Refreshed On {lastSuccessfulImportDate}
	</div>
	{#if !showRefreshButton}
		<div class="text-xs sm:text-sm">REFRESHING...</div>
	{:else}
		<Button
			size="xs"
			variant="transparent"
			class="text-xs sm:px-0 sm:text-sm"
			onClick={onButtonClick}>REFRESH</Button
		>
	{/if}
</section>
