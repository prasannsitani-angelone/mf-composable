<script lang="ts">
	import { onMount } from 'svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import { goto } from '$app/navigation';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import AssetAnalysis from './AssetAnalysis.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import InvestmentPortfolioLoader from './components/InvestmentPortfolioLoader.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { PageData } from './$types';
	import type {
		ChartDataType,
		DistributionType,
		BenchmarkDataType
	} from '$lib/types/IPortfolioDetails';
	import type {
		IOPtimsiePortfolioData,
		InternalInvestmentSummary,
		InvestmentSummary
	} from '$lib/types/IInvestments';
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';
	import {
		portfolioAnalysisScreenOpenAnalytics,
		graphYearSelectAnalytics,
		portfolioBenchmarkInfoIconClickAnalytics,
		portfolioBenchmarkPopupOpenAnalytics
	} from '../analytics';
	import { SEO } from 'svelte-components';
	import SipHealthNudge from '$components/SipHealth/Nudge/SipHealthNudge.svelte';
	import TaxAnalysis from './components/TaxAnalysis.svelte';
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import { goBackToSpark } from '$lib/utils';
	import PortfolioOverview from './components/PortfolioOverview.svelte';
	import PortfolioGraph from './components/PortfolioGraph.svelte';
	import { tags } from '$lib/constants/tags';
	import OptimisePortfolioCard from '../(dashboard)/components/OptimisePortfolioCard.svelte';
	import type { InvestmentEntity } from '$lib/types/IInvestments';
	import LazyComponent from '$components/LazyComponent.svelte';

	let fundChartData: Array<ChartDataType>;
	let benchmarkData: BenchmarkDataType;
	let isOptimisePortfolioOpen = false;
	let recommendedSipsData: IOPtimsiePortfolioData = {
		isin: '',
		schemeCode: '',
		schemeName: '',
		logoUrl: ''
	};
	let investmentSummary: InvestmentSummary;
	let optimisedScheme: InvestmentEntity;

	$: benchmarkSummary = benchmarkData?.summary;
	$: benchmarkComparison =
		benchmarkSummary?.portReturnsOverBm < 0
			? `${benchmarkSummary?.portReturnsOverBm?.toFixed(2)}% less`
			: benchmarkSummary?.portReturnsOverBm > 0
			? `${benchmarkSummary?.portReturnsOverBm?.toFixed(2)}% better`
			: 'Equal';

	const graphYearSelectAnalyticsFunc = (tagIndex: number) => {
		const eventMetaData = {
			YOY: `${tags[tagIndex]?.label} Returns`
		};

		graphYearSelectAnalytics(eventMetaData);
	};

	const portfolioAnalysisScreenOpenAnalyticsFunc = (allResData: AllResponseSchema) => {
		const folioSummary = allResData?.summaryData;
		const benchmarkChart = allResData?.benchmarkData?.holdingChart;

		const eventMetaData = {
			CurrentValue: parseFloat(folioSummary?.currentValue?.toFixed(2)),
			TotalInvested: parseFloat(folioSummary?.investedValue?.toFixed(2)),
			OverallReturn: `${folioSummary?.returnsValue?.toFixed(
				2
			)} (${folioSummary?.returnsAbsolutePer?.toFixed(2)}%)`,
			TodaysReturn: `${folioSummary?.previousDayReturns?.toFixed(
				2
			)} (${folioSummary?.previousDayReturnPercentage?.toFixed(2)}%)`,
			XIRR: Math.abs(folioSummary?.xirr)?.toFixed(2),
			BenchMark: folioSummary?.benchmarkName || '',
			BenchMarkComparison: benchmarkComparison,
			BenchMarkValue: benchmarkChart?.[0]?.value?.toFixed(2)
		};

		portfolioAnalysisScreenOpenAnalytics(eventMetaData);
	};

	const handleErrorNavigation = () => {
		if ($appStore.openViaTabView || appStore.isMFTabAvailable()) {
			goBackToSpark();
		} else {
			goto(`${base}/discoverfunds`);
		}
	};

	const breadCrumbs = [
		{
			text: 'Your Investments',
			href: '/investments'
		},
		{
			text: 'Portfolio Analysis',
			href: '/investments/portfolio'
		}
	];
	export let data: PageData;

	type AllResponseSchema = {
		chartData: ChartDataResponseObj;
		summaryData: InternalInvestmentSummary;
		distributionData: DistributionDataResponseObj;
		benchmarkData: BenchmarkDataType;
	};

	let allResponse: Promise<AllResponseSchema> | AllResponseSchema;
	$: allResponse = data.api.allResponse;

	type ChartDataResponseObj = {
		chart: ChartDataType[];
	};

	type DistributionDataResponseObj = {
		distributions: DistributionType[];
	};

	const toggleOptimisePorfolioCard = (flag: boolean) => {
		isOptimisePortfolioOpen = flag;
	};

	const updateLineChart = async (tagIndex: number) => {
		graphYearSelectAnalyticsFunc(tagIndex);
		let res;

		const allResData = await allResponse;
		const fundChartUrl = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?chart=true&months=${tags[tagIndex].months}`;
		const benchmarkUrl = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/simulate?index=${allResData?.summaryData?.benchMarkCoCode}&months=${tags[tagIndex].months}`;

		const fundChartRes = await useFetch(fundChartUrl, {}, fetch);
		if (allResData?.summaryData?.isEquityPortfolioFlag) {
			const benchmarkRes = await useFetch(benchmarkUrl, {}, fetch);
			res = [fundChartRes, benchmarkRes];
		} else {
			res = [fundChartRes];
		}

		allResponse = allResData;

		(fundChartData =
			res[0].ok && res[0].data?.status === 'success' ? res[0].data?.data?.chart || [] : []),
			(benchmarkData = res?.[1]?.ok ? res?.[1]?.data || [] : []),
			(allResponse = allResponse);
	};

	const benchmarkInfoIconClickAnalytics = (summaryData: InternalInvestmentSummary) => {
		const eventMetaData = {
			BenchMark: summaryData?.benchmarkName || '',
			BenchMarkComparision: benchmarkComparison,
			BenchMarkValue: benchmarkData?.holdingChart?.[0]?.value?.toFixed(2) || '',
			InvestedValue: Math.abs(summaryData?.investedValue)?.toFixed(2) || '',
			InvestmentType: 'AngelOne'
		};
		portfolioBenchmarkInfoIconClickAnalytics(eventMetaData);
		portfolioBenchmarkPopupOpenAnalytics(eventMetaData);
	};

	onMount(async () => {
		const allResData = await allResponse;
		fundChartData = allResData.chartData?.chart;
		benchmarkData = allResData.benchmarkData;
		portfolioAnalysisScreenOpenAnalyticsFunc(allResData || {});

		let response = await data?.api?.recommendedSipsData;
		recommendedSipsData = response?.recommendedScheme?.[0];
		investmentSummary = data?.investementSummary;
		const investmentData = await data?.api?.investmentData;
		optimisedScheme = investmentData?.find((x) => x.sipEnabled) || ({} as InvestmentEntity);
	});
