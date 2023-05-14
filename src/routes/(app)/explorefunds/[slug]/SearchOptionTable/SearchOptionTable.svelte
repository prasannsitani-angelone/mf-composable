<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import SchemeCard from '$components/SchemeCard.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import Table from '$components/Table/Table.svelte';

	import {
		exploreMutualFundMap,
		returnYearTableChangeColumn,
		type TableColumnToggle
	} from '$lib/utils';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import type { ExploreFundsOptions } from '../../types';
	import { fundCardClick } from '../analytics';

	let searchOption: ExploreFundsOptions[];

	const getNavDiffrence = (navValue = 0, previousNavValue = 0) => {
		let navChange = parseFloat(
			(((navValue - previousNavValue) / previousNavValue) * 100)?.toFixed(2)
		);

		if (isNaN(navChange)) {
			navChange = 0;
		}

		let result: string = navChange?.toString();
		if (navChange > 0) {
			result = `+${navChange}`;
		}
		return result;
	};

	let currentYearFilter: TableColumnToggle = {
		label: '3Y Return',
		field: 'returns3yr',
		prefix: '',
		suffix: '%'
	};
	const sortTable = () => {
		currentYearFilter = returnYearTableChangeColumn(currentYearFilter.field, exploreMutualFundMap);
	};

	const onTableRowSelect = (schemes: ExploreFundsOptions) => {
		const replaceState = false;
		fundCardClick({ 'Fund Name': `${schemes?.schemeName}(${schemes?.categoryName})` });
		goto(
			`${base}/${normalizeFundName(
				schemes?.schemeName,
				schemes?.isin,
				schemes?.schemeCode,
				'schemes'
			)}`,
			{ replaceState }
		);
	};

	export { searchOption };
</script>

<Table>
	<THead slot="thead" class="border-t border-grey-line">
		<Th class=" w-8/12 !pr-0 sm:w-5/12">Funds</Th>
		{#if $page?.data?.deviceType?.isBrowser}
			<Th wrapperClass="justify-end sm:justify-center">3Y Return</Th>

			<Th wrapperClass="justify-center">5Y Return</Th>
			<Th wrapperClass="justify-center">Current NAV</Th>
			<Th wrapperClass="justify-center">Min SIP Investments</Th>
		{:else}
			<Th class="!p-0 !pr-1 text-center" sortable isHorizontalSort={true} on:initSort={sortTable}
				>{currentYearFilter.label}</Th
			>
		{/if}
	</THead>
	<TBody slot="tbody">
		{#each searchOption || [] as scheme}
			{@const isNavTrendingUp = scheme?.navValue >= scheme?.previousNavValue}
			<Tr
				class="hover cursor-pointer"
				on:click={() => {
					onTableRowSelect(scheme);
				}}
			>
				<Td class="!pr-0">
					<SchemeCard schemes={scheme} />
				</Td>

				{#if $page?.data?.deviceType?.isBrowser}
					<Td class="text-center">
						{scheme?.returns3yr}%
					</Td>
					<Td class="text-center">
						{scheme?.returns5yr}%
					</Td>
					<Td class="text-center">
						<div
							class="flex flex-col justify-center text-center align-middle text-base font-medium text-black-title md:text-sm"
						>
							<span>₹{scheme?.navValue}</span>
							<span class:text-green-buy={isNavTrendingUp} class:text-red-sell={!isNavTrendingUp}>
								{getNavDiffrence(scheme?.navValue, scheme?.previousNavValue)}%
							</span>
						</div>
					</Td>
					<Td class="text-center">
						₹{scheme?.minSipAmount}
					</Td>
				{:else}
					<Td class="text-center"
						>{`${currentYearFilter.prefix}${scheme[currentYearFilter.field]}${
							currentYearFilter.suffix
						}`}</Td
					>
				{/if}
			</Tr>
		{/each}
	</TBody>
</Table>
