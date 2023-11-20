<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import FundHoldings from './FundHoldings/FundHoldings.svelte';
	import FundManager from './FundManager/FundManager.svelte';
	import FundOverview from './FundOverview/FundOverview.svelte';
	import SchemeInformation from './SchemeInformation/SchemeInformation.svelte';
	import SimilarFunds from './SimilarFunds/SimilarFunds.svelte';
	import OtherFundsByAMC from './OtherFundsByAMC/OtherFundsByAMC.svelte';
	import ReturnEstimator from '$components/ReturnEstimator/ReturnEstimator.svelte';
	import InvestmentPad from '../../../InvestmentPad/InvestmentPad.svelte';
	import { orderpadParentPage } from '../../../InvestmentPad/constants';
	import InvestmentDetailsFooter from '../../../(authenticated)/investments/[investment]/components/InvestmentDetailsFooter.svelte';
	import { afterUpdate } from 'svelte';
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
		returnCalculatorResultAnalytics
	} from './analytics';
	import NfoDetails from './NFODetails/NFODetails.svelte';
	import { SEO } from 'svelte-components';
	import { getDeeplinkForUrl } from '$lib/utils/helpers/deeplinks';
	import InvestmentDetailsFooterLoader from '../../../(authenticated)/investments/[investment]/components/InvestmentDetailsFooterLoader.svelte';
	import { hydratedStore } from '$lib/stores/AppHydratedStore';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import RiskAndRating from './RiskAndRating/RiskAndRating.svelte';
	import FundHeading from './FundHeading/FundHeading.svelte';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;
	$: showInvestmentPad = data?.showInvestmentPad;
	$: queryParamsObj = <OrderPadTypes>{};
	let orderpadParams = <decodedParamsTypes>{};

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

		const eventMetaData = {
			Fundname: schemeData?.schemeName,
			AssetType: schemeData?.categoryName,
			SubAssetType: schemeData?.subcategoryName,
			FundType: schemeData?.reInvestmentPlan,
			Rating: schemeData?.arqRating,
			NAV: schemeData?.navValue,
			URL: getDeeplinkForUrl($page.url)
		};

		mobileSchemeDetailsPageInvestButtonClickAnalytics(eventMetaData);

		const currentPath = window?.location?.pathname;
		const redirectPath = `${currentPath}?orderpad=INVEST`;

		goto(redirectPath);
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
</script>

<svelte:head>
	<meta name="robots" content="noindex, follow" />
</svelte:head>
{#await data?.api?.schemeData}
	<FundDetailsLoader />

	<OrderpadLoader />
{:then schemedata}
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
			<FundHeading schemeDetails={schemedata} />
			{#if !isNFO}
				<FundOverview schemeDetails={schemedata} {isNFO} />
			{/if}
			{#if isNFO}
				<NfoDetails schemeDetails={schemedata} />
			{/if}

			{#if !isNFO}
				<ReturnEstimator
					returns3yr={schemedata?.returns3yr}
					returns5yr={schemedata?.returns5yr}
					categoryName={schemedata?.categoryName}
					minSipAmount={schemedata?.minSipAmount}
					minLumpsumAmount={schemedata?.minLumpsumAmount}
					class="mt-2 md:mt-4"
					on:onYearChange={(e) => handleReturnCalculatorYearChange(e.detail)}
					on:returnEstimatorInViewPort={(e) => returnCalculatorImpressionAnalyticsFunc(e?.detail)}
					on:returnCalculatorResult={(e) => returnCalculatorResultAnalyticsFunc(e?.detail)}
				/>
			{/if}
			{#if !isNFO}
				<SchemeInformation schemeDetails={schemedata} {isNFO} />
			{/if}
			<FundManager schemeDetails={schemedata} />
			<RiskAndRating schemeDetails={schemedata} />
			{#if !isNFO}
				{#await data?.api?.holdingData then fundHoldingData}
					{#if fundHoldingData?.length > 0}
						<FundHoldings {fundHoldingData} />
					{/if}
				{/await}
			{/if}
			{#await data?.api?.comparisons then comparisons}
				{#if !isNFO}
					<SimilarFunds similarFunds={comparisons?.otherScheme || []} />
				{/if}
				<OtherFundsByAMC sameAmcScheme={comparisons?.sameAmcScheme} />
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
				<article class="fixed inset-0 top-auto z-20 block bg-white p-2 md:hidden">
					<InvestmentDetailsFooterLoader isSchemeDetailsPage />
				</article>
			{/if}
		{/if}
	{:else}
		{#await data?.api?.previousPaymentDetails}
			<div />
		{:then previousPaymentDetails}
			<InvestmentPad
				class="block md:hidden"
				schemeData={schemedata}
				{previousPaymentDetails}
				params={orderpadParams}
				fromInvestmentDetailsPage={false}
			/>
		{/await}
	{/if}

	<!-- Right Side -->
	{#if !isMobile && !isTablet}
		{#await data?.api?.previousPaymentDetails}
			<div />
		{:then previousPaymentDetails}
			<InvestmentPad
				class="sticky -top-2 mt-[52px] hidden md:block"
				schemeData={schemedata}
				{previousPaymentDetails}
				params={orderpadParams}
				fromInvestmentDetailsPage={false}
			/>
		{/await}
	{/if}
{/await}
