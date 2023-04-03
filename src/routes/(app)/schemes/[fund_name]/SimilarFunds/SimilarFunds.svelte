<script lang="ts">
	import Button from '$components/Button.svelte';
	import ChipArqRating from '$components/ChipArqRating.svelte';
	import Table from '$components/Table/Table.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Td from '$components/Table/TD.svelte';
	import Th from '$components/Table/TH.svelte';
	import THead from '$components/Table/THead.svelte';
	import Tr from '$components/Table/TR.svelte';
	import SimilarFundsIcon from '$lib/images/icons/SimilarFundsIcon.svelte';
	import { returnYearTableChangeColumn, yearlyReturnMap, type TableColumnToggle } from '$lib/utils';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';

	import type { OtherSchemeEntityOrSchemeInfoEntity } from '../types';

	let similarFunds: OtherSchemeEntityOrSchemeInfoEntity[];
	let currentYearFilter: TableColumnToggle = {
		label: '3Y Return',
		field: 'returns3yr'
	};
	const sortTable = () => {
		currentYearFilter = returnYearTableChangeColumn(currentYearFilter.field, yearlyReturnMap);
	};

	export { similarFunds };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm">
	<header class="mb-6 border border-b border-grey-line">
		<section
			class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
		>
			<section class="flex items-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
					<SimilarFundsIcon />
					<!-- {JSON.stringify(similarFunds)} -->
				</div>
				<h2 class="ml-3 flex items-center text-left font-medium text-black-title">
					<span> Similar Funds</span>
				</h2>
			</section>
		</section>
	</header>
	<section>
		<Table>
			<THead slot="thead" class="border-t">
				<Th class="text-star w-3/5  sm:w-2/3">Funds</Th>
				<Th class="text-center opacity-0 sm:opacity-100">ARQ Rating</Th>
				<Th class="cursor-pointer !pl-0 text-left sm:!pl-5 sm:text-center">
					<Button
						class="flex items-center bg-white !pl-0 align-middle !text-grey-body hover:bg-white sm:pl-5"
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
			</THead>
			<TBody slot="tbody">
				{#each similarFunds as funds}
					<Tr class="border-b border-grey-line">
						<Td class=""
							><a
								class="block w-full overflow-hidden text-ellipsis whitespace-pre-wrap"
								href={normalizeFundName(funds.schemeName, funds.isin, funds.schemeCode)}
								>{funds.schemeName}</a
							></Td
						>
						<Td class="flex items-center justify-center border-none">
							<ChipArqRating arqRating={funds.arqRating} />
						</Td>
						<Td class="text-center"><span>{funds[currentYearFilter.field]}</span></Td>
					</Tr>
				{/each}
			</TBody>
		</Table>
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
