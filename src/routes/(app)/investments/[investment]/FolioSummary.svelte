<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import Card from '$components/Card.svelte';
	import { md } from '$lib/constants/screenDimensions';
	import { browser } from '$app/environment';
	import FolioHead from './components/FolioHead.svelte';
	import FolioTable from './components/FolioTable.svelte';
	import type { FolioHoldingType, FolioObject, FolioTableData } from '$lib/types/IInvestments';
	const dispatch = createEventDispatcher();

	export let folioDetails: FolioHoldingType;

	let showFolioList = false;

	const toggleShowFolioList = () => {
		showFolioList = !showFolioList;

		if (!showFolioList) {
			dispatch('viewHideAllFolioClicked');
		}
	};

	let table: FolioTableData = {
		columns: [
			{
				label: 'Folio Number',
				field: 'folioNumber',
				tdClass: '!text-left'
			},
			{
				label: 'Avg NAV',
				field: 'averageNav',
				thWrapperClass: 'w-full justify-center',
				tdRender: () => `₹${addCommasToAmountString(folioDetails?.averageNav?.toFixed(2))}`
			},
			{
				label: 'Total Units',
				field: 'totalUnitsAllocated',
				thWrapperClass: 'w-full justify-center',
				tdRender: (data: FolioObject) =>
					`${(data?.redemableUnits + data?.blockedunits)?.toFixed(3)}`
			},
			{
				label: 'Folio Value',
				field: 'folioValue',
				tdClass: 'text-right',
				thWrapperClass: 'w-full justify-end',
				tdRender: (data: FolioObject) =>
					`₹${addCommasToAmountString((data?.redemableAmount + data?.blockedAmount).toFixed(2))}`
			}
		],
		rows: folioDetails?.folioHoldings || []
	};

	const setTableColumnsForMobile = () => {
		if (browser && window.innerWidth < md) {
			table.columns = table?.columns?.filter(
				(column) =>
					column?.field !== 'averageNav' &&
					column?.field !== 'totalUnitsAllocated' &&
					column?.field !== 'folioValue'
			);

			table.columns.push({
				label: 'Value',
				field: 'folioValue',
				tdClass: 'text-right',
				thWrapperClass: 'w-full justify-end',
				tdRender: (data: FolioObject) =>
					`₹${addCommasToAmountString((data?.redemableAmount + data?.blockedAmount).toFixed(2))}`
			});
		}
	};

	setTableColumnsForMobile();
</script>

<Card class="mt-2 !p-0 lg:mt-4">
	<svelte:fragment slot="header">
		<FolioHead data={folioDetails} />
	</svelte:fragment>
	{#if folioDetails?.folioHoldings?.length}
		<section>
			{#if showFolioList}
				<FolioTable data={table} />
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="flex cursor-pointer items-end justify-center border-t py-5 text-sm font-semibold text-blue-primary"
				on:click={toggleShowFolioList}
			>
				{showFolioList ? 'Hide' : 'Show All Folios'}
			</div>
		</section>
	{/if}
</Card>
