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
	import { partialImportCheck } from '../utils';
	import type { FolioHoldingType, ChartData, Transaction } from '$lib/types/IInvestments';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import {
		fundCardClickAnalytics,
		hideAllFoliosAnalytics,
		investmentDetailsScreenOpenAnalytics,
		investmentDetailsExternalScreenOpenAnalytics
	} from '../analytics';

	export let holdings: FolioHoldingType;
	export let chartData: ChartData;
	export let ordersData: Transaction[];
	export let schemeDetails: SchemeDetails;
	export let mappingScheme: SchemeDetails;
	export let isRedemptionNotAllowed = false;

	const userType = $page.data?.profile?.userType || '';
	$: isExternal = $page?.data?.isExternal;

	$: isInvestmentNotAllowed = !isInvestmentAllowed(userType, holdings?.schemePlan);

	$: isPartialImport = isExternal && partialImportCheck(holdings);

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

	const investmentDetailsExternalScreenOpenAnalyticsFunc = () => {
		const isMappingSchemeAvailable = Object.keys(mappingScheme)?.length > 0;
		let mappedinvestfund;
		if (isMappingSchemeAvailable) {
			const externalFundSchemePlan = holdings?.schemePlan?.toLowerCase() || '';
			const mappedFundSchemePlan = mappingScheme?.schemePlan?.toLowerCase() || '';
			mappedinvestfund = externalFundSchemePlan === mappedFundSchemePlan ? 'same' : 'different';
		} else {
			mappedinvestfund = '';
		}

		const meteData = {
			FundName: holdings?.schemeName,
			Total_invested: parseFloat(holdings?.investedValue?.toFixed(2) || '0.00'),
			current_value: parseFloat(holdings?.currentValue?.toFixed(2) || '0.00'),
			Total_Returns: parseFloat(holdings?.returnsValue?.toFixed(2) || '0.00'),
			GraphSatus: chartData.chart?.length > 0 ? 'Visble' : 'Not Visible',
			Message:
				chartData.chart?.length === 0
					? 'Generating your investment value graph. This can take up to 24 hours'
					: '',
			isinvestenabled: isMappingSchemeAvailable,
			mappedinvestfund: mappedinvestfund,
			isin: holdings?.isin
		};
		investmentDetailsExternalScreenOpenAnalytics(meteData);
	};

	onMount(() => {
		setFolioArrayAnalytics();
		investmentDetailsScreenOpenAnalyticsFunc();
		if (isExternal) {
			investmentDetailsExternalScreenOpenAnalyticsFunc();
		}
	});
</script>

<section>
	<article class="mt-0">
		{#if isPartialImport}
			<PartialImportHeading />
		{/if}
		<ResultItem
			class="mb-2 rounded-lg bg-background-alt p-4 shadow-csm md:px-6 md:py-5 {!isInvestmentNotAllowed &&
			schemeDetails &&
			isRedirectAllowed()
				? 'cursor-pointer'
				: ''}"
			data={schemeDetails}
			schemeName={holdings?.schemeName}
			logoUrl={holdings?.logoUrl}
			categoryName={holdings?.schemePlan}
			subcategoryName={holdings?.sipEnabled ? 'SIP' : 'ONE-TIME'}
			titleStyle="ml-1 text-sm lg:text-lg font-normal text-title"
			categoryStyle="mx-1 font-normal"
			subCategoryStyle="ml-1 font-normal"
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
		transactionList={ordersData}
		class={isInvestmentNotAllowed || isRedemptionNotAllowed
			? 'mb-48'
			: !holdings?.investmentAllowed
			? 'mb-32'
			: 'mb-16'}
	/>
</section>
