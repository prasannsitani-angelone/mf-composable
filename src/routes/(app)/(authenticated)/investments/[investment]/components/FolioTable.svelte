<script lang="ts">
	import Table from '$components/Table/Table.svelte';
	import THead from '$components/Table/THead.svelte';
	import Th from '$components/Table/TH.svelte';
	import Td from '$components/Table/TD.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import type { FolioTableData } from '$lib/types/IInvestments';

	export let data: FolioTableData;
	export let showAllFolios = false;
</script>

<Table class={$$props.class}>
	<THead slot="thead">
		{#each data.columns as eachCol}
			<Th class={`border-t text-start capitalize`} wrapperClass={eachCol.thWrapperClass}
				>{eachCol.label}</Th
			>
		{/each}
	</THead>
	<TBody slot="tbody">
		{#each data.rows as rowData, index (index)}
			{#if showAllFolios || index < 2}
				<tr class="[&>td]:border-b-0">
					{#each data.columns as eachCol}
						<Td class={`border-b py-4 pl-5 pr-6 text-center text-body ${eachCol.tdClass}`}>
							<div class={`text-title`}>
								{eachCol.tdRender ? eachCol.tdRender(rowData) : rowData[eachCol.field]}
							</div>
						</Td>
					{/each}
				</tr>
			{/if}
		{/each}
	</TBody>
</Table>
