<script lang="ts">
	import TBody from '$components/Table/TBody.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';

	import Table from '$components/Table/Table.svelte';
	import SchemeCard from '$components/SchemeCard.svelte';
	import { returnYearTableChangeColumn, yearlyReturnMap, type TableColumnToggle } from '$lib/utils';
	import Td from '$components/Table/TD.svelte';
	import Tr from '$components/Table/TR.svelte';
	import AddToFavourites from '$components/AddToFavourites.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	let tableData: Array<WeeklyTopSchemesEntity>;

	let currentYearFilter: TableColumnToggle = {
		label: '3Y Return',
		field: 'returns3yr'
	};
	const sortTable = () => {
		currentYearFilter = returnYearTableChangeColumn(currentYearFilter.field, yearlyReturnMap);
	};

	const onTableRowSelect = (schemes: WeeklyTopSchemesEntity) => {
		const replaceState = false;

		goto(
			`${base}/${normalizeFundName(
				schemes?.schemeName,
				schemes?.isin,
				schemes?.schemeCode,
				'schemes'
			)}`,
			{ replaceState }
		);
	};

	export { tableData };
</script>

<Table class="hidden sm:block">
	<THead slot="thead" class="border-t">
		<Th class="w-8/12 text-start">Funds</Th>
		<Th class="w-full !p-0 text-center" sortable isHorizontalSort={true} on:initSort={sortTable}
			>{currentYearFilter.label}</Th
		>
		<Th class="!pl-0">Min SIP Invetsments</Th>
	</THead>
	<TBody slot="tbody">
		{#each tableData || [] as schemes}
			<Tr
				class="hover cursor-pointer"
				on:click={() => {
					onTableRowSelect(schemes);
				}}
				><Td class="w-[30%]">
					<SchemeCard {schemes} />
				</Td>
				<Td class="text-center">{schemes[currentYearFilter.field]}%</Td>
				<Td class="relative text-center">
					<div class="absolute top-0 bottom-0 right-0 flex justify-end pr-3">
						<div class="flex items-center">
							<span>
								₹{schemes?.minSipAmount}
							</span>
						</div>
						<AddToFavourites
							class="mt-[2px] flex h-full items-center"
							isin={schemes?.isin}
							schemeCode={schemes?.schemeCode}
							isFavourite={schemes?.isFavourite}
						/>
					</div>
				</Td></Tr
			>
		{/each}
	</TBody>
</Table>
