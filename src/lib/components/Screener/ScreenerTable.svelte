<script lang="ts">
	import { base } from '$app/paths';
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import Table from '$components/Table/Table.svelte';
	import Tag from '$components/Tag/Tag.svelte';
	import {
		fundSelectClick,
		type IFundSelect,
		type ScreenerSource
	} from '$lib/analytics/filters/filters';
	import { SCREENER_SOURCE } from '$lib/constants/screener';
	import type { ScreenedSchemes } from '$lib/types/Screener';
	import { modifiedGoto } from '$lib/utils/goto';
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
		await modifiedGoto(`${base}/${normalizeFundName(schemeName, isin, schemeCode, 'schemes')}`);
	};

	export { screenedSchemes, pageSource };
</script>

<Table class={$$props.class}>
	<THead slot="thead">
		<Th class="h-3 w-9/12 !border-none !pl-0 text-start !normal-case sm:w-2/3">Fund Name</Th>

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
				<Td
					class="flex border-none !px-0 {pageSource === SCREENER_SOURCE.HOMEPAGE
						? index !== screenedSchemes.length - 1
							? '!py-3'
							: '!pb-1 !pt-3'
						: ''} "
				>
					<a
						class="flex w-full items-start overflow-hidden text-ellipsis whitespace-pre-wrap align-middle"
						href={normalizeFundName(funds?.schemeName, funds?.isin, funds?.schemeCode)}
					>
						{#if pageSource === SCREENER_SOURCE.HOMEPAGE}
							<SchemeLogo src={funds?.logoUrl} size="xs" class="border-none" />
						{:else}
							<SchemeLogo src={funds?.logoUrl} class="h-12 w-12" />
						{/if}
						<div class="flex flex-col self-center">
							{#if pageSource === SCREENER_SOURCE.EXPLORE_MF}
								<ChipOverview
									headingPrimary={funds?.schemePlan}
									headingSecondary={funds?.schemeOption}
								/>
							{/if}
							<span class="line-clamp-2 text-sm font-normal text-title">{funds?.schemeName}</span>
							{#if pageSource === SCREENER_SOURCE.EXPLORE_MF}
								<div class="mt-1 flex flex-wrap items-center gap-2 whitespace-nowrap">
									<Tag name={funds?.categoryName} />
									<Tag name={funds?.subcategoryName} />
								</div>
							{/if}
							{#if pageSource !== SCREENER_SOURCE.HOMEPAGE}
								<span class="pt-2 text-xs text-body"
									>Min. SIP Amount ₹{funds?.minSipAmount || '-'}</span
								>
							{/if}
						</div>
					</a></Td
				>

				<Td
					class="border-none text-right align-top {pageSource === SCREENER_SOURCE.HOMEPAGE
						? '!px-0'
						: '!pr-0'}"
					><span
						class=" font-medium {pageSource === SCREENER_SOURCE.HOMEPAGE
							? 'text-sm'
							: 'text-base'} {funds?.returns3yr > 0 ? 'text-buy' : 'text-title'}"
						>{funds?.returns3yr > 0 ? `${funds?.returns3yr?.toFixed(2)}%` : '-'}</span
					></Td
				>
			</Tr>
		{/each}
	</TBody>
</Table>
