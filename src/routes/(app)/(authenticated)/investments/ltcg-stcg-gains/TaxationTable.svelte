<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import Table from '$components/Table/Table.svelte';
	import type { ITaxationDetails } from '$lib/types/IInvestments';

	let taxationDetails: ITaxationDetails[];

	export { taxationDetails };
</script>

<Table class={$$props.class}>
	<THead slot="thead">
		<Th class="h-3 w-8/12  !border-none  !pl-0 text-start !normal-case sm:w-2/3">Funds</Th>

		<Th
			class="flex h-3 justify-end !border-none bg-white py-0 !pl-0 !pr-0 text-left font-normal  sm:!pl-5 sm:text-center"
		>
			<p class="normal-case">Current Amount</p>
		</Th>
	</THead>
	<TBody slot="tbody">
		{#each taxationDetails || [] as funds}
			<Tr class="border-b border-grey-line">
				<Td class="!px-0">
					<div class="flex">
						<SchemeLogo src={funds?.logoUrl} class="h-12 w-12" />
						<div class="">
							<span
								class="line-clamp-2 whitespace-break-spaces text-sm font-normal text-black-title"
								>{funds?.schemeName}</span
							>
						</div>
					</div>
				</Td>

				<Td class="!pr-0 text-right">
					<div class="flex flex-col">
						<span class="text-sm font-medium text-black-key lg:font-semibold"
							><AmountText amount={funds?.currentValue?.toFixed(2) || 0} /></span
						>
						<span class="text-xs text-black-bolder">{funds?.units} units</span>
					</div>
				</Td>
			</Tr>
		{/each}
	</TBody>
</Table>
