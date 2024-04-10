<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type {
		IOPtimsiePortfolioData,
		InvestmentEntity,
		InvestmentSummary
	} from '$lib/types/IInvestments';
	import ActiveSipIcon from '$lib/images/icons/ActiveSipIcon.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import { partialImportCheck } from '../utils';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import {
		fundForYouClickAnalytics,
		holdingClickAnalytics,
		investmentRowClickAnalytics
	} from '../analytics';
	import Card from '$components/Card.svelte';
	import Link from '$components/Link.svelte';
	import PageFilter from './components/PageFilter.svelte';
	import type { ToggleButtonParam } from '$lib/types/IInvestments';
	import { filterToggleButtonClickEvent, xirrFilterClickEvent } from './analytics';
	import OptimisePortfolioCard from './components/OptimisePortfolioCard.svelte';
	import { WMSIcon } from 'svelte-components';
	import OptimisePortfolioModal from './components/OptimisePortfolioModal.svelte';
	import { familyStore } from '$lib/stores/FamilyStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import XirrModal from './components/Internal/XirrModal.svelte';

	const isFamilyPortfolio = familyStore?.isFamilyPortfolio($profileStore?.clientId);
	$: isExternal = $page?.data?.isExternal;

	export let isXIRRModalOpen = false;
	export let isOptimisePortfolioOpen = false;
	export let optimisePorfolioData: IOPtimsiePortfolioData;
	export let investmentSummary: InvestmentSummary;

	let activeFilter = 'absolute';

	const onXirrClick = () => {
		isXIRRModalOpen = true;
		xirrFilterClickEvent();
	};

	const onFilterButtonToggle = (data: ToggleButtonParam) => {
		activeFilter = data.id;
		filterToggleButtonClickEvent({ toggle: activeFilter });
	};

	let tableData: Array<InvestmentEntity>;
	let holdings: Array<InvestmentEntity>;
	holdings = tableData;
	let tableDataToDisplay = [...tableData];
	$: tableDataToDisplay = [...tableData];
	const optimisedScheme = tableDataToDisplay?.find((x) => x.sipEnabled) || ({} as InvestmentEntity);

	export { tableData, holdings };

	const handleRowClick = (selectedRow: InvestmentEntity) => {
		if (isFamilyPortfolio) {
			return;
		}

		const dParam = `${
			isExternal ? '-rtaSchemeCode-' + selectedRow?.rtaSchemeCode + '/external' : ''
		}`;
		if (isExternal) {
			const meteData = { FundName: selectedRow.schemeName, CurrentValue: selectedRow.currentValue };
			investmentRowClickAnalytics(meteData);
		} else {
			const meteData = {
				FundName: selectedRow.schemeName,
				CurrentValue: selectedRow.currentValue,
				'Invested amount': selectedRow?.investedValue,
				Returns: `${selectedRow?.returnsValue}(${selectedRow?.returnsAbsolutePer})`
			};
			holdingClickAnalytics(meteData);
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
			console.error('API responded with Error - ', error);
		}
	};

	const isPartialImport = (scheme: InvestmentEntity) => {
		return isExternal && partialImportCheck(scheme);
	};

	const toggleXirrModal = () => {
		isXIRRModalOpen = !isXIRRModalOpen;
	};

	const toggleOptimisePorfolioCard = (flag: boolean) => {
		isOptimisePortfolioOpen = flag;
		if (flag) {
			fundForYouClickAnalytics({
				'Current Value': investmentSummary?.currentValue,
				'Total Investment': investmentSummary?.investedValue,
				'Overall Gain': `${investmentSummary?.returnsValue}(${investmentSummary?.returnsAbsolutePer}%)`,
				'Todays Loss': `${investmentSummary?.previousDayReturns}(${investmentSummary?.previousDayReturnPercentage}%)`,
				'Fund Name': tableDataToDisplay?.[0]?.schemeName
			});
		}
	};
</script>

