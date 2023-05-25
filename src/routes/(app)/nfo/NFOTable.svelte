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
	import type { NFOList } from '$lib/types/INFOList';
	import {
		type TableColumnToggle,
		nfoTableToggleList,
		returnYearTableChangeColumn
	} from '$lib/utils';
	import { getDateTimeProperties } from '$lib/utils/helpers/date';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';

	let searchOption: NFOList[];

	let currentYearFilter: TableColumnToggle = {
		label: 'Open Date',
		field: 'nfoStartDate',
		prefix: '',
		suffix: ''
	};

	const sortTable = () => {
		currentYearFilter = returnYearTableChangeColumn(currentYearFilter.field, nfoTableToggleList);
	};

	const onTableRowSelect = (schemes: NFOList) => {
		goto(
			`${base}/${normalizeFundName(
				schemes?.schemeName,
				schemes?.isin,
				schemes?.schemeCode,
				'schemes'
			)}`
		);
	};

	export { searchOption };
</script>

<Table class="overflow-hidden rounded-t {$$props.class}">
	<THead slot="thead" class="rounded-t border-t border-grey-line">
		<Th class=" w-8/12 !pr-0 sm:w-5/12">Funds</Th>
		{#if $page?.data?.deviceType?.isBrowser}
			<Th wrapperClass="justify-end sm:justify-center">Open Date</Th>

			<Th wrapperClass="justify-center">Close Date</Th>
			<Th wrapperClass="justify-center">NAV</Th>
			<Th wrapperClass="justify-center">Min SIP Investments</Th>
		{:else}
			<Th class="!p-0 !pr-1 text-center  " sortable isHorizontalSort={true} on:initSort={sortTable}
				>{currentYearFilter.label}</Th
			>
		{/if}
	</THead>
	<TBody slot="tbody">
		{#each searchOption || [] as scheme}
			<Tr
				class="cursor-pointer sm:hover"
				on:click={() => {
					onTableRowSelect(scheme);
				}}
			>
				<Td class="!pr-0">
					<SchemeCard schemes={scheme} />
				</Td>

				{#if $page?.data?.deviceType?.isBrowser}
					{@const nfoStartDate = getDateTimeProperties(scheme?.nfoStartDate)}
					{@const nfoEndDate = getDateTimeProperties(scheme?.nfoEndDate)}
					<Td class="relative text-center">
						<div class="absolute top-0 bottom-0 right-0 flex items-center justify-center sm:w-full">
							<div class="flex items-center">
								<span>{`${nfoStartDate.date} ${nfoStartDate.month} ${nfoStartDate.year}`}</span>
							</div>
						</div>
					</Td>
					<Td class="relative text-center">
						<div class="absolute top-0 bottom-0 right-0 flex items-center justify-center sm:w-full">
							<div class="flex items-center">
								<span>{`${nfoEndDate.date} ${nfoEndDate.month} ${nfoEndDate.year}`}</span>
							</div>
						</div>
					</Td>
					<Td class="relative text-center">
						<div class="absolute top-0 bottom-0 right-0 flex items-center justify-center sm:w-full">
							<div class="flex items-center">
								<span>₹{scheme?.navValue}</span>
							</div>
						</div>
					</Td>
					<Td class="relative text-center">
						<div class="absolute top-0 bottom-0 right-0 flex items-center justify-center sm:w-full">
							<div class="flex items-center">
								<span>₹{scheme?.minSipAmount}</span>
							</div>
						</div>
					</Td>
				{:else}
					<Td class="relative !py-0 !pr-0">
						<div class="absolute top-0 bottom-0 right-4 flex">
							<div class="flex items-center">
								{#if currentYearFilter.field.includes('Date')}
									{@const nfoDate = getDateTimeProperties(scheme[currentYearFilter.field])}

									<span>{`${nfoDate.date} ${nfoDate.month} ${nfoDate.year}`}</span>
								{:else}
									<span
										>{`${currentYearFilter.prefix}${scheme[currentYearFilter.field]}${
											currentYearFilter.suffix
										}`}</span
									>
								{/if}
							</div>
						</div>
					</Td>
				{/if}
			</Tr>
		{/each}
	</TBody>
</Table>
