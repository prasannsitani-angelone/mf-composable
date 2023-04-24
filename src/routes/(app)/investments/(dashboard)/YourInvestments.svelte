<script lang="ts">
	import { goto } from '$app/navigation';
	import type { InvestmentEntity } from '$lib/types/IInvestments';
	import ActiveSipIcon from '$lib/images/icons/ActiveSipIcon.svelte';
	import Table from '$components/Table/Table.svelte';
	import THead from '$components/Table/THead.svelte';
	import Th from '$components/Table/TH.svelte';
	import Td from '$components/Table/TD.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeCard from '$components/SchemeCard.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	const sortColumn = (event: {
		detail: { sortType: string; sortField: keyof InvestmentEntity };
	}) => {
		const sortType: string = event.detail.sortType;
		const field: keyof InvestmentEntity = event.detail.sortField;
		tableDataToDisplay = tableDataToDisplay.sort((a: InvestmentEntity, b: InvestmentEntity) =>
			sortType === 'asc' ? (a[field] > b[field] ? 1 : -1) : a[field] < b[field] ? 1 : -1
		);
	};

	let tableData: Array<InvestmentEntity>;

	let tableDataToDisplay = [...tableData];

	export { tableData };

	const handleRowClick = (selectedRow: InvestmentEntity) => {
		try {
			goto(
				`./investments/${normalizeFundName(
					selectedRow?.schemeName,
					selectedRow?.isin,
					selectedRow?.schemeCode
				)}`,
				{ replaceState: false }
			);
		} catch (error) {
			//TODO: Add Logger
		}
	};
</script>

<section class="max-w-4xl rounded-lg bg-white text-sm shadow-csm">
	<header class="flex flex-col p-4 md:px-6 md:py-5">
		<h2 class="text-lg font-medium text-black-title">Your Investments</h2>
	</header>
	<Table>
		<THead slot="thead" class="border-t">
			<Th class="w-[40%] text-start capitalize max-sm:w-[70%] max-sm:pr-1 max-sm:pl-4">Fund Name</Th
			>
			<Th
				class="justify-center text-center capitalize max-sm:pl-1 max-sm:pr-4 max-sm:text-right"
				wrapperClass="justify-center"
				sortable
				sortField="currentValue"
				on:initSort={sortColumn}>Current Value</Th
			>
			<Th
				class="justify-center text-center capitalize max-sm:hidden"
				wrapperClass="justify-center"
				sortable
				sortField="investedValue"
				on:initSort={sortColumn}>Invested</Th
			>
			<Th
				class="justify-center text-center capitalize max-sm:hidden"
				wrapperClass="justify-center"
				sortable
				sortField="returnsValue"
				on:initSort={sortColumn}>Returns</Th
			>
		</THead>
		<TBody slot="tbody">
			{#each tableDataToDisplay as schemes}
				<tr class="hover cursor-pointer" on:click={() => handleRowClick(schemes)}
					><Td class="w-[40%] whitespace-normal max-sm:w-[70%] max-sm:pr-1 max-sm:pl-4">
						<SchemeCard
							{schemes}
							class="items-center"
							preventRedirectOnSchemeClick={true}
							redirectUrl={`/investments/${normalizeFundName(
								schemes?.schemeName,
								schemes?.isin,
								schemes?.schemeCode
							)}`}
							><svelte:fragment slot="chip-overview">
								<ChipOverview
									class="mb-1 border-b-0 pb-0 sm:text-xs"
									headingPrimary={schemes?.sipEnabled ? 'SIP Active' : ''}
									headingSecondary={schemes?.schemePlan && schemes?.schemePlan?.length
										? schemes?.schemePlan
										: ''}
								>
									<svelte:fragment slot="categoryNameIcon">
										{#if schemes?.sipEnabled}
											<ActiveSipIcon class="mr-1" />
										{/if}
									</svelte:fragment>
								</ChipOverview>
							</svelte:fragment>
							<svelte:fragment slot="rating"><span /></svelte:fragment></SchemeCard
						>
					</Td>
					<Td class="text-center max-sm:pl-1 max-sm:pr-4 max-sm:text-right"
						><div class="text-black-title">
							₹{schemes?.currentValue?.toString()
								? addCommasToAmountString(schemes?.currentValue?.toFixed(2)?.toString())
								: '-'}
						</div></Td
					>
					<Td class="text-center max-sm:hidden"
						><div class="text-black-title">
							₹{schemes?.investedValue?.toString()
								? addCommasToAmountString(schemes?.investedValue?.toFixed(2)?.toString())
								: '-'}
						</div></Td
					>
					<Td class="text-center max-sm:hidden"
						><article class="text-black-title lg:text-center">
							<div>
								₹{schemes?.returnsValue?.toString()
									? addCommasToAmountString(Math.abs(schemes?.returnsValue)?.toFixed(2)?.toString())
									: '-'}
							</div>
							<div
								class={`${schemes?.returnsAbsolutePer < 0 ? 'text-red-sell' : 'text-green-buy'}`}
							>
								{schemes?.returnsAbsolutePer > 0 ? '+' : ''}{schemes?.returnsAbsolutePer?.toString()
									? schemes?.returnsAbsolutePer?.toFixed(2)
									: '-'}%
							</div>
						</article></Td
					></tr
				>
			{/each}
		</TBody>
	</Table>
</section>
