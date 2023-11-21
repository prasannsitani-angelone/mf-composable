<script lang="ts">
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import Table from '$components/Table/Table.svelte';
	import type { TopHolding } from '../types';

	let holdings: TopHolding[];
	let topHolding = false;

	const holdinggText = topHolding ? 'Holding Name' : 'Name';
	export { holdings, topHolding };
</script>

<Table>
	<THead slot="thead">
		<Th class="h-3 w-3/5 !border-none !pl-0 text-xs normal-case">
			{holdinggText}
		</Th>
		<Th class="flex h-3 justify-end !border-none !pr-0 text-right text-xs normal-case"
			>Allocation</Th
		>
	</THead>
	<TBody slot="tbody">
		{#each holdings as holding}
			<Tr>
				<Td class="!pl-0">
					{#if topHolding}
						<div class="flex items-center text-sm font-medium text-black-title">
							<div>
								{holding.companyName}
							</div>
						</div>
					{:else}
						<div class="flex items-start text-sm font-medium text-black-title">
							<div>
								{holding.companyName}
							</div>
						</div>
					{/if}
				</Td>
				<Td class="mr-4 !pr-0 text-right text-sm font-medium !text-black-title"
					>{holding.percentageHold}%</Td
				>
			</Tr>
		{/each}
	</TBody>
</Table>
