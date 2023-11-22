<script lang="ts">
	import Button from '$components/Button.svelte';

	import type { SchemeHoldings } from '$lib/types/ISchemeDetails';
	import { viewAllFundHoldings } from '$components/Scheme/analytics';

	import type { TopHolding } from '$components/Scheme/types';
	import FundHoldingModal from './FundHoldingModal.svelte';
	import HoldingTable from './HoldingTable.svelte';

	let fundHoldingData: Array<SchemeHoldings>;
	let isin: string;
	let schemeName: string;
	$: isModalOpen = false;
	const toggleSchemeIformationModal = () => {
		isModalOpen = isModalOpen ? false : true;

		if (isModalOpen) {
			viewAllFundHoldings({
				FundName: schemeName,
				ISIN: isin
			});
		}
	};

	const setTableData = (holdings: SchemeHoldings[]) => {
		if (!holdings?.length) {
			return [];
		}
		let sortedHoldings: TopHolding[] = holdings.sort((a, b) =>
			a.percentageHold > b.percentageHold ? -1 : 1
		);

		let topHolding = sortedHoldings.slice(0, 10);

		topHolding = [...topHolding];

		return topHolding;
	};
	const schemeTopHolding = setTableData(fundHoldingData);

	export { fundHoldingData, isin, schemeName };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white text-sm shadow-csm">
	<header>
		<section class="flex cursor-pointer items-center justify-between p-4 pb-3 pt-6 text-lg md:px-6">
			<section class="flex items-center">
				<h2 class="flex items-center text-left text-base font-medium text-black-title">
					<span> Fund Holdings</span>
				</h2>
			</section>
		</section>
	</header>
	<section class="px-4 sm:px-6">
		<HoldingTable topHolding holdings={schemeTopHolding} />
	</section>

	<footer class=" flex px-4 sm:px-6">
		<div class="flex w-full items-center justify-center border-t">
			<Button class="!uppercase" variant="transparent" onClick={toggleSchemeIformationModal}>
				View All
			</Button>
		</div>
	</footer>
</article>
<FundHoldingModal
	holdings={fundHoldingData}
	{isModalOpen}
	{toggleSchemeIformationModal}
	{isin}
	{schemeName}
/>
