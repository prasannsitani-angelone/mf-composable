<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import FundHoldings from './FundHoldings/FundHoldings.svelte';
	import FundManager from './FundManager/FundManager.svelte';
	import FundOverview from '$components/Scheme/FundOverview/FundOverview.svelte';
	import SchemeInformation from '$components/Scheme/SchemeInformation/SchemeInformation.svelte';
	import SimilarFunds from './SimilarFunds/SimilarFunds.svelte';
	import OtherFundsByAMC from './OtherFundsByAMC/OtherFundsByAMC.svelte';
	import ReturnEstimator from '$components/ReturnEstimator/ReturnEstimator.svelte';
	import InvestmentPad from '../../../InvestmentPad/InvestmentPad.svelte';
	import { orderpadParentPage } from '../../../InvestmentPad/constants';
	import InvestmentDetailsFooter from '../../../(authenticated)/investments/[investment]/components/InvestmentDetailsFooter.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { decodeToObject, getQueryParamsObj } from '$lib/utils/helpers/params';
	import type { OrderPadTypes, decodedParamsTypes } from '$lib/types/IOrderPad';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import FundDetailsLoader from './FundDetailsLoader/FundDetailsLoader.svelte';
	import OrderpadLoader from './FundDetailsLoader/OrderpadLoader.svelte';
	import {
		mobileSchemeDetailsPageInvestButtonClickAnalytics,
		returnCalculatorImpressionAnalytics,
		returnCalculatorResultAnalytics,
		type IMobileSchemeDetailsPageInvestButtonClickAnalytics
	} from '$components/Scheme/analytics';
	import NfoDetails from '$components/Scheme/NFODetails/NFODetails.svelte';
	import { SEO } from 'svelte-components';
	import { getDeeplinkForUrl } from '$lib/utils/helpers/deeplinks';
	import InvestmentDetailsFooterLoader from '../../../(authenticated)/investments/[investment]/components/InvestmentDetailsFooterLoader.svelte';
	import { hydratedStore } from '$lib/stores/AppHydratedStore';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import RiskAndRating from '$components/Scheme/RiskAndRating/RiskAndRating.svelte';
	import FundHeading from './FundHeading/FundHeading.svelte';
	import FundComparisonEntry from './FundComparison/FundComparisonEntry.svelte';
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	import SomethingWentWrongSmall from '$components/Error/SomethingWentWrongSmall.svelte';
	import type { FundComparisons } from '$components/Scheme/types';
	import { getDataforInvestment } from '../../../InvestmentPad/api';
	import ExitLoadInfoModal from '$components/ExitLoadInfoModal.svelte';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;
	$: showInvestmentPad = data?.showInvestmentPad;
	$: queryParamsObj = <OrderPadTypes>{};
	let orderpadParams = <decodedParamsTypes>{};
	let comparisons: FundComparisons;
	let showFundDetailExitLoadModal = false;

	function getSchemeDetailsBreadCrumbs(scheme: SchemeDetails) {
		const { schemeName, isin, schemeCode } = scheme;
		const breadCrumbs = [
			{
				text: 'Home',
				href: '/discoverfunds'
			},
			{
				text: 'Mutual Fund',
				href: '/discoverfunds'
			},
			{
				text: schemeName,
				href: normalizeFundName(schemeName, isin, schemeCode)
			}
		];

		return breadCrumbs;
	}

	const handleInvestMoreCtaClick = async () => {
		const schemeData: SchemeDetails = await data?.api?.schemeData;

		const eventMetaData: IMobileSchemeDetailsPageInvestButtonClickAnalytics = {
			ISIN: schemeData?.isin,
			'3YReturn': schemeData?.returns3yr,
			FundName: schemeData?.schemeName,
			isOpenNFO: schemeData?.nfoScheme === 'Y',
			schemeURL: getDeeplinkForUrl($page.url)
		};

		mobileSchemeDetailsPageInvestButtonClickAnalytics(eventMetaData);

		const redirectPath = '?orderpad=INVEST';
		pushState(redirectPath, {
			hideMobileHeader: true
		});
	};

	orderpadParams = data?.layoutConfig?.decodedParams || {};

	const setQueryParamsData = () => {
		orderpadParams = decodeToObject(queryParamsObj?.params);
		if (queryParamsObj?.orderpad === 'INVEST' || orderpadParams?.orderpad === 'INVEST') {
			showInvestmentPad = true;
		} else {
			showInvestmentPad = false;
		}
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();
		setQueryParamsData();
	});

	const handleReturnCalculatorYearChange = (calculatedOutput: CalculatedValue) => {
		returnCalculatorImpressionAnalyticsFunc(calculatedOutput, 'manual');
	};

	const returnCalculatorImpressionAnalyticsFunc = (
		calculatedOutput: CalculatedValue,
		changeType = 'default'
	) => {
		const eventMetadata = {
			InvType: calculatedOutput?.currentCalculatorMode,
			ScreenName: 'fund_detail',
			amounttype: changeType,
			amount: calculatedOutput?.investedAmount,
			durationtype: changeType,
			duration: calculatedOutput?.selectedYear,
			returnabs: calculatedOutput?.selectedReturn,
			finalvalue: calculatedOutput?.matuarityAmount,
			gains: calculatedOutput?.capitalGain
		};

		returnCalculatorImpressionAnalytics(eventMetadata);
	};

	const returnCalculatorResultAnalyticsFunc = (calculatedOutput: CalculatedValue) => {
		const eventMetadata = {
			InvType: calculatedOutput?.currentCalculatorMode,
			ScreenName: 'fund_detail',
			amounttype: 'manual',
			amount: calculatedOutput?.investedAmount,
			durationtype: 'manual',
			duration: calculatedOutput?.selectedYear,
			returnabs: calculatedOutput?.selectedReturn,
			finalvalue: calculatedOutput?.matuarityAmount,
			gains: calculatedOutput?.capitalGain
		};

		returnCalculatorResultAnalytics(eventMetadata);
	};
	onMount(async () => {
		comparisons = await data?.api?.comparisons;
	});

	const toggleExitLoadModal = () => {
		showFundDetailExitLoadModal = !showFundDetailExitLoadModal;
	};