<section class="overflow-hidden rounded-b-xl sm:shadow-csm">
	{#if optimisePorfolioData?.schemeCode && optimisePorfolioData?.schemeName && optimisePorfolioData?.isin}
		<OptimisePortfolioCard
			on:click={() => toggleOptimisePorfolioCard(true)}
			currentSchemeLogo={optimisePorfolioData?.firstSchemeLogoUrl || ''}
			peopleInvested={optimisePorfolioData?.clientWithMultipleSips}
			class="block sm:hidden"
		/>
	{/if}
	{#if !isExternal && !isFamilyPortfolio}
		<section data-testid="investmentFilterContainer" class={optimisePorfolioData ? 'mt-2' : ''}>
			<PageFilter
				{onXirrClick}
				onFilterButtonClick={onFilterButtonToggle}
				activeSelection={activeFilter}
			/>
		</section>
	{/if}
	<section>
		{#each tableDataToDisplay as schemes, index}
			<Link
				disableRedirect={true}
				to={`/investments/${normalizeFundName(
					schemes?.schemeName,
					schemes?.isin,
					schemes?.schemeCode
				)}${isExternal ? '-rtaSchemeCode-' + schemes?.rtaSchemeCode + '/external' : ''}`}
				class="mb-2 block rounded-lg bg-background-alt p-4 px-3 pb-4 pt-2 text-sm shadow-csm last:border-none sm:mb-0 sm:rounded-none sm:border-b sm:px-6 sm:shadow-none {schemes?.sipEnabled
					? 'pt-2 sm:pb-6'
					: 'pt-4 sm:pb-4'}"
				on:linkClicked={() => handleRowClick(schemes)}
			>
				<Card class="rounded-none !p-0 shadow-none" on:click={() => handleRowClick(schemes)}>
					{#if schemes?.sipEnabled}
						<div data-testid={'sip-' + schemes?.isin + index} class="sip-enabled-here">
							<ChipOverview
								class="border-b-0 pb-2 sm:text-xs"
								headingPrimary={schemes?.sipEnabled ? 'ACTIVE SIP' : ''}
								headingSecondary=""
							>
								<svelte:fragment slot="categoryNameIcon">
									{#if schemes?.sipEnabled}
										<ActiveSipIcon class="mr-1" />
									{/if}
								</svelte:fragment>
							</ChipOverview>
						</div>
					{/if}
					<div
						data-testid={'content-' + schemes?.isin + index}
						class="scheme-card-content flex flex-col sm:flex-row"
					>
						<div class="flex w-full max-sm:pb-3 sm:w-[71%] sm:pr-[2%]">
							<div class="flex w-[75%] items-center sm:w-[82%]">
								<SchemeLogo size="sm" alt="bank logo" src={schemes.logoUrl} />
								<h3
									class="this-scheme-name line-clamp-2 whitespace-normal pr-3 text-sm font-normal text-title sm:pr-8 sm:text-base"
								>
									{schemes?.schemeName}
								</h3>
							</div>
							<div class="flex w-[25%] flex-col text-right sm:w-[18%] sm:text-left">
								<span class="text-xs font-normal text-body sm:text-sm">Current</span><span
									class="scheme-current-value text-sm font-medium text-title"
									>₹{schemes?.currentValue?.toString()
										? addCommasToAmountString(schemes?.currentValue?.toFixed(0)?.toString())
										: '-'}</span
								>
							</div>
						</div>
						<div
							class="flex w-full justify-between border-t max-sm:pt-3 sm:w-[29%] sm:border-none sm:text-left"
						>
							<div class="flex flex-col max-sm:justify-center sm:items-start sm:pr-2">
								<div class="mr-1 text-xs font-normal text-body sm:hidden sm:text-sm">
									Invested Amount
								</div>
								<div class="mr-1 text-xs font-normal text-body max-sm:hidden sm:text-sm">
									Invested
								</div>
								<div>
									{#if isPartialImport(schemes)}
										<article class="text-title lg:text-center">- -</article>
									{:else}
										<div
											data-testid={'invested-' + schemes?.isin + index}
											class="scheme-invested-value text-xs font-normal text-title max-sm:text-sm sm:text-sm sm:font-medium"
										>
											₹{schemes?.investedValue?.toString()
												? addCommasToAmountString(schemes?.investedValue?.toFixed(0)?.toString())
												: '-'}
										</div>
									{/if}
								</div>
							</div>

							<div class=" flex flex-col items-end max-sm:justify-center sm:text-left">
								{#if activeFilter === 'absolute'}
									<div class="text-xs font-normal text-body sm:text-sm">Returns</div>
								{:else}
									<div class="text-xs font-normal text-body sm:text-sm">XIRR</div>
								{/if}
								<div>
									{#if isPartialImport(schemes)}
										<article class=" text-title lg:text-right">- -</article>
									{:else}
										<article
											class="flex flex-wrap items-center justify-end text-title sm:flex-col lg:text-right"
										>
											{#if activeFilter === 'absolute'}
												<span
													data-testid={'returnsAmount-' + schemes?.isin + index}
													class="scheme-returns-value text-sm font-normal text-title sm:font-medium"
												>
													{schemes?.returnsValue?.toString() && schemes?.returnsValue < 0
														? '- '
														: ''}₹{schemes?.returnsValue?.toString()
														? addCommasToAmountString(
																Math.abs(schemes?.returnsValue)?.toFixed(0)?.toString()
														  )
														: '0'}
												</span>

												<span
													data-testid={'returnsPercentage-' + schemes?.isin + index}
													class="scheme-percentage-returns ml-1 font-normal sm:text-sm sm:font-medium {schemes?.returnsAbsolutePer <
													0
														? 'text-sell'
														: 'text-buy'}"
												>
													({schemes?.returnsAbsolutePer > 0
														? ''
														: ''}{schemes?.returnsAbsolutePer?.toString()
														? schemes?.returnsAbsolutePer?.toFixed(2)
														: '-'}%)
												</span>
											{:else}
												<span
													data-testid={'xirr-' + schemes?.isin + index}
													class="scheme-xirr-returns ml-1 font-normal sm:text-sm sm:font-medium {schemes?.xirrPer <
													0
														? 'text-sell'
														: schemes?.xirrPer > 0
														? 'text-buy'
														: ''}"
												>
													{schemes?.xirrPer > 0 ? '' : ''}{schemes?.xirrPer
														? schemes?.xirrPer?.toFixed(2) + '%'
														: '- -'}
												</span>
											{/if}
										</article>
									{/if}
								</div>
							</div>
						</div>
					</div>
					{#if (schemes?.xirrPer?.toString() === '0' && activeFilter === 'xirr') || isPartialImport(schemes)}
						<div
							data-testid={'partialImport-' + schemes?.isin + index}
							class={`partial-import-message mt-3 flex items-center rounded-lg bg-background px-2 py-1 sm:items-start sm:px-3`}
						>
							<div class="mr-3">
								<WMSIcon name="polygon-red-warning" width={16} height={16} />
							</div>
							{#if isPartialImport(schemes)}
								<div class="text-xs text-title">
									We are facing some technical issues identifying this investment
								</div>
							{:else if schemes?.xirrPer?.toString() === '0'}
								<div class="text-xs text-title">
									We are facing some technical issue calculating the XIRR for this investment
								</div>
							{/if}
						</div>
					{/if}
				</Card>
			</Link>
		{/each}
	</section>
</section>
{#if isXIRRModalOpen}
	<!-- XIRR Modal -->
	<XirrModal {isXIRRModalOpen} on:closeModal={toggleXirrModal} />
{/if}

{#if isOptimisePortfolioOpen}
	<OptimisePortfolioModal
		currentScheme={optimisedScheme}
		{investmentSummary}
		{toggleOptimisePorfolioCard}
		{optimisePorfolioData}
	/>
{/if}
