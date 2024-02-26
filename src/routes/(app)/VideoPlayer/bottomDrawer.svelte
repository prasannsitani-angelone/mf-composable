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
	import type { VideoAnalyticsCallbacks } from '$lib/analytics/video';
	import type { ScreenedSchemes } from '$lib/types/Screener';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { WMSIcon } from 'svelte-components';

	let pageSource: ScreenerSource;

	export let schemes: ScreenedSchemes[];
	export let analyticsCallbacks: VideoAnalyticsCallbacks;
	export let videoTitle: string;
	export let isDrawerMaxHeight: boolean;

	const onTableRowSelect = async (scheme: ScreenedSchemes, index: number) => {
		const { schemeName, isin, schemeCode } = scheme;
		const fundSelectMetaData: IFundSelect = {
			fundName: schemeName,
			isin,
			source: pageSource,
			fundRank: index + 1
		};

		fundSelectClick(fundSelectMetaData);
		analyticsCallbacks?.bottomDrawerItemClick?.(videoTitle, scheme, index + 1);
		await goto(
			`${base}/${normalizeFundName(schemeName, isin, schemeCode, 'schemes')}?orderpad=INVEST`
		);
	};
</script>

<div class="flex items-center justify-center">
	{#if !isDrawerMaxHeight}
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="7" viewBox="0 0 18 7" fill="none">
			<path
				d="M1.25 5.5L9.25 1L16.75 5.5"
				stroke="var(--DISABLED)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<div class="h-[2px] w-[20px]" style="background-color: var(--DISABLED)" />
	{/if}
</div>

<Table class="{$$props.class} mt-5">
	<THead slot="thead">
		<Th class="h-3 w-9/12 !border-none  !pl-0 text-start !normal-case sm:w-2/3">Funds</Th>

		<Th
			class="flex  h-3 cursor-pointer justify-end border-b !border-none bg-background-alt py-0 !pl-0 !pr-0 text-left font-normal text-body sm:!pl-5 sm:text-center"
		>
			<span class="mr-1 normal-case">3Y Returns</span>
		</Th>
	</THead>
	<TBody slot="tbody">
		{#each schemes || [] as scheme, index}
			<Tr
				class={index === schemes?.length - 1 ? '' : '!border-b'}
				on:click={() => {
					onTableRowSelect(scheme, index);
				}}
			>
				<Td class="border-none !px-0"
					><a
						class="flex w-full items-start overflow-hidden text-ellipsis whitespace-pre-wrap align-middle"
						href={normalizeFundName(scheme?.schemeName, scheme?.isin, scheme?.schemeCode)}
					>
						<SchemeLogo src={scheme?.logoUrl} class="h-12 w-12" />
						<div class="flex flex-col">
							<span class="line-clamp-2 text-sm font-normal text-title">{scheme?.schemeName}</span>
						</div>
					</a></Td
				>

				<Td class="flex border-none !pr-0 align-top">
					<span
						class="flex items-center text-base font-medium {scheme?.returns3yr > 0
							? 'text-buy'
							: 'text-title'}"
					>
						{scheme?.returns3yr > 0 ? `${scheme?.returns3yr?.toFixed(2)}%` : '-'}
						<span class="ml-1">
							<WMSIcon
								name="arrow-collapse"
								width={24}
								height={24}
								class="mr-2 rotate-90 p-1"
								stroke="var(--BODY)"
							/>
						</span>
					</span>
				</Td>
			</Tr>
		{/each}
	</TBody>
</Table>
