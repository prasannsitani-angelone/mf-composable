<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
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
	import { partialImportCheck } from '../utils';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { investmentRowClickAnalytics } from '../analytics';

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isExternal = $page?.data?.isExternal;

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
		const dParam = `${isExternal ? '/external' : ''}`;
		if (isExternal) {
			const meteData = { FundName: selectedRow.schemeName, CurrentValue: selectedRow.currentValue };
			investmentRowClickAnalytics(meteData);
		}
		try {
			goto(
				`./investments/${
					normalizeFundName(selectedRow?.schemeName, selectedRow?.isin, selectedRow?.schemeCode) +
					dParam
				}`,
				{ replaceState: false }
			);
		} catch (error) {
			//TODO: Add Logger
		}
	};

	const isPartialImport = (scheme: InvestmentEntity) => {
		return isExternal && partialImportCheck(scheme);
	};
</script>

<section class="max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm">
	<Table>
		<THead slot="thead" class="border-t">
			<Th class="w-[40%] text-start capitalize max-sm:w-[63%] max-sm:pl-4 max-sm:pr-1">Fund Name</Th
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
			<Th class="w-6 !pr-0 pl-0 max-sm:w-[7%] sm:w-8  sm:!pr-0" />
		</THead>
		<TBody slot="tbody">
			{#each tableDataToDisplay as schemes}
				<tr class="hover cursor-pointer" on:click={() => handleRowClick(schemes)}
					><Td
						class={`w-[40%] whitespace-normal max-sm:w-[70%] max-sm:pl-4 max-sm:pr-1 ${
							isPartialImport(schemes) ? '!border-b-0' : ''
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
							)}${isExternal ? '/external' : ''}`}
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
					<Td
						class={`text-center max-sm:pl-1 max-sm:pr-0 max-sm:text-right ${
							isPartialImport(schemes) ? '!border-b-0' : ''
						}`}
						>{#if isPartialImport(schemes)}
							<article class="text-title max-sm:mr-1 lg:text-center">- -</article>
						{:else}<div class="text-title">
								₹{schemes?.currentValue?.toString()
									? addCommasToAmountString(schemes?.currentValue?.toFixed(2)?.toString())
									: '-'}
							</div>{/if}</Td
					>
					<Td class={`text-center max-sm:hidden ${isPartialImport(schemes) ? '!border-b-0' : ''}`}>
						{#if isPartialImport(schemes)}
							<article class="text-title lg:text-center">- -</article>
						{:else}
							<div class="text-title">
								₹{schemes?.investedValue?.toString()
									? addCommasToAmountString(schemes?.investedValue?.toFixed(2)?.toString())
									: '-'}
							</div>
						{/if}</Td
					>
					<Td
						class={`!pr-4 text-center max-sm:hidden ${
							isPartialImport(schemes) ? '!border-b-0' : ''
						}`}
					>
						{#if isPartialImport(schemes)}
							<article class=" text-title lg:text-right">- -</article>
						{:else}
							<article class="text-title lg:text-right">
								<div>
									₹{schemes?.returnsValue?.toString()
										? addCommasToAmountString(
												Math.abs(schemes?.returnsValue)?.toFixed(2)?.toString()
										  )
										: '-'}
								</div>
								<div class={`${schemes?.returnsAbsolutePer < 0 ? 'text-sell' : 'text-buy'}`}>
									{schemes?.returnsAbsolutePer > 0
										? '+'
										: ''}{schemes?.returnsAbsolutePer?.toString()
										? schemes?.returnsAbsolutePer?.toFixed(2)
										: '-'}%
								</div>
							</article>
						{/if}
					</Td>
					<Td
						class={`max-sm:align-right !pl-0 !pr-0 max-sm:pr-0 ${
							isPartialImport(schemes) ? '!border-b-0' : ''
						}`}><div><RightIcon width="22" height="27" class="inline-block" /></div></Td
					></tr
				>
				{#if isPartialImport(schemes)}
					<tr>
						<td colspan={5} class="whitespace-pre-wrap pb-3 pt-0"
							><div
								class={` flex items-center rounded-lg bg-background px-2 py-1 sm:items-start sm:px-3`}
							>
								<div class="mr-3">
									<div class="icon-container">
										<WMSIcon name="polygon-red-warning" width={16} height={16} />
									</div>
								</div>

								<div class="text-xs text-title">
									We are facing some technical issues identifying this investment
								</div>
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		</TBody>
	</Table>
</section>

<style>
	.icon-container {
		width: 16px;
		height: 16px;
	}
</style>
