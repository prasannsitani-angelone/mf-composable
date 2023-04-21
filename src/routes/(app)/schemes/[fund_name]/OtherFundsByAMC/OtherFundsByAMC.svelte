<script lang="ts">
	import Button from '$components/Button.svelte';
	import ChipArqRating from '$components/ChipArqRating.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import Link from '$components/Link.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import Table from '$components/Table/Table.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import OtherFundsIcon from '$lib/images/icons/OtherFundsIcon.svelte';
	import RightArrow from '$lib/images/icons/RightArrow.svelte';
	import { returnYearTableChangeColumn, yearlyReturnMap, type TableColumnToggle } from '$lib/utils';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';

	import type { SameAmcScheme } from '../types';

	let sameAmcScheme: SameAmcScheme;
	let currentYearFilter: TableColumnToggle = {
		label: '3Y Return',
		field: 'returns3yr'
	};
	const sortTable = () => {
		currentYearFilter = returnYearTableChangeColumn(currentYearFilter.field, yearlyReturnMap);
	};

	export { sameAmcScheme };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm">
	<header class="">
		<section
			class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
		>
			<section class="flex items-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
					<OtherFundsIcon />
				</div>
				<h2 class="ml-3 flex items-center text-left font-medium text-black-title">
					<span>Other Funds by {sameAmcScheme?.amcName}</span>
				</h2>
			</section>
		</section>
	</header>
	<section>
		<div class="w-full overflow-x-auto bg-white md:px-6">
			<Table>
				<THead slot="thead">
					<tr class="border-x border-t border-x-grey-line">
						<Th class="text-star w-2/3  sm:w-4/5">Funds</Th>
						<Th
							class="flex cursor-pointer justify-end !pl-0 !pr-0 text-left sm:!pl-5 sm:!pr-5 sm:text-center"
						>
							<Button
								class="flex items-center bg-white !pl-0 align-middle !text-grey-body hover:bg-white sm:pl-5 sm:!pr-0"
								onClick={sortTable}
							>
								<span class="mr-1">{currentYearFilter.label}</span>
								<div class="flex flex-row gap-[2px]">
									<span class="table-icon v-table-left-icon" /><span
										class="table-icon v-table-right-icon"
									/>
								</div>
							</Button>
						</Th>
					</tr>
				</THead>
				<TBody slot="tbody">
					{#each sameAmcScheme?.schemeInfo || [] as schemes}
						<Tr class="border-x border-b border-grey-line border-x-grey-line ">
							<Td class="!pr-0"
								><a
									class="block w-full overflow-hidden text-ellipsis whitespace-pre-wrap"
									href={normalizeFundName(schemes.schemeName, schemes.isin, schemes.schemeCode)}
								>
									<Link
										to={`/schemes/${normalizeFundName(
											schemes?.schemeName,
											schemes?.isin,
											schemes?.schemeCode
										)}`}
										class="flex items-start justify-between"
									>
										<SchemeLogo src={schemes?.logoUrl} alt={schemes?.schemeName} />
										<div class="m-0 mr-auto flex flex-col">
											<ChipOverview
												headingPrimary={schemes?.categoryName}
												headingSecondary={schemes?.subcategoryName}
											/>
											<h3
												class="block w-full whitespace-pre-wrap text-base font-medium text-black-title sm:text-sm"
											>
												{schemes?.schemeName}
											</h3>
											<div class="mt-1 flex">
												<ChipArqRating arqRating={schemes?.arqRating} />
												<div
													class="ml-1 bg-grey px-1 group-hover:border group-hover:border-grey-line group-hover:bg-white"
												>
													<span class="text-xs text-grey-body">{schemes?.reInvestmentPlan}</span>
												</div>
											</div>
										</div>
									</Link>
								</a></Td
							>
							<Td class="!pr-2 sm:!pr-5"
								><div class="flex items-end justify-end">
									<span>{schemes[currentYearFilter.field]} %</span>
									<RightArrow />
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
	.table-icon {
		display: inline-block;
		vertical-align: middle;
		width: 0;
		height: 0;
	}

	.v-table-left-icon {
		border-top: 4px solid transparent;
		border-bottom: 4px solid transparent;
		border-right: 4px solid #2a394e;
	}

	.v-table-right-icon {
		border-top: 4px solid transparent;
		border-bottom: 4px solid transparent;
		border-left: 4px solid #2a394e;
	}
</style>
