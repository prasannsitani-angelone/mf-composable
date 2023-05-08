<script lang="ts">
	import Button from '$components/Button.svelte';
	import type { InvestmentSummary } from '$lib/types/IInvestments';

	export let onButtonClick = () => '';
	export let summary: InvestmentSummary;

	const showRefreshEnums = ['REFRESHED', 'UPDATE FAILED'];

	const getUpdateScenarios = (summary: InvestmentSummary) => {
		if (summary?.lastImportPending === true && summary?.investedValue !== 0) {
			return 'REFRESHING';
		} else if (
			summary?.lastImportPending === false &&
			summary?.investedValue !== 0 &&
			summary?.lastImportStatus === 'COMPLETED'
		) {
			return 'REFRESHED';
		} else if (
			summary?.lastImportPending === false &&
			summary?.investedValue !== 0 &&
			summary?.lastImportStatus === 'FAILED'
		) {
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

<section class="flex justify-between py-2 sm:bg-white sm:px-6">
	<div class="pt-1 text-xs sm:pt-[2px] sm:text-sm">
		Last Refreshed On {lastSuccessfulImportDate}
	</div>
	{#if !showRefreshButton}
		<div class="text-xs sm:text-sm">REFRESHING...</div>
	{:else}
		<Button size="xs" variant="transparent" class="text-xs sm:text-sm" onClick={onButtonClick}
			>REFRESH</Button
		>
	{/if}
</section>
