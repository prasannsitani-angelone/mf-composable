<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeCard from '$components/SchemeCard.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import Table from '$components/Table/Table.svelte';
	import { closedNfoTableToggleList, nfoTableToggleList } from '$lib/constants/nfo';
	import type { NFOList } from '$lib/types/INFOList';
	import { type TableColumnToggle, returnYearTableChangeColumn } from '$lib/utils';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';

	let searchOption: NFOList[];
	let clickable = true;
	let isClosedNFO = false;

	let currentYearFilter: TableColumnToggle = {
		label: 'Close Date',
		field: 'nfoEndDate',
		prefix: '',
		suffix: ''
	};

	const sortTable = () => {
		if (isClosedNFO) {
			currentYearFilter = returnYearTableChangeColumn(
				currentYearFilter.field,
				closedNfoTableToggleList
			);
		} else {
			currentYearFilter = returnYearTableChangeColumn(currentYearFilter.field, nfoTableToggleList);
		}
	};

	const onTableRowSelect = (schemes: NFOList) => {
		if (!clickable) {
			return;
		}
		goto(
			`${base}/${normalizeFundName(
				schemes?.schemeName,
				schemes?.isin,
				schemes?.schemeCode,
				'schemes'
			)}`
		);
	};

	export { searchOption, clickable, isClosedNFO };
</script>

<Table class="overflow-hidden !rounded-xl rounded-t {$$props.class}">
	<THead slot="thead" class="rounded-lg rounded-t border-b border-t border-grey-line bg-white">
		<Th class=" w-8/12 !pr-0 font-medium normal-case sm:w-5/12">Funds</Th>
		{#if $page?.data?.deviceType?.isBrowser && !isClosedNFO}
			<Th wrapperClass="justify-end sm:justify-center normal-case">Open Date</Th>

			<Th wrapperClass="justify-center normal-case">Close Date</Th>
			<Th wrapperClass="justify-center normal-case">NAV</Th>
			<Th wrapperClass="justify-center normal-case">Min SIP Investments</Th>
		{:else}
			<div class="ml-auto flex justify-end">
				<Th
					class="flex justify-end border-b border-none"
					sortable
					isHorizontalSort={true}
					on:initSort={sortTable}>{currentYearFilter.label}</Th
				>
			</div>
		{/if}
	</THead>
	<TBody slot="tbody">
		{#each searchOption || [] as scheme}
			<Tr
				class={`${clickable ? 'cursor-pointer sm:hover' : ''} `}
				on:click={() => {
					onTableRowSelect(scheme);
				}}
			>
				<Td class="!pr-0">
					{#if clickable}
						<SchemeCard schemes={scheme}>
							<svelte:fragment slot="arqRating">
								<span />
							</svelte:fragment>
						</SchemeCard>
					{:else}
						<div class="flex items-start justify-between">
							<SchemeLogo size="sm" src={scheme?.logoUrl} alt={scheme?.schemeName} />
							<div class="m-0 mr-auto flex flex-col">
								<ChipOverview
									headingPrimary={scheme?.categoryName}
									headingSecondary={scheme?.subcategoryName}
								/>
								<h3 class="whitespace-normal text-sm font-normal text-black-title md:text-sm">
									{scheme?.schemeName}
								</h3>
								<div class="mt-1 text-xs text-grey-body">{scheme?.reInvestmentPlan}</div>
							</div>
						</div>
					{/if}
				</Td>

				{#if $page?.data?.deviceType?.isBrowser && !isClosedNFO}
					{@const nfoStartDate = getDateTimeString(scheme?.nfoStartDate)}
					{@const nfoEndDate = getDateTimeString(scheme?.nfoEndDate)}
					<Td class="relative text-center">
						<div class="absolute bottom-0 right-0 top-0 flex items-center justify-center sm:w-full">
							<div class="flex items-center">
								<span>{`${nfoStartDate}`}</span>
							</div>
						</div>
					</Td>
					<Td class="relative text-center">
						<div class="absolute bottom-0 right-0 top-0 flex items-center justify-center sm:w-full">
							<div class="flex items-center">
								<span>{`${nfoEndDate}`}</span>
							</div>
						</div>
					</Td>
					<Td class="relative text-center">
						<div class="absolute bottom-0 right-0 top-0 flex items-center justify-center sm:w-full">
							<div class="flex items-center">
								<span>₹{scheme?.navValue}</span>
							</div>
						</div>
					</Td>
					<Td class="relative text-center">
						<div class="absolute bottom-0 right-0 top-0 flex items-center justify-center sm:w-full">
							<div class="flex items-center">
								<span>₹{scheme?.minSipAmount}</span>
							</div>
						</div>
					</Td>
				{:else}
					<Td class="relative !py-0 !pr-0">
						<div class="absolute bottom-0 right-4 top-0 flex">
							<div class="flex items-center">
								{#if currentYearFilter.field.includes('Date')}
									{@const nfoDate = getDateTimeString(scheme[currentYearFilter.field])}

									<span>{`${nfoDate}`}</span>
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
