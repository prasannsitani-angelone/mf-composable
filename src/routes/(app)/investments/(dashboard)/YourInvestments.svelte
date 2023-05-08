<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { WMSIcon } from 'wms-ui-component';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
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

	$: isMobile = $page?.data?.deviceType?.isMobile;

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

	const isPartialImport = (scheme: InvestmentEntity) => {
		return scheme?.externalFundImportStatus === 'FAILED';
	};
</script>

<section class="max-w-4xl rounded-lg bg-white text-sm shadow-csm">
	<Table>
		<THead slot="thead" class="border-t">
			<Th class="w-[40%] text-start capitalize max-sm:w-[63%] max-sm:pr-1 max-sm:pl-4">Fund Name</Th
			>
			<Th
				class="justify-center text-center capitalize max-sm:w-[30%] max-sm:pl-1 max-sm:pr-0 max-sm:text-right"
				wrapperClass="sm:justify-center justify-end max-sm:w-full"
				sortable={isMobile ? false : true}
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
				class="justify-center !pr-4 text-center capitalize max-sm:hidden"
				wrapperClass="justify-end w-full"
				sortable
				sortField="returnsValue"
				on:initSort={sortColumn}>Returns</Th
			>
			<Th class="w-6 pl-0 !pr-0 max-sm:w-[7%] sm:w-8  sm:!pr-0" />
		</THead>
		<TBody slot="tbody">
			{#each tableDataToDisplay as schemes}
				<tr class="hover relative cursor-pointer" on:click={() => handleRowClick(schemes)}
					><Td
						class={`w-[40%] whitespace-normal max-sm:w-[70%] max-sm:pr-1 max-sm:pl-4 ${
							isPartialImport(schemes) ? 'pb-16 sm:pb-12' : ''
						}`}
					>
						<SchemeCard
							{schemes}
							class="items-center"
							titleClass="!text-sm"
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
						{#if isPartialImport(schemes)}
							<section
								class={`absolute bottom-4 left-0 right-0 mt-2 ml-4 mr-2 flex items-center rounded-lg bg-blue-background px-2 py-1 sm:ml-5 sm:mr-4 sm:items-start sm:px-3`}
							>
								<div class="mr-3">
									<WMSIcon name="polygon-red-warning" width={16} height={16} />
								</div>

								<div class="text-xs text-black-title">
									We are facing some technical issues identifying this investment
								</div>
							</section>
						{/if}
					</Td>
					<Td
						class={`text-center max-sm:pl-1 max-sm:pr-0 max-sm:text-right ${
							isPartialImport(schemes) ? 'pb-16 sm:pb-12' : ''
						}`}
						><div class="text-black-title">
							₹{schemes?.currentValue?.toString()
								? addCommasToAmountString(schemes?.currentValue?.toFixed(2)?.toString())
								: '-'}
						</div></Td
					>
					<Td
						class={`text-center max-sm:hidden ${isPartialImport(schemes) ? 'pb-16 sm:pb-12' : ''}`}
						><div class="text-black-title">
							₹{schemes?.investedValue?.toString()
								? addCommasToAmountString(schemes?.investedValue?.toFixed(2)?.toString())
								: '-'}
						</div></Td
					>
					<Td
						class={`!pr-4 text-center max-sm:hidden ${
							isPartialImport(schemes) ? 'pb-16 sm:pb-12' : ''
						}`}
						><article class="text-black-title lg:text-right">
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
					>
					<Td
						class={`max-sm:align-right !pl-0 !pr-0 max-sm:pr-0 ${
							isPartialImport(schemes) ? 'pb-16 sm:pb-12' : ''
						}`}><div><RightIcon width="22" height="27" class="inline-block" /></div></Td
					></tr
				>
			{/each}
		</TBody>
	</Table>
</section>
