<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { returnYearTableChangeColumn } from '$lib/utils';
	import Table from '$components/Table/Table.svelte';
	import THead from '$components/Table/THead.svelte';
	import Th from '$components/Table/TH.svelte';
	import Td from '$components/Table/TD.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import { md } from '$lib/constants/screenDimensions';
	import type { TableDataTypes } from '$lib/types/IPortfolioDetails';

	const dispatch = createEventDispatcher();

	export let holding: Array<TableDataTypes> = [];
	export let graphColor: string[] = [];
	export let nameColumnHeader = 'Fund';
	export let footerText = 'Fund';
	export let showColor = false;
	export let showCompaniesFooter = false;
	export let viewMoreFooter = false;
	export let isCompaniesTableVisible = false;

	let viewAllData = false;

	let table = {
		isLoading: false,
		isSlotMode: true,
		columns: [
			{
				label: nameColumnHeader,
				field: 'name',
				width: '40%',
				columnClasses: 'w-[40%] text-xs w-[40%]',
				tdClass: '!text-left',
				thWrapperClass: 'flex flex-row items-center justify-start',
				tdWrapperClass:
					'items-start justify-between mr-4 truncate text-sm font-medium text-black-title'
			},
			{
				label: '% Allocation',
				field: 'percentageHold',
				columnClasses: 'text-xs',
				thWrapperClass:
					'flex flex-row items-center justify-center max-sm:w-full max-sm:justify-end',
				tdWrapperClass: 'g:mr-4',
				tdRender: (data: number) => {
					return data?.toFixed(2) + '%';
				}
			},
			{
				label: 'Value',
				field: 'amountValue',
				columnClasses: 'padding-0 text-xs p-0',
				thWrapperClass: 'flex flex-row items-center max-sm:w-full justify-end',
				tdWrapperClass: '',
				tdClass: 'padding-0 text-right',
				tdRender: (data: number) =>
					`${data < 0 ? '-' : ''}₹${addCommasToAmountString(Math.abs(data)?.toFixed(2))}`
			}
		],
		rows: [],
		rowClasses: '[&>td]:border-b-0',
		totalRecordCount: 0,
		sortable: {
			order: 'id',
			sort: 'asc'
		},
		columnClasses: 'border-b border-grey-line'
	};

	const setTableData = (holdings: Array<TableDataTypes>) => {
		if (!holdings) {
			return;
		}
		let topHolding = holdings;
		if (viewAllData) {
			topHolding = holdings?.sort((a, b) => (a.percentageHold > b.percentageHold ? -1 : 1));
		} else {
			topHolding = holdings
				?.sort((a, b) => (a.percentageHold > b.percentageHold ? -1 : 1))
				?.slice(0, showColor ? 6 : 5);
		}
		topHolding = topHolding.map((holding, index) => {
			holding.colorCode = graphColor[index];
			return holding;
		});
		table.rows = topHolding;
	};

	$: {
		setTableData(holding);
	}

	const toggleTableData = () => {
		viewAllData = !viewAllData;
		setTableData(holding);
	};

	const changeColumnReturn = (col: string) => {
		const tableMobileColumns = [
			{
				label: '% Allocation',
				field: 'percentageHold',
				tdRender: (data: number) => {
					return data?.toFixed(2) + '%';
				}
			},
			{
				label: 'Value',
				field: 'amountValue',
				tdRender: (data: number) =>
					`${data < 0 ? '-' : ''}₹${addCommasToAmountString(Math.abs(data)?.toFixed(2))}`
			}
		];

		const nextReturn = returnYearTableChangeColumn(col, tableMobileColumns);
		table.columns[1].label = nextReturn.label;
		table.columns[1].field = nextReturn.field;
		table.columns[1].tdRender = nextReturn.tdRender;
	};

	const emitToggleFilterTable = () => {
		dispatch('toggleFilterTable');
	};

	const setTableColumnsForMobile = () => {
		if (browser && window.innerWidth < md) {
			table.columns = table?.columns?.filter(
				(column) => column?.field !== 'percentageHold' && column?.field !== 'amountValue'
			);

			table.columns.push({
				label: '% Allocation',
				field: 'percentageHold',
				columnClasses: 'w-[20%] !pr-3',
				sortable: true,
				isHorizontalSort: true,
				sortField: 'percentageHold',
				thWrapperClass: 'max-sm:w-full max-sm:justify-end max-sm:text-blue-primary',
				tdClass: 'text-right',
				thStyle: 'color: "#3F5BD9"',
				tdRender: (data) => {
					return data?.toFixed(2) + '%';
				}
			});
		}
	};
	onMount(() => {
		setTableColumnsForMobile();
	});
</script>

<section>
	<Table class={$$props.class}>
		<THead slot="thead">
			{#each table.columns as eachCol}
				<Th
					class={`text-start capitalize max-sm:pr-1 max-sm:pl-4 ${table.columnClasses || ''} ${
						eachCol.columnClasses || ''
					}`}
					thStyle="{eachCol.thStyle || ''},"
					isHorizontalSort={eachCol.isHorizontalSort}
					sortable={eachCol.sortable}
					sortField={eachCol.sortField}
					wrapperClass={eachCol.thWrapperClass}
					on:initSort={() => changeColumnReturn(eachCol.field)}>{eachCol.label}</Th
				>
			{/each}
		</THead>
		<TBody slot="tbody">
			{#each table.rows as rowData}
				<tr class="[&>td]:border-b-0">
					{#each table.columns as eachCol}
						<Td
							class={`border-b border-grey-line py-4 pl-5 pr-6 text-center text-grey-body ${eachCol.tdClass}`}
						>
							<div
								class={`text-sm font-medium text-black-title ${eachCol.tdWrapperClass || ''} ${
									eachCol.field === 'name' ? 'flex items-center !justify-start' : ''
								}`}
							>
								{#if showColor && eachCol.field === 'name'}
									<div
										class="mr-2 h-1.5 w-1.5 rounded-full"
										style:background-color={rowData.colorCode}
									/>
								{/if}
								{eachCol.tdRender
									? eachCol.tdRender(rowData[eachCol.field])
									: rowData[eachCol.field]}
							</div>
						</Td>
					{/each}
				</tr>
			{/each}
		</TBody>
	</Table>

	{#if showCompaniesFooter}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class={`flex cursor-pointer items-end justify-center border-t py-4
      text-sm font-semibold text-blue-primary ${
				isCompaniesTableVisible ? 'border-b' : 'rounded-b'
			}`}
			on:click={emitToggleFilterTable}
		>
			{isCompaniesTableVisible ? 'Hide' : `Show ${footerText || 'Funds'}`}
		</div>
	{/if}
	{#if viewMoreFooter && table?.rows?.length && holding?.length > 5}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="flex cursor-pointer items-end justify-center rounded-b border-t py-4
      text-sm font-semibold uppercase text-blue-primary"
			on:click={toggleTableData}
		>
			View {viewAllData ? 'Less' : 'All'}
		</div>
	{/if}
</section>
