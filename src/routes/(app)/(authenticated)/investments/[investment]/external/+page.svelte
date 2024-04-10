<script lang="ts">
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/UserStore';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import LeftSideView from '../LeftSideView.svelte';
	import InvestmentDetailsLoader from '../components/InvestmentDetailsLoader.svelte';
	import type { PageData } from '../$types';
	import type { ChartData, FolioHoldingType, OrdersData } from '$lib/types/IInvestments';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import { SEO } from 'svelte-components';
	import { page } from '$app/stores';
	import MappingSchemeModal from './components/MappingSchemeModal.svelte';
	import { base } from '$app/paths';
	import ExternalInvestmentFooterLoader from './components/ExternalInvestmentFooterLoader.svelte';
	import ExternalInvestmentDetailsFooter from './components/ExternalInvestmentDetailsFooter.svelte';
	import { browser } from '$app/environment';
	import { externalInvestmentInvestMoreClickEvent } from './analytics';
	import type { BenchmarkDataType, ChartDataType } from '$lib/types/IPortfolioDetails';
	import { updateLineChart } from '../utils';

	export let data: PageData;

	interface BreadcrumbType {
		text: string;
		href: string;
	}

	type AllResponseSchema = {
		holdingsData: FolioHoldingType;
		chartData: ChartData;
		ordersData: OrdersData;
		schemeData: SchemeDetails;
		mappingScheme: SchemeDetails;
		benchmarkData: BenchmarkDataType;
	};

	let breadCrumbs: BreadcrumbType[];
	$: breadCrumbs = [];
	$: holdingsData = <FolioHoldingType>{};
	let mappingScheme = <SchemeDetails>{};
	let fundChartData: Array<ChartDataType>;
	let benchmarkData: BenchmarkDataType;
	let isInvestmentNotAllowed = false;

	async function setPageData(data: Promise<AllResponseSchema>) {
		const result = await data;

		breadCrumbs = [
			{
				text: 'Home',
				href: '/'
			},
			{
				text: 'Your Investments',
				href: '/investments?type=all'
			},
			{
				text: `${result?.holdingsData?.schemeName}`,
				href: `/investments/${normalizeFundName(
					result?.holdingsData?.schemeName,
					result?.holdingsData?.isin,
					result?.holdingsData?.schemeCode
				)}/external`
			}
		];

		holdingsData = result?.holdingsData;
		mappingScheme = result?.mappingScheme;
		fundChartData = result?.chartData?.chart;
		benchmarkData = result?.benchmarkData;

		const userType = userStore?.userType();
		const externalSchemePlan = holdingsData?.schemePlan?.toUpperCase();

		if (
			(userType === 'B2C' && externalSchemePlan === 'DIRECT') ||
			(userType === 'B2B' && externalSchemePlan === 'REGULAR')
		) {
			// if the external fund is direct/b2c or regular/b2b, same scheme is also available and can be invested in angel one
			const { schemeName, isin, schemeCode, schemePlan } = holdingsData;
			mappingScheme = { schemeName, isin, schemeCode, schemePlan };
		}

		isInvestmentNotAllowed = !isInvestmentAllowed(userStore?.userType(), holdingsData?.schemePlan);
	}

	$: {
		setPageData(data.api?.allResponse);
	}

	let allResponse: Promise<AllResponseSchema> | AllResponseSchema;
	$: allResponse = data.api?.allResponse;

	const handleErrorNavigation = () => goto('/');

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	let showMappingSchemeModal = false;

	const onExploreFundsClicked = () => {
		goto(`${base}/categories?id=101`);

		externalInvestmentInvestMoreClickEvent({
			isin: holdingsData?.isin,
			mappedisin: mappingScheme.isin,
			CTAvalue: 'Explore'
		});
	};

	const onInvestMoreClicked = () => {
		const externalFundSchemePlan = holdingsData?.schemePlan?.toLowerCase() || '';
		const mappedFundSchemePlan = mappingScheme?.schemePlan?.toLowerCase() || '';

		// if the external and mapped fund have same scheme plan, directly go to orderpad
		if (externalFundSchemePlan === mappedFundSchemePlan) {
			const { schemeName, isin, schemeCode } = mappingScheme;
			goto(`${base}/schemes/${normalizeFundName(schemeName, isin, schemeCode)}?orderpad=INVEST`);
		} else {
			showMappingSchemeModal = true;
		}

		externalInvestmentInvestMoreClickEvent({
			isin: holdingsData?.isin,
			mappedisin: mappingScheme.isin,
			CTAvalue: 'InvestMore'
		});
	};

	const handleUpdateLineChart = async (tagIndex: number) => {
		const fundName = $page?.params['investment'];
		const allResData = await allResponse;
		const benchMarkCoCode = allResData?.holdingsData?.benchMarkCoCode;
		const isExternal = true;

		let res = await updateLineChart(tagIndex, fundName, benchMarkCoCode, isExternal);

		fundChartData = res?.[0] || [];
		benchmarkData = res?.[1] || {};
	};
