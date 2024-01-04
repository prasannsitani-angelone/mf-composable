<script lang="ts">
	import Button from '$components/Button.svelte';

	import type { SchemeHoldings, SectorHoldings } from '$lib/types/ISchemeDetails';
	import { viewAllFundHoldings } from '$components/Scheme/analytics';

	import type { TopHolding } from '$components/Scheme/types';
	import FundHoldingModal from './FundHoldingModal.svelte';
	import HoldingTable from './HoldingTable.svelte';
	import { Tabs } from 'svelte-components';

	let fundHoldingData: Array<SchemeHoldings>;
	let isin: string;
	let schemeName: string;
	let sectorData: Array<SectorHoldings>;
	let schemeTopHolding: Array<SchemeHoldings>;
	let topSectorHolding: Array<SectorHoldings> = [];
	$: isModalOpen = false;
	const tabStyles = {
		container: 'px-4 sm:px-6',
		tabsContainer: '',
		contentContainer: ''
	};
	const toggleSchemeIformationModal = () => {
		isModalOpen = isModalOpen ? false : true;

		if (isModalOpen) {
			viewAllFundHoldings({
				FundName: schemeName,
				ISIN: isin
			});
		}
	};

	const tabs = [
		{
			title: {
				label: 'Holdings By Sector'
			},
			tabId: 'sector',
			styles: {
				active: '!border-b-2 !border-blue-primary !text-blue-primary !font-normal !normal-case',
				default: '!text-black-title !font-normal !normal-case'
			}
		},
		{
			title: {
				label: 'Top Holdings'
			},
			tabId: 'holdingCompany',
			styles: {
				active: '!border-b-2 !border-blue-primary !text-blue-primary !font-normal !normal-case',
				default: '!text-black-title !font-normal !normal-case'
			}
		}
	];
	let activeTab = tabs[0].tabId;
	const onTabChange = (tabId: string | number) => {
		activeTab = tabId?.toString();
	};
	const setTableData = (holdings: SchemeHoldings[], sectorData: SectorHoldings[]) => {
		if (!holdings?.length) {
			return [];
		}
		let sortedHoldings: TopHolding[] = holdings.sort((a, b) =>
			a.percentageHold > b.percentageHold ? -1 : 1
		);
		let topHolding = sortedHoldings.slice(0, 10);
		schemeTopHolding = [...topHolding];

		if (!sectorData?.length) {
			activeTab = 'holdingCompany';
			return [];
		}
		topSectorHolding = sectorData.slice(0, 10);
	};
	setTableData(fundHoldingData, sectorData);

	export { fundHoldingData, isin, schemeName, sectorData };
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
	{#if sectorData?.length}
		<Tabs items={tabs} {activeTab} onChange={onTabChange} classes={tabStyles} />
	{/if}
	<section class="px-4 pt-4 sm:px-6">
		<HoldingTable
			topHolding
			holdings={schemeTopHolding}
			sectorHoldings={topSectorHolding}
			{activeTab}
		/>
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
	sectorHoldings={sectorData}
	{activeTab}
	{isModalOpen}
	{toggleSchemeIformationModal}
	{isin}
	{schemeName}
/>
