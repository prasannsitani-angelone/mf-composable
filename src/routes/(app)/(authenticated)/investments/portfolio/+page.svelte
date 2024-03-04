<script lang="ts">
	import { onMount } from 'svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import { goto } from '$app/navigation';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import HoldingsOverview from './HoldingsOverview.svelte';
	import AssetAnalysis from './AssetAnalysis.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import InvestmentPortfolioLoader from './components/InvestmentPortfolioLoader.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { PageData } from './$types';
	import type { Tag, ChartDataType, DistributionType } from '$lib/types/IPortfolioDetails';
	import type { FolioSummaryTypes } from '$lib/types/IInvestments';
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';
	import { portfolioAnalysisScreenOpenAnalytics, graphYearSelectAnalytics } from '../analytics';
	import { SEO } from 'svelte-components';
	import SipHealthNudge from '$components/SipHealth/Nudge/SipHealthNudge.svelte';
	import TaxAnalysis from './components/TaxAnalysis.svelte';
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import { goBackToSpark } from '$lib/utils';

	const graphYearSelectAnalyticsFunc = (selectedTag) => {
		let formattedSelectedTag = '';

		if (selectedTag?.months < 12) {
			formattedSelectedTag = `${selectedTag?.months}M Returns`;
		} else if (selectedTag?.months === 12) {
			formattedSelectedTag = '1Y Returns';
		} else if (selectedTag?.months === 36) {
			formattedSelectedTag = '3Y Returns';
		}

		const eventMetaData = {
			YOY: formattedSelectedTag
		};

		graphYearSelectAnalytics(eventMetaData);
	};

	const portfolioAnalysisScreenOpenAnalyticsFunc = (holdingDetails: FolioSummaryTypes) => {
		const eventMetaData = {
			CurrentValue: parseFloat(holdingDetails?.currentValue?.toFixed(2)),
			TotalInvestment: parseFloat(holdingDetails?.investedValue?.toFixed(2)),
			OverallReturn: `${holdingDetails?.returnsValue?.toFixed(
				2
			)} (${holdingDetails?.returnsAbsolutePer?.toFixed(2)}%)`,
			TodaysReturn: `${holdingDetails?.previousDayReturns?.toFixed(
				2
			)} (${holdingDetails?.previousDayReturnPercentage?.toFixed(2)}%)`
		};

		portfolioAnalysisScreenOpenAnalytics(eventMetaData);
	};

	const handleErrorNavigation = () => {
		if ($appStore.openViaTabView) {
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
		summaryData: FolioSummaryTypes;
		distributionData: DistributionDataResponseObj;
	};

	let allResponse: Promise<AllResponseSchema> | AllResponseSchema;
	$: allResponse = data.api.allResponse;

	type ChartDataResponseObj = {
		chart: ChartDataType[];
	};

	type DistributionDataResponseObj = {
		distributions: DistributionType[];
	};

	const updateLineChart = async (data: { detail: Tag }) => {
		graphYearSelectAnalyticsFunc(data.detail);
		const allResData = await allResponse;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?chart=true&months=${data.detail.months}`;
		const res = await useFetch(url, {}, fetch);
		allResponse = allResData;

		if (res?.ok && res?.data?.status === 'success') {
			allResponse.chartData.chart = res.data.data?.chart || [];
		} else {
			allResponse.chartData.chart = [];
		}
		allResponse = allResponse;
	};

	onMount(() => {
		allResponse.then((res) => {
			portfolioAnalysisScreenOpenAnalyticsFunc(res?.summaryData || {});
		});
	});
</script>

<SEO
	seoTitle="Mutual Fund Investment Portfolio Analysis | Angel One"
	seoDescription="'Get your mutual fund investment portfolio analysis including portfolio detailed structure and investment returns, etc.'"
/>

{#await allResponse}
	<InvestmentPortfolioLoader />
{:then response}
	{#if response.summaryData}
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />
			<PageTitle title="Portfolio Analysis" class="mb-0 lg:mb-4" />
			<HoldingsOverview
				folioSummary={response.summaryData}
				chartDataList={response.chartData.chart}
				showGraphTags={true}
				on:portfolioChartTagChange={updateLineChart}
			/>
		</section>
		<SipHealthNudge class="mb-2 mt-2 w-full sm:mt-4" cardStyle="sm:px-3" />
		{#await data?.api?.taxation}
			<div />
		{:then res}
			<TaxAnalysis taxationData={res} />
		{/await}
		<section>
			{#if response.distributionData.distributions?.length}
				<AssetAnalysis
					summary={response.summaryData}
					distributions={response.distributionData.distributions}
				/>
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