</script>

<SEO
	seoTitle="Mutual Fund External Investment Analysis | Angel One"
	seoDescription="Get your mutual fund external investment"
/>
{#await data.api.allResponse}
	<InvestmentDetailsLoader />
{:then res}
	{#if res.holdingsData && Object.keys(res.holdingsData)?.length > 0}
		<!-- Left Side -->
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />

			<!-- Investment Details Page (Mobile and Desktop Layout) -->
			<LeftSideView
				{fundChartData}
				{benchmarkData}
				{mappingScheme}
				holdings={res.holdingsData}
				chartData={res.chartData}
				ordersData={res.ordersData}
				schemeDetails={res.schemeData}
				on:portfolioChartTagChange={(e) => handleUpdateLineChart(e?.detail)}
			/>

			{#if isMobile || isTablet}
				{#if browser}
					<div class="mb-44 sm:mb-0" />
					<article class="fixed inset-0 top-auto z-20 block md:hidden">
						<ExternalInvestmentDetailsFooter
							isMappingSchemeAvailable={Object.keys(mappingScheme)?.length > 0}
							on:exploreFundsClicked={onExploreFundsClicked}
							on:investMoreClicked={onInvestMoreClicked}
						/>
					</article>
				{:else}
					<article class="fixed inset-0 top-auto z-20 block bg-background-alt md:hidden">
						<ExternalInvestmentFooterLoader />
					</article>
				{/if}
			{/if}
		</section>

		<!-- layout for desktop mode -->
		{#if !(isMobile || isTablet)}
			{#if browser}
				<article class="sticky -top-2 mt-[52px] hidden md:block">
					<ExternalInvestmentDetailsFooter
						isMappingSchemeAvailable={Object.keys(mappingScheme)?.length > 0}
						on:exploreFundsClicked={onExploreFundsClicked}
						on:investMoreClicked={onInvestMoreClicked}
					/>
				</article>
			{:else}
				<article class="sticky -top-2 mt-[52px] hidden md:block">
					<ExternalInvestmentFooterLoader />
				</article>
			{/if}
		{/if}
	{:else}
		<section class="col-span-full">
			<ErrorView
				Icon={PortfolioEmptyIcon}
				heading="No Investment Found"
				contentLine="You have not invested in this fund currently. Explore mutual funds to start a new investment"
				textForButton="EXPLORE MUTUAL FUNDS"
				handleCTAClick={handleErrorNavigation}
			/>
		</section>
	{/if}
{/await}

{#if showMappingSchemeModal}
	<MappingSchemeModal
		externalIsin={holdingsData?.isin}
		on:backdropclicked={() => (showMappingSchemeModal = !showMappingSchemeModal)}
		{mappingScheme}
	/>
{/if}
