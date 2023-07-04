<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { InvestmentEntity } from '$lib/types/IInvestments';
	import ActiveSipIcon from '$lib/images/icons/ActiveSipIcon.svelte';
	import ChipOverview from '$components/ChipOverview.svelte';
	import { partialImportCheck } from '../utils';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { investmentRowClickAnalytics } from '../analytics';
	import Card from '$components/Card.svelte';
	import Link from '$components/Link.svelte';
	import PageFilter from './components/PageFilter.svelte';
	import Modal from '$components/Modal.svelte';
	import Button from '$components/Button.svelte';
	import type { ToggleButtonParam } from '$lib/types/IInvestments';

	$: isExternal = $page?.data?.isExternal;

	export let isXIRRModalOpen = false;
	let activeFilter = 'absolute';

	const onXirrClick = () => {
		isXIRRModalOpen = true;
	};

	const onFilterButtonToggle = (data: ToggleButtonParam) => {
		activeFilter = data.id;
	};

	let tableData: Array<InvestmentEntity>;

	let tableDataToDisplay = [...tableData];

	export { tableData };

	const handleRowClick = (selectedRow: InvestmentEntity) => {
		const dParam = `${
			isExternal ? '-rtaSchemeCode-' + selectedRow?.rtaSchemeCode + '/external' : ''
		}`;
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
			console.error('API responded with Error - ', error);
		}
	};

	const isPartialImport = (scheme: InvestmentEntity) => {
		return isExternal && partialImportCheck(scheme);
	};

	const onModalClick = () => {
		isXIRRModalOpen = false;
	};
</script>

<section class="overflow-hidden rounded-b-xl sm:shadow-csm">
	{#if !isExternal}
		<section data-testid="investmentFilterContainer">
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
				class="mb-2 block rounded-lg bg-white p-4 px-3 pt-2 pb-4 text-sm shadow-csm last:border-none sm:mb-0 sm:rounded-none sm:border-b sm:px-6 sm:shadow-none {schemes?.sipEnabled
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
								<SchemeLogo
									alt="bank logo"
									src={schemes.logoUrl}
									{schemes}
									class="!mr-2 !h-9 !w-9 items-center"
									imageClass="h-9 w-9"
								/>
								<h3
									class="this-scheme-name line-clamp-2 whitespace-normal pr-3 text-sm font-medium text-black-title sm:pr-8 sm:text-base"
								>
									{schemes?.schemeName}
								</h3>
							</div>
							<div class="flex w-[25%] flex-col text-right sm:w-[18%] sm:text-left">
								<span class="text-xs font-medium text-grey-body sm:text-sm">Current</span><span
									class="scheme-current-value text-sm font-semibold text-black-title"
									>₹{schemes?.currentValue?.toString()
										? addCommasToAmountString(schemes?.currentValue?.toFixed(2)?.toString())
										: '-'}</span
								>
							</div>
						</div>
						<div
							class="flex w-full justify-between border-t max-sm:pt-3 sm:w-[29%] sm:border-none sm:text-left"
						>
							<div class="flex flex-col max-sm:justify-center sm:items-start sm:pr-2">
								<div class="mr-1 text-xs font-medium text-grey-body sm:hidden sm:text-sm">
									Invested Amount
								</div>
								<div class="mr-1 text-xs font-medium text-grey-body max-sm:hidden sm:text-sm">
									Invested
								</div>
								<div>
									{#if isPartialImport(schemes)}
										<article class="text-black-title lg:text-center">- -</article>
									{:else}
										<div
											data-testid={'invested-' + schemes?.isin + index}
											class="scheme-invested-value text-xs font-medium text-black-key max-sm:text-sm sm:text-sm sm:font-semibold"
										>
											₹{schemes?.investedValue?.toString()
												? addCommasToAmountString(schemes?.investedValue?.toFixed(2)?.toString())
												: '-'}
										</div>
									{/if}
								</div>
							</div>

							<div class=" flex flex-col items-end max-sm:justify-center sm:text-left">
								{#if activeFilter === 'absolute'}
									<div class="text-xs font-medium text-grey-body sm:text-sm">Returns</div>
								{:else}
									<div class="text-xs font-medium text-grey-body sm:text-sm">XIRR</div>
								{/if}
								<div>
									{#if isPartialImport(schemes)}
										<article class=" text-black-title lg:text-right">- -</article>
									{:else}
										<article
											class="flex flex-wrap items-center justify-end text-black-title lg:text-right"
										>
											{#if activeFilter === 'absolute'}
												<span
													data-testid={'returnsAmount-' + schemes?.isin + index}
													class="scheme-returns-value text-sm font-medium text-black-key sm:font-semibold"
												>
													{schemes?.returnsValue?.toString() && schemes?.returnsValue < 0
														? '- '
														: ''}₹{schemes?.returnsValue?.toString()
														? addCommasToAmountString(
																Math.abs(schemes?.returnsValue)?.toFixed(2)?.toString()
														  )
														: '0.00'}
												</span>

												<span
													data-testid={'returnsPercentage-' + schemes?.isin + index}
													class="scheme-percentage-returns ml-1 font-medium sm:text-sm sm:font-semibold {schemes?.returnsAbsolutePer <
													0
														? 'text-red-sell'
														: 'text-green-buy'}"
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
													class="scheme-xirr-returns ml-1 font-medium sm:text-sm sm:font-semibold {schemes?.xirrPer <
													0
														? 'text-red-sell'
														: schemes?.xirrPer > 0
														? 'text-green-buy'
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
							class={`partial-import-message mt-3 flex items-center rounded-lg bg-blue-background px-2 py-1 sm:items-start sm:px-3`}
						>
							<div class="mr-3">
								<WMSIcon name="polygon-red-warning" width={16} height={16} />
							</div>
							{#if isPartialImport(schemes)}
								<div class="text-xs text-black-title">
									We are facing some technical issues identifying this investment
								</div>
							{:else if schemes?.xirrPer?.toString() === '0'}
								<div class="text-xs text-black-title">
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
	<Modal closeModal={onModalClick} isModalOpen>
		<div
			class="w-screen rounded-t-2xl rounded-b-none bg-white px-4 py-6 sm:!w-[460px] sm:rounded-lg sm:p-8"
		>
			<div
				data-testid="investmentXirrModal"
				class=" pb-6 text-lg font-medium text-black-title sm:pb-3 sm:text-xl"
			>
				What is XIRR?
			</div>
			<div class=" text-sm font-normal text-grey-body">
				XIRR stands for Extended Internal Rate of Return. XIRR helps calculate the annualized rate
				of return of your mutual fund investment, considering the specific dates and amounts of your
				purchases and withdrawal. XIRR gives you a more accurate picture of how well your investment
				is doing compared to other measures.
			</div>
			<div data-testid="investmentXirrModalBtn" class="hidden pt-8 text-center sm:block">
				<Button class="px-12" variant="outlined" onClick={onModalClick}>GOT IT</Button>
			</div>
		</div>
	</Modal>
{/if}
