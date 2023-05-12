<script lang="ts">
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

	const handleErrorNavigation = () => goto('/');
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
</script>

{#await allResponse}
	<InvestmentPortfolioLoader />
{:then response}
	{#if response.summaryData.summary}
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />
			<PageTitle title="Portfolio Analysis" class="mb-0 lg:mb-4" />
			<HoldingsOverview
				folioSummary={response.summaryData.summary}
				chartDataList={response.chartData.chart}
				showGraphTags={true}
				on:portfolioChartTagChange={updateLineChart}
			/>
		</section>
		<section>
			<AssetAnalysis
				summary={response.summaryData.summary}
				distributions={response.distributionData.distributions}
			/>
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
	<div>Got An error!!!</div>
{/await}
