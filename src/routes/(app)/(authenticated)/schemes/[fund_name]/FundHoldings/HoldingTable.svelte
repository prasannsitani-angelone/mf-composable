<script lang="ts">
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import Table from '$components/Table/Table.svelte';
	import type { TopHolding } from '$components/Scheme/types';
	import type { SectorHoldings } from '$lib/types/ISchemeDetails';
	import { getStockInfo } from '$lib/api/scheme';
	import { callNativeMethod, checkNativeMethodExist } from '$lib/utils/callNativeMethod';
	import { page } from '$app/stores';
	import { WMSIcon } from 'svelte-components';

	let holdings: TopHolding[];
	let sectorHoldings: SectorHoldings[];
	let activeTab: string;
	let topHolding = false;
	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;

	const gotoStockInfo = async (holding: TopHolding) => {
		const stockInfo = await getStockInfo(holding.scripIsin);
		if (stockInfo?.isin && checkNativeMethodExist('openNativeScreen')) {
			if (os === 'iOS') {
				callNativeMethod(
					'openNativeScreen',
					JSON.stringify({ screenName: 'StockOverView', data: stockInfo })
				);
			} else if (os === 'Android') {
				callNativeMethod('openNativeScreen', 'StockOverView', JSON.stringify({ ...stockInfo }));
			}
		}
	};

	export { holdings, topHolding, sectorHoldings, activeTab };
</script>

<Table>
	<THead slot="thead">
		<Th class="h-3 w-3/5 !border-none !pl-0 text-xs normal-case">
			{activeTab === 'holdingCompany' ? 'Holding Name' : 'Sector Name'}
		</Th>
		<Th class="flex h-3 justify-end !border-none !pr-0 text-right text-xs normal-case"
			>Allocation</Th
		>
	</THead>
	<TBody slot="tbody">
		{#if activeTab === 'holdingCompany' && holdings?.length}
			{#each holdings as holding}
				<Tr class="!last:border-none !border-b" on:click={() => gotoStockInfo(holding)}>
					<Td class="border-none !pl-0">
						{#if topHolding}
							<div class="flex flex-col whitespace-normal text-sm font-medium text-title">
								<div>
									{holding.companyName}
								</div>
								<div class="text-xs font-normal text-body">
									{holding.sector}
								</div>
							</div>
						{:else}
							<div
								class="flex flex-col items-start whitespace-normal text-sm font-medium text-title"
							>
								<div>
									{holding.companyName}
								</div>
								<div class="text-xs font-normal text-body">
									{holding.sector}
								</div>
							</div>
						{/if}
					</Td>
					<Td
						class="flex items-center justify-end border-none !pr-0 text-right text-sm font-medium !text-title"
						>{holding.percentageHold}%{#if os === 'iOS' || os === 'Android'}<WMSIcon
								class="pl-1"
								name="right-arrow"
								stroke="var(--PRIMARY)"
							/>{/if}</Td
					>
				</Tr>
			{/each}
		{:else if activeTab === 'sector' && sectorHoldings?.length}
			{#each sectorHoldings as holding}
				<Tr class="!last:border-none !border-b">
					<Td class="!border-none !pl-0">
						{#if topHolding}
							<div class="flex flex-col whitespace-normal text-sm font-medium text-title">
								<div>
									{holding.sector}
								</div>
							</div>
						{:else}
							<div
								class="flex flex-col items-start whitespace-normal text-sm font-medium text-title"
							>
								<div>
									{holding.sector}
								</div>
							</div>
						{/if}
					</Td>
					<Td class="mr-4 !border-none !pr-0 text-right text-sm font-medium !text-title"
						>{holding.percentage}%</Td
					>
				</Tr>
			{/each}
		{/if}
	</TBody>
</Table>
