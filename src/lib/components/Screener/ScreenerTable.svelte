<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import Table from '$components/Table/Table.svelte';
	import {
		fundSelectClick,
		type IFundSelect,
		type ScreenerSource
	} from '$lib/analytics/filters/filters';
	import type { ScreenedSchemes } from '$lib/types/Screener';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';

	let screenedSchemes: ScreenedSchemes[];
	let pageSource: ScreenerSource;
	const onTableRowSelect = async (schemes: ScreenedSchemes, index: number) => {
		const { schemeName, isin, schemeCode } = schemes;
		const fundSelectMetaData: IFundSelect = {
			fundName: schemeName,
			isin,
			source: pageSource,
			fundRank: index + 1
		};

		fundSelectClick(fundSelectMetaData);
		await goto(`${base}/${normalizeFundName(schemeName, isin, schemeCode, 'schemes')}`);
	};

	export { screenedSchemes, pageSource };
</script>

<Table class={$$props.class}>
	<THead slot="thead">
		<Th class="h-3 w-9/12  !border-none  !pl-0 text-start !normal-case sm:w-2/3">Funds</Th>

		<Th
			class="flex  h-3 cursor-pointer justify-end border-b !border-none border-grey-line bg-white py-0 !pl-0 !pr-0 text-left font-normal text-grey-body sm:!pl-5 sm:text-center"
		>
			<span class="mr-1">3Y Returns</span>
		</Th>
	</THead>
	<TBody slot="tbody">
		{#each screenedSchemes || [] as funds, index}
			<Tr
				class="border-b border-grey-line"
				on:click={() => {
					onTableRowSelect(funds, index);
				}}
			>
				<Td class="!px-0"
					><a
						class="flex w-full items-end overflow-hidden text-ellipsis whitespace-pre-wrap align-middle"
						href={normalizeFundName(funds?.schemeName, funds?.isin, funds?.schemeCode)}
					>
						<SchemeLogo src={funds?.logoUrl} class="h-12 w-12" />
						<div class="flex flex-col">
							<span class="line-clamp-2 text-sm font-normal text-black-title"
								>{funds?.schemeName}</span
							>
							<span class="text-xs text-black-bolder"
								>Minimum SIP Investment ₹{funds?.minSipAmount || '-'}</span
							>
						</div>
					</a></Td
				>

				<Td class="!pr-0 text-right"
					><span class="text-base font-medium text-black-title"
						>{funds?.returns3yr > 0 ? `${funds?.returns3yr?.toFixed(2)}%` : '-'}</span
					></Td
				>
			</Tr>
		{/each}
	</TBody>
</Table>
