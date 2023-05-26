<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import FundHoldings from './FundHoldings/FundHoldings.svelte';
	import FundManager from './FundManager/FundManager.svelte';
	import FundOverview from './FundOverview/FundOverview.svelte';
	import LockInPeriod from './LockInPeriod/LockInPeriod.svelte';
	import SchemeInformation from './SchemeInformation/SchemeInformation.svelte';
	import SimilarFunds from './SimilarFunds/SimilarFunds.svelte';
	import OtherFundsByAMC from './OtherFundsByAMC/OtherFundsByAMC.svelte';
	import ReturnEstimator from './ReturnEstimator/ReturnEstimator.svelte';
	import InvestmentPad from '../../InvestmentPad/InvestmentPad.svelte';
	import { orderpadParentPage } from '../../InvestmentPad/constants';
	import InvestmentDetailsFooter from '../../(authenticated)/investments/[investment]/components/InvestmentDetailsFooter.svelte';
	import { afterUpdate } from 'svelte';
	import { decodeToObject, getQueryParamsObj } from '$lib/utils/helpers/params';
	import type { OrderPadTypes, decodedParamsTypes } from '$lib/types/IOrderPad';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import FundDetailsLoader from './FundDetailsLoader/FundDetailsLoader.svelte';
	import OrderpadLoader from './FundDetailsLoader/OrderpadLoader.svelte';
	import { mobileSchemeDetailsPageInvestButtonClickAnalytics } from './analytics';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import NfoDetails from './NFODetails/NFODetails.svelte';
	import { SEO } from 'wms-ui-component';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: showInvestmentPad = false;
	$: queryParamsObj = <OrderPadTypes>{};
	$: orderpadParams = <decodedParamsTypes>{};

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
			NAV: schemeData?.navValue
		};

		mobileSchemeDetailsPageInvestButtonClickAnalytics(eventMetaData);

		if (data?.isGuest) {
			const pageData = $page?.data;
			const redirectPath = `${getNavigationBaseUrl(
				'',
				pageData?.scheme,
				pageData?.host
			)}/login?redirect=${window?.location?.href}`;

			goto(redirectPath);
		} else {
			const currentPath = window?.location?.pathname;
			const redirectPath = `${currentPath}?orderpad=INVEST`;

			goto(redirectPath);
		}
	};

	const setQueryParamsData = () => {
		if (queryParamsObj?.orderpad === 'INVEST') {
			showInvestmentPad = true;
		} else {
			showInvestmentPad = false;
		}

		if (queryParamsObj?.params?.length) {
			orderpadParams = decodeToObject(queryParamsObj?.params);
		}
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();
		setQueryParamsData();
	});
</script>

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
	{#if !isMobile || !showInvestmentPad}
		<article class="pb-16">
			<Breadcrumbs
				items={getSchemeDetailsBreadCrumbs(schemedata)}
				class="my-4 hidden items-center justify-start md:flex"
			/>
			<FundOverview schemeDetails={schemedata} {isNFO} />
			{#if isNFO}
				<NfoDetails schemeDetails={schemedata} />
			{/if}
			<LockInPeriod schemeDetails={schemedata} {isNFO} />
			{#if !isNFO}
				<ReturnEstimator
					returns3yr={schemedata?.returns3yr}
					categoryName={schemedata?.categoryName}
				/>
			{/if}
			<SchemeInformation schemeDetails={schemedata} {isNFO} />
			<FundManager schemeDetails={schemedata} />
			{#if !isNFO}
				{#await data?.api?.holdingData then fundHoldingData}
					<FundHoldings {fundHoldingData} />
				{/await}
				{#await data?.api?.comparisons then comparisons}
					<SimilarFunds similarFunds={comparisons?.otherScheme || []} />
					<OtherFundsByAMC sameAmcScheme={comparisons?.sameAmcScheme} />
				{/await}
			{/if}
		</article>

		{#if schemedata}
			<InvestmentDetailsFooter
				parentPage={orderpadParentPage?.SCHEME}
				investmentAllowed={true}
				on:investButtonClick={handleInvestMoreCtaClick}
			/>
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
			/>
		{/await}
	{/if}

	<!-- Right Side -->
	{#if !isMobile}
		{#await data?.api?.previousPaymentDetails}
			<div />
		{:then previousPaymentDetails}
			<InvestmentPad
				class="sticky -top-2 mt-[52px] hidden md:block"
				schemeData={schemedata}
				{previousPaymentDetails}
				params={orderpadParams}
			/>
		{/await}
	{/if}
{/await}
