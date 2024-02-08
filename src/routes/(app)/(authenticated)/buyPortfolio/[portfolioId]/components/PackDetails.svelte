<script lang="ts">
	import Button from '$components/Button.svelte';
	import Modal from '$components/Modal.svelte';
	import { proceedToInvest } from '$lib/analytics/buyPortfolio/buyPortfolio';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';
	import BasicDetails from '../../components/BasicDetails.svelte';
	import PortfolioAllocation from './PortfolioAllocation.svelte';
	import PortfolioInput from './PortfolioInput.svelte';
	import ProjectedReturns from './ProjectedReturns.svelte';

	export let portfolioPack: PortfolioPack;
	export let amount: number;
	export let date: number;
	export let showInputPopup = false;
	export let requestId = '';

	let showChevron = false;
	let showWeightage = true;

	const toggleInput = () => {
		showInputPopup = !showInputPopup;
		if (showInputPopup) {
			let funds = '';
			portfolioPack?.schemes?.forEach((x) => {
				funds = funds + x.schemeName + ',';
			});
			proceedToInvest({ SelectedFunds: funds });
		}
	};
</script>

<section class="overflow-auto max-sm:h-[calc(100vh-150px)] max-sm:overflow-auto">
	<div class="mx-2 mb-2 flex items-center justify-between rounded-lg bg-background-alt px-4 py-3">
		<BasicDetails {portfolioPack} {showChevron} />
	</div>
	<div class="mx-2 mb-2 rounded-lg bg-background-alt p-4">
		<PortfolioAllocation {portfolioPack} {showWeightage} />
	</div>
	<div class="mx-2 mb-2 rounded-lg bg-background-alt p-4">
		<ProjectedReturns threeYearReturns={portfolioPack.threeYrReturnAvgPer} />
	</div>
	{#if !showInputPopup}
		<div class="mx-2 rounded-lg">
			<section class="fixed inset-0 top-auto rounded-lg bg-background-alt px-4 py-5 md:relative">
				<Button onClick={toggleInput} class="w-full">PROCEED TO INVEST</Button>
			</section>
		</div>
	{/if}
	<Modal isModalOpen={showInputPopup} on:backdropclicked={toggleInput}>
		<PortfolioInput
			{portfolioPack}
			{amount}
			sipStartDate={date}
			{requestId}
			on:backButtonClicked={toggleInput}
		/>
	</Modal>
</section>
