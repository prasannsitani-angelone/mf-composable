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

	const holdinggText = topHolding ? 'Top Holding' : 'Name';
	export { holdings, topHolding };
</script>

<Table class="border border-grey-line">
	<THead slot="thead" class="border-t border-grey-line">
		<Th class="w-3/5">
			{holdinggText}
		</Th>
		<Th class="flex justify-end text-right">Allocation</Th>
	</THead>
	<TBody slot="tbody">
		{#each holdings as holding}
			<Tr>
				<Td>
					{#if topHolding}
						<div class="flex items-center">
							<div
								class="mr-2 h-[6px] w-[6px] rounded-full"
								style={`background-color:${holding.colorCode}`}
							/>
							<div>
								{holding.companyName}
							</div>
						</div>
					{:else}
						<div class="flex items-start">
							<div>
								{holding.companyName}
							</div>
						</div>
					{/if}
				</Td>
				<Td class="mr-4 text-right text-sm font-medium !text-black-title"
					>{holding.percentageHold}%</Td
				>
			</Tr>
		{/each}
	</TBody>
</Table>
