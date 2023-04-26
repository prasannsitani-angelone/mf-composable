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
	import InvestmentDetailsFooter from '../../investments/[investment]/components/InvestmentDetailsFooter.svelte';
	import { afterUpdate } from 'svelte';
	import { getQueryParamsObj } from '$lib/utils/helpers/params';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: showInvestmentPad = false;
	$: queryParamsObj = {};

	const handleInvestMoreCtaClick = () => {
		const currentPath = window?.location?.pathname;
		const redirectPath = `${currentPath}?orderpad=INVEST`;

		goto(redirectPath);
	};

	const setQueryParamsData = () => {
		if (queryParamsObj['orderpad'] === 'INVEST') {
			showInvestmentPad = true;
		} else {
			showInvestmentPad = false;
		}
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();
		setQueryParamsData();
	});
</script>

{#await data?.api?.schemeData}
	<div>Loading</div>
{:then schemedata}
	<!-- Left Side -->
	{#if !isMobile || !showInvestmentPad}
		<article class="sm-scroll-margin lg:scroll-margin rounded-lg pt-1 sm:pt-2 lg:mt-5">
			<FundOverview schemeDetails={schemedata} />
			<LockInPeriod schemeDetails={schemedata} />
			<ReturnEstimator
				returns3yr={schemedata?.returns3yr}
				categoryName={schemedata?.categoryName}
			/>
			<SchemeInformation schemeDetails={schemedata} />
			<FundManager schemeDetails={schemedata} />
			{#await data?.api?.holdingData then fundHoldingData}
				<FundHoldings {fundHoldingData} />
			{/await}
			{#await data?.api?.comparisons then comparisons}
				<SimilarFunds similarFunds={comparisons?.otherScheme || []} />
				<OtherFundsByAMC sameAmcScheme={comparisons?.sameAmcScheme} />
			{/await}
		</article>

		{#if schemedata}
			<InvestmentDetailsFooter
				parentPage={orderpadParentPage?.SCHEME}
				investmentAllowed={true}
				on:investButtonClick={handleInvestMoreCtaClick}
			/>
		{/if}
	{:else}
		<InvestmentPad class="block md:hidden" schemeData={schemedata} fromInvestmentDetailsPage />
	{/if}

	<!-- Right Side -->
	{#if !isMobile}
		<InvestmentPad class="mt-7 hidden md:block" schemeData={schemedata} fromInvestmentDetailsPage />
	{/if}
{/await}