</script>

<svelte:head>
	<meta name="robots" content="noindex, follow" />
</svelte:head>
{#await data?.api?.schemeData}
	<FundDetailsLoader />

	<OrderpadLoader />
{:then schemedata}
	{#if schemedata instanceof Error}
		<SomethingWentWrong class="cardHeightNoBottomNav" />
	{:else}
		<SEO
			seoTitle="{schemedata?.schemeName} NAV, Mutual Fund Returns | Angel One"
			seoDescription="{schemedata?.schemeName} - Get Todays NAV, Historical Returns, Fund Performance, Portfolio. Start Investing in {schemedata?.amcName} online with Angel One."
		/>
		{@const isNFO = schemedata?.nfoScheme === 'Y'}
		<!-- Left Side -->
		{#if (!isMobile && !isTablet) || !showInvestmentPad}
			<article class="pb-16">
				<Breadcrumbs
					items={getSchemeDetailsBreadCrumbs(schemedata)}
					class="my-4 hidden items-center justify-start md:flex"
				/>
				<FundHeading schemeDetails={schemedata} {isNFO} />
				{#if !isNFO}
					<FundOverview schemeDetails={schemedata} {comparisons} {isNFO} />
				{/if}
				{#if isNFO}
					<NfoDetails schemeDetails={schemedata} />
				{/if}

				{#if !isNFO}
					<ReturnEstimator
						schemeDetails={schemedata}
						class="mt-2 md:mt-4"
						on:onYearChange={(e) => handleReturnCalculatorYearChange(e.detail)}
						on:returnEstimatorInViewPort={(e) => returnCalculatorImpressionAnalyticsFunc(e?.detail)}
						on:returnCalculatorResult={(e) => returnCalculatorResultAnalyticsFunc(e?.detail)}
					/>
				{/if}
				{#if !isNFO}
					<SchemeInformation
						on:exitLoadInfoIconClicked={toggleExitLoadModal}
						schemeDetails={schemedata}
						{isNFO}
					/>
					{#await data?.api?.comparisons then comparisons}
						{#if comparisons instanceof Error}
							<SomethingWentWrongSmall />
						{:else}
							<FundComparisonEntry
								firstSchemeDetails={schemedata}
								similarFunds={comparisons?.otherScheme || []}
							/>
						{/if}
					{/await}
				{/if}

				<FundManager schemeDetails={schemedata} />
				<RiskAndRating schemeDetails={schemedata} />
				{#if !isNFO}
					{#await data?.api?.holdingData then fundHoldingData}
						{#if fundHoldingData instanceof Error}
							<SomethingWentWrongSmall />
						{:else if fundHoldingData?.holdingData?.length || fundHoldingData?.sectorHoldings?.length}
							<FundHoldings
								fundHoldingData={fundHoldingData?.holdingData}
								sectorData={fundHoldingData?.sectorHoldings}
								isin={schemedata?.isin}
								schemeName={schemedata?.schemeName}
							/>
						{/if}
					{/await}
				{/if}
				{#await data?.api?.comparisons then comparisons}
					{#if comparisons instanceof Error}
						<SomethingWentWrongSmall />
					{:else}
						{#if !isNFO}
							<SimilarFunds
								similarFunds={comparisons?.otherScheme || []}
								isin={schemedata?.isin}
								schemeName={schemedata?.schemeName}
								returns3yr={schemedata?.returns3yr}
							/>
						{/if}
						<OtherFundsByAMC
							sameAmcScheme={comparisons?.sameAmcScheme}
							isin={schemedata?.isin}
							schemeName={schemedata?.schemeName}
							returns3yr={schemedata?.returns3yr}
							schemePlan={schemedata?.schemePlan}
							schemeReInvestmentPlan={schemedata?.reInvestmentPlan}
						/>
					{/if}
				{/await}
			</article>

			{#if schemedata}
				{#if $hydratedStore.isHydrated}
					<InvestmentDetailsFooter
						parentPage={orderpadParentPage?.SCHEME}
						investmentAllowed={true}
						on:investButtonClick={handleInvestMoreCtaClick}
					/>
				{:else}
					<article class="fixed inset-0 top-auto z-20 block bg-background-alt p-2 md:hidden">
						<InvestmentDetailsFooterLoader isSchemeDetailsPage />
					</article>
				{/if}
			{/if}
		{:else}
			{#await getDataforInvestment()}
				<div />
			{:then dataForInvestment}
				{#if dataForInvestment instanceof Error}
					<SomethingWentWrongSmall />
				{:else}
					<InvestmentPad
						{isNFO}
						class="block md:hidden"
						schemeData={schemedata}
						previousPaymentDetails={dataForInvestment?.previousPaymentDetails}
						mandateData={dataForInvestment?.mandateData}
						params={orderpadParams}
						fromInvestmentDetailsPage={false}
					/>
				{/if}
			{/await}
		{/if}

		<!-- Right Side -->
		{#if !isMobile && !isTablet}
			{#await getDataforInvestment()}
				<div />
			{:then dataForInvestment}
				<InvestmentPad
					{isNFO}
					class="sticky -top-2 mt-[52px] hidden md:block"
					schemeData={schemedata}
					previousPaymentDetails={dataForInvestment?.previousPaymentDetails}
					mandateData={dataForInvestment?.mandateData}
					params={orderpadParams}
					fromInvestmentDetailsPage={false}
				/>
			{/await}
		{/if}
	{/if}

	<ExitLoadInfoModal
		exitLoadValue={schemedata.exitLoadValue}
		bind:showFundDetailExitLoadModal
		on:backdropclicked={toggleExitLoadModal}
	/>
{/await}
