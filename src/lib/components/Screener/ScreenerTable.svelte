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
			class="flex  h-3 cursor-pointer justify-end border-b !border-none bg-background-alt py-0 !pl-0 !pr-0 text-left font-normal text-body sm:!pl-5 sm:text-center"
		>
			<span class="mr-1 normal-case">3Y Returns</span>
		</Th>
	</THead>
	<TBody slot="tbody">
		{#each screenedSchemes || [] as funds, index}
			<Tr
				class={index === screenedSchemes?.length - 1 ? '' : '!border-b'}
				on:click={() => {
					onTableRowSelect(funds, index);
				}}
			>
				<Td class="border-none !px-0"
					><a
						class="flex w-full items-start overflow-hidden text-ellipsis whitespace-pre-wrap align-middle"
						href={normalizeFundName(funds?.schemeName, funds?.isin, funds?.schemeCode)}
					>
						<SchemeLogo src={funds?.logoUrl} class="h-12 w-12" />
						<div class="flex flex-col">
							<span class="line-clamp-2 text-sm font-normal text-title">{funds?.schemeName}</span>
							<span class="pt-2 text-xs text-body"
								>Minimum SIP Investment ₹{funds?.minSipAmount || '-'}</span
							>
						</div>
					</a></Td
				>

				<Td class="border-none !pr-0 text-right align-top"
					><span
						class="text-base font-medium text-title {funds?.returns3yr > 0
							? 'text-buy'
							: 'text-black-bolder'}"
						>{funds?.returns3yr > 0 ? `${funds?.returns3yr?.toFixed(2)}%` : '-'}</span
					></Td
				>
			</Tr>
		{/each}
	</TBody>
</Table>
