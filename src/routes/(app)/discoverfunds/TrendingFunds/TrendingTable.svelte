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
	let tableData: Array<WeeklyTopSchemesEntity>;

	let currentYearFilter: TableColumnToggle = {
		label: '3Y Return',
		field: 'returns3yr'
	};
	const sortTable = () => {
		currentYearFilter = returnYearTableChangeColumn(currentYearFilter.field, yearlyReturnMap);
	};

	export { tableData };
</script>

<Table class="hidden sm:block">
	<THead slot="thead" class="border-t">
		<Th class="text-start">Funds</Th>
		<Th class="w-full !p-0 text-center" sortable isHorizontalSort={true} on:initSort={sortTable}
			>{currentYearFilter.label}</Th
		>
		<Th class="!pl-0">Min SIP Invetsments</Th>
	</THead>
	<TBody slot="tbody">
		{#each tableData || [] as schemes}
			<Tr class="hover"
				><Td class="w-[30%]">
					<SchemeCard {schemes} />
				</Td>
				<Td class="text-center">{schemes[currentYearFilter.field]}%</Td>
				<Td class="text-center">₹{schemes?.minSipAmount}</Td></Tr
			>
		{/each}
	</TBody>
</Table>
