<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import Table from '$components/Table/Table.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { returnYearTableChangeColumn, yearlyReturnMap, type TableColumnToggle } from '$lib/utils';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';

	import {
		fundNameSelection,
		sortbyReturnYear,
		type ISortbyReturnYear,
		type IFundNameSelection
	} from '$components/Scheme/analytics';

	import type { OtherSchemeEntityOrSchemeInfoEntity } from '$components/Scheme/types';

	let similarFunds: OtherSchemeEntityOrSchemeInfoEntity[];
	let currentYearFilter: TableColumnToggle = {
		label: '3Y Return',
		field: 'returns3yr'
	};
	let isin: string;
	let schemeName: string;
	let returns3yr: number;
	const sortTable = () => {
		currentYearFilter = returnYearTableChangeColumn(currentYearFilter.field, yearlyReturnMap);
		const eventMetadata: ISortbyReturnYear = {
			ReturnYear: currentYearFilter.label,
			ISIN: isin,
			FundName: schemeName,
			section: 'Similar Funds'
		};

		sortbyReturnYear(eventMetadata);
	};
	const onTableRowSelect = (schemes: SchemeDetails) => {
		const eventMetadata: IFundNameSelection = {
			selectedISIN: schemes?.isin,
			selectedFund3YReturn: schemes?.returns3yr,
			currentISIN: isin,
			currentFund3YReturn: returns3yr
		};

		fundNameSelection(eventMetadata, 'SimilarFundSelect', '301.0.1.1.10');
		goto(
			`${base}/${normalizeFundName(
				schemes?.schemeName,
				schemes?.isin,
				schemes?.schemeCode,
				'schemes'
			)}`
		);
	};
	export { similarFunds, isin, schemeName, returns3yr };
</script>

<article class="mt-2 max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm md:mt-4">
	<header>
		<section class="flex cursor-pointer items-center justify-between px-4 pt-6 text-lg">
			<section class="flex items-center">
				<h2 class="flex items-center text-left text-base font-medium text-title">
					<span> Similar Funds</span>
				</h2>
			</section>
		</section>
	</header>
	<section class="mt-3 px-4 md:px-6">
		<Table>
			<THead slot="thead">
				<Th class="h-3 w-9/12  !border-none  !pl-0 text-start !normal-case sm:w-2/3">Fund Name</Th>

				<Th
					class="flex  h-3 cursor-pointer justify-end border-b !border-none bg-background-alt py-0 !pl-0 !pr-0 text-left font-normal text-body sm:!pl-5 sm:text-center"
				>
					<Button
						variant="transparent"
						class="flex justify-items-end bg-background-alt !pl-0 !pr-0 align-middle !text-xs !font-normal !text-primary hover:bg-background-alt"
						onClick={sortTable}
					>
						<span class="mr-1">{currentYearFilter.label}</span>
						<div class="flex flex-col gap-[2px]">
							<div class="arrow-up" />
							<div class="arrow-down" />
						</div>
					</Button>
				</Th>
			</THead>
			<TBody slot="tbody">
				{#each similarFunds || [] as funds}
					<Tr
						class="!border-b last:border-none"
						on:click={() => {
							onTableRowSelect(funds);
						}}
					>
						<Td class="border-none !px-0"
							><a
								class="flex w-full items-center overflow-hidden text-ellipsis whitespace-pre-wrap align-middle"
								href={normalizeFundName(funds.schemeName, funds.isin, funds.schemeCode)}
							>
								<SchemeLogo src={funds?.logoUrl} class="h-8 w-8" />
								<span class="line-clamp-2 text-sm font-normal text-title">{funds.schemeName}</span>
							</a></Td
						>

						<Td class="border-none !pr-0 text-right"
							><span class="text-base font-normal text-title"
								>{funds[currentYearFilter.field]}%</span
							></Td
						>
					</Tr>
				{/each}
			</TBody>
		</Table>
	</section>
</article>

<style>
	.arrow-down {
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;

		border-top: 4px solid #3f5bd9;
	}
	.arrow-up {
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;

		border-bottom: 4px solid #3f5bd9;
	}
</style>
