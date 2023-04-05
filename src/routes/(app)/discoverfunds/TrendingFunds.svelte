<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import Link from '$lib/components/Link.svelte';
	import Table from '$components/Table/Table.svelte';
	import THead from '$components/Table/THead.svelte';
	import Th from '$components/Table/TH.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import ChipArqRating from '$components/ChipArqRating.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';

	const trendingTable = {
		col: ['Funds', '3Y return', 'Min SIP Invetsments']
	};
	let tableData: Array<WeeklyTopSchemesEntity>;

	export { tableData };
</script>

<section class="mt-2 max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:mt-4">
	<header class="flex flex-col p-6">
		<h2 class="text-lg font-medium text-black-title">Popular With Other Investors</h2>
	</header>
	<Table class=" sm:block">
		<THead slot="thead" class="border-t">
			<Th class="text-start">Funds</Th>
			<Th class="text-center">3Y return</Th>
			<Th class="pl-0">Min SIP Invetsments</Th>
		</THead>
		<TBody slot="tbody">
			{#each tableData || [] as schemes}
				<tr class="hover"
					><Th class="w-[30%]">
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
									categoryName={schemes?.categoryName}
									subCategoryName={schemes?.subcategoryName}
								/>
								<h3 class="text-base font-medium text-black-title sm:text-sm">
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
					</Th>
					<Th class="text-center">{schemes?.returns3yr}%</Th>
					<Th class="text-center">{schemes?.minSipAmount}</Th></tr
				>
			{/each}
		</TBody>
	</Table>
</section>
