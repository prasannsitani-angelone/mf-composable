<script lang="ts">
	import TBody from '$components/Table/TBody.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';

	import Table from '$components/Table/Table.svelte';
	import SchemeCard from '$components/SchemeCard.svelte';
	let tableData: Array<WeeklyTopSchemesEntity>;

	export { tableData };
</script>

<Table class="hidden sm:block">
	<THead slot="thead" class="border-t">
		<Th class="text-start">Funds</Th>
		<Th class="text-center">3Y return</Th>
		<Th class="pl-0">Min SIP Invetsments</Th>
	</THead>
	<TBody slot="tbody">
		{#each tableData || [] as schemes}
			<tr class="hover"
				><Th class="w-[30%]">
					<SchemeCard {schemes} />
				</Th>
				<Th class="text-center">{schemes?.returns3yr}%</Th>
				<Th class="text-center">{schemes?.minSipAmount}</Th></tr
			>
		{/each}
	</TBody>
</Table>
