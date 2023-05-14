<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import HoldingsOverview from '../portfolio/HoldingsOverview.svelte';
	import FolioSummary from './FolioSummary.svelte';
	import FolioSummaryExternalFunds from './FolioSummaryExternalFunds.svelte';
	import TransactionHistory from './TransactionHistory.svelte';
	import PartialImportHeading from './components/PartialImportHeading.svelte';
	import type { FolioHoldingType, ChartData, OrdersData } from '$lib/types/IInvestments';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import {
		fundCardClickAnalytics,
		hideAllFoliosAnalytics,
		investmentDetailsScreenOpenAnalytics
	} from '../analytics';

	export let holdings: FolioHoldingType;
	export let chartData: ChartData;
	export let ordersData: OrdersData;
	export let schemeDetails: SchemeDetails;

	const userType = $page.data?.profile?.userType || '';
	$: isExternal = $page?.data?.isExternal;

	$: isInvestmentNotAllowed = !isInvestmentAllowed(userType, holdings?.schemePlan);

	$: isPartialImport = isExternal && holdings?.externalFundImportStatus !== 'COMPLETED';

	const folioArray: {
		FolioNumber: string;
		WithdrawableAmount: number;
		WithdrawableUnits: number;
		BlockedAmount: number;
		BlockedUnits: number;
	}[] = [];

	const setFolioArrayAnalytics = () => {
		holdings?.folioHoldings?.forEach((folio) => {
			folioArray.push({
				FolioNumber: folio?.folioNumber,
				WithdrawableAmount: folio?.redemableAmount,
				WithdrawableUnits: folio?.redemableUnits,
				BlockedAmount: folio?.blockedAmount,
				BlockedUnits: folio?.blockedunits
			});
		});
	};

	const isRedirectAllowed = () => {
		return !isExternal ? true : !holdings.externalImportFailed;
	};

	const fundCardClickAnalyticsFunc = () => {
		const eventMetaData = {
			folios: folioArray
		};

		fundCardClickAnalytics(eventMetaData);
	};

	const hideAllFoliosAnalyticsFunc = () => {
		const eventMetaData = {
			folios: folioArray
		};

		hideAllFoliosAnalytics(eventMetaData);
	};

	const handleSchemeCardClick = () => {
		if (isInvestmentNotAllowed || !schemeDetails) {
			return;
		} else if (!isRedirectAllowed()) {
			return;
		}
		fundCardClickAnalyticsFunc();

		goto(
			`${base}/schemes/${normalizeFundName(
				holdings?.schemeName,
				holdings?.isin,
				holdings?.schemeCode
			)}`
		);
	};

	const investmentDetailsScreenOpenAnalyticsFunc = () => {
		const eventMetaData = {
			FundName: holdings?.schemeName,
			CurrentValue: parseFloat(holdings?.currentValue?.toFixed(2) || '0.00'),
			TotalInvestment: parseFloat(holdings?.investedValue?.toFixed(2) || '0.00'),
			TotalReturns: parseFloat(holdings?.returnsValue?.toFixed(2) || '0.00')
		};

		investmentDetailsScreenOpenAnalytics(eventMetaData);
	};

	onMount(() => {
		setFolioArrayAnalytics();
		investmentDetailsScreenOpenAnalyticsFunc();
	});
</script>

<section>
	<article class="mt-0">
		{#if isPartialImport}
			<PartialImportHeading />
		{/if}
		<ResultItem
			class="mb-2 rounded-lg bg-white p-4 shadow-csm md:px-6 md:py-5 {!isInvestmentNotAllowed &&
			schemeDetails &&
			isRedirectAllowed()
				? 'cursor-pointer'
				: ''}"
			data={schemeDetails}
			schemeName={holdings?.schemeName}
			logoUrl={holdings?.logoUrl}
			categoryName={holdings?.schemePlan}
			subcategoryName={holdings?.sipEnabled ? 'SIP' : 'ONE-TIME'}
			titleStyle="ml-1 text-sm lg:text-lg font-medium text-black-title"
			categoryStyle="mx-1 font-medium"
			subCategoryStyle="ml-1 font-medium"
			on:click={handleSchemeCardClick}
		>
			<svelte.fragment slot="ratingSection">
				<span />
			</svelte.fragment>
			<svelte.fragment slot="returns">
				{#if !isInvestmentNotAllowed && schemeDetails && isRedirectAllowed()}
					<span>
						<RightIcon />
					</span>
				{/if}
			</svelte.fragment>
		</ResultItem>
	</article>
	<HoldingsOverview
		folioSummary={holdings}
		chartDataList={chartData.chart}
		showGraphTags={false}
		{isPartialImport}
	/>

	{#if isExternal}
		<FolioSummaryExternalFunds {isPartialImport} folioDetails={holdings} />
	{:else}
		<FolioSummary folioDetails={holdings} on:viewHideAllFolioClicked={hideAllFoliosAnalyticsFunc} />
	{/if}
	<TransactionHistory
		transactionList={ordersData.orders}
		class={isInvestmentNotAllowed ? 'mb-36' : 'mb-16'}
	/>
	<!-- TODO: Add the complete class condition for TransactionHistory - (isInvestmentNotAllowed || withdrawDisableText?.length) && 'mb-36' -->
</section>
