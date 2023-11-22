<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import Link from '$components/Link.svelte';
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

	import type { SameAmcScheme } from '$components/Scheme/types';

	let sameAmcScheme: SameAmcScheme;
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
			section: 'OtherFundsByAMC'
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

		fundNameSelection(eventMetadata, 'SameAMCFundSelect', '301.0.1.1.11');
		goto(
			`${base}/${normalizeFundName(
				schemes?.schemeName,
				schemes?.isin,
				schemes?.schemeCode,
				'schemes'
			)}`
		);
	};
	export { sameAmcScheme, isin, schemeName, returns3yr };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:pb-4">
	<header class="">
		<section
			class="flex cursor-pointer items-center justify-between p-4 !pb-0 pt-6 text-lg md:px-6 md:py-5"
		>
			<section class="flex items-center">
				<h2 class="flex items-center text-left text-base font-medium text-black-title">
					<span>Other Funds by {sameAmcScheme?.amcName}</span>
				</h2>
			</section>
		</section>
	</header>
	<section>
		<div class="mt-3 w-full overflow-x-auto bg-white px-4 md:px-6">
			<Table>
				<THead slot="thead">
					<tr>
						<Th class="text-star h-3 w-9/12 !border-none !pl-0 !normal-case">Fund Name</Th>
						<Th
							class="flex h-3 cursor-pointer justify-end !border-none !pl-0 !pr-0 text-left sm:text-center"
						>
							<Button
								class="flex items-center bg-white !pl-0 pr-0 align-middle !text-xs !font-normal !text-blue-primary hover:bg-white"
								onClick={sortTable}
							>
								<span class="mr-1">{currentYearFilter.label}</span>
								<div class="flex flex-col gap-[2px]">
									<div class="arrow-up" />
									<div class="arrow-down" />
								</div>
							</Button>
						</Th>
					</tr>
				</THead>
				<TBody slot="tbody">
					{#each sameAmcScheme?.schemeInfo || [] as schemes}
						<Tr on:click={() => onTableRowSelect(schemes)}>
							<Td class="!px-0 ">
								<ChipOverview
									headingPrimary={schemes?.categoryName}
									headingSecondary={schemes?.subcategoryName}
								/>
								<Link
									to={`/schemes/${normalizeFundName(
										schemes?.schemeName,
										schemes?.isin,
										schemes?.schemeCode
									)}`}
									class="mt-2 flex items-start items-center justify-between align-middle"
								>
									<SchemeLogo src={schemes?.logoUrl} alt={schemes?.schemeName} class="h-8 w-8" />
									<div class="m-0 mr-auto flex flex-col">
										<h3
											class="block w-full whitespace-pre-wrap text-sm font-normal text-black-title sm:text-sm"
										>
											{schemes?.schemeName}
										</h3>
									</div>
								</Link>
							</Td>
							<Td class="!p-0"
								><div class="flex items-end justify-end">
									<span class="text-base font-normal text-black-title"
										>{schemes[currentYearFilter.field]}%</span
									>
								</div>
							</Td>
						</Tr>
					{/each}
				</TBody>
			</Table>
		</div>
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