</script>

<SEO
	seoTitle="Mutual Fund Investment Portfolio Analysis | Angel One"
	seoDescription="'Get your mutual fund investment portfolio analysis including portfolio detailed structure and investment returns, etc.'"
/>

{#await allResponse}
	<InvestmentPortfolioLoader />
{:then response}
	{@const summaryData = response?.summaryData}
	{@const distributionData = response?.distributionData}
	{#if summaryData}
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />
			<PageTitle title="Portfolio Analysis" class="mb-0 lg:mb-4" />
			<PortfolioOverview folioSummary={summaryData} xirr={summaryData?.xirr} />
			<PortfolioGraph
				bind:fundChartData
				bind:benchmarkData
				isEquityPortfolioFlag={summaryData?.isEquityPortfolioFlag}
				on:portfolioChartTagChange={(e) => updateLineChart(e?.detail)}
				on:benchmarkInfoClick={() => benchmarkInfoIconClickAnalytics(summaryData)}
			/>
		</section>
		<SipHealthNudge class="mb-2 mt-2 w-full sm:mt-4" cardStyle="sm:px-3" />
		<section class="mt-2 sm:mt-4">
			{#if recommendedSipsData?.schemeCode && recommendedSipsData?.schemeName && recommendedSipsData?.isin}
				<OptimisePortfolioCard
					on:click={() => toggleOptimisePorfolioCard(true)}
					currentSchemeLogo={recommendedSipsData?.firstSchemeLogoUrl || ''}
					peopleInvested={recommendedSipsData?.clientWithMultipleSips}
					class={'!shadow'}
				/>
			{/if}
		</section>
		{#await data?.api?.taxation}
			<div />
		{:then res}
			<TaxAnalysis taxationData={res} class="mt-2 sm:mt-4" />
		{/await}
		<section>
			{#if distributionData.distributions?.length}
				<AssetAnalysis summary={summaryData} distributions={distributionData.distributions} />
			{/if}
		</section>
	{:else}
		<section>
			<ErrorView
				Icon={PortfolioEmptyIcon}
				heading="Your Portfolio is Empty"
				contentLine="Explore mutual funds to start building your portfolio"
				textForButton="EXPLORE MUTUAL FUNDS"
				handleCTAClick={handleErrorNavigation}
			/>
		</section>
	{/if}
{:catch error}
	<div>
		<ErrorLoadingComponent
			title="Error Fetching Portfolio Data"
			message="We could not fetch your portfolio due to a technical error. Please try again."
		/>
	</div>
{/await}

<LazyComponent
	when={isOptimisePortfolioOpen}
	component={async () => await import('../(dashboard)/components/OptimisePortfolioModal.svelte')}
	{toggleOptimisePorfolioCard}
	{investmentSummary}
	currentScheme={optimisedScheme}
	optimisePorfolioData={recommendedSipsData}
/>
