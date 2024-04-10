<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { tags } from '$lib/constants/tags';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import { appStore } from '$lib/stores/SparkStore';
	import type { ITaxation, InvestmentSummary } from '$lib/types/IInvestments';
	import type {
		BenchmarkDataType,
		ChartDataResponseObj,
		ChartDataType,
		DistributionDataResponseObj
	} from '$lib/types/IPortfolioDetails';
	import { goBackToSpark } from '$lib/utils';
	import { useFetch } from '$lib/utils/useFetch';
	import { onMount } from 'svelte';
	import { SEO } from 'svelte-components';
	import AssetAnalysis from '../AssetAnalysis.svelte';
	import InvestmentPortfolioLoader from '../components/InvestmentPortfolioLoader.svelte';
	import PortfolioGraph from '../components/PortfolioGraph.svelte';
	import PortfolioOverview from '../components/PortfolioOverview.svelte';
	import TaxAnalysis from '../components/TaxAnalysis.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let fundChartData: Array<ChartDataType>;
	let summaryData: InvestmentSummary;
	let distributionData: DistributionDataResponseObj;
	let benchmarkData: BenchmarkDataType;
	let taxationData: ITaxation;

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

	type AllResponseSchema = {
		chartData: ChartDataResponseObj;
		summaryData: InvestmentSummary;
		distributionData: DistributionDataResponseObj;
		benchmarkData: BenchmarkDataType;
	};

	let allResponse: Promise<AllResponseSchema> | AllResponseSchema;
	$: allResponse = data.api.allResponse;

	const updateLineChart = async (tagIndex: number) => {
		let res;

		const allResData = await allResponse;
		const fundChartUrl = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?external=true&chart=true&months=${tags[tagIndex].months}`;
		const benchmarkUrl = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/simulate?isExternal=true&index=${allResData?.summaryData?.benchmarkCoCode}&months=${tags[tagIndex].months}`;

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

	const updatePageData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?external=true`;
		const taxationUrl = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/taxations?external=true`;

		const summaryRes = useFetch(url + '&summary=true', {}, fetch);
		const chartRes = useFetch(url + '&chart=true' + '&months=240', {}, fetch);
		const distributionRes = useFetch(url + '&distribution=true', {}, fetch);
		const taxationRes = useFetch(taxationUrl, {}, fetch);

		const resData = await Promise.all([summaryRes, chartRes, distributionRes, taxationRes]);

		if (resData[0].ok && resData[0].data?.data?.summary?.isEquityPortfolioFlag) {
			const benchMarkCoCode = resData[0].data?.data?.summary?.benchmarkCoCode;
			const benchMarkUrl = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings/simulate?index=${benchMarkCoCode}&months=240&isExternal=true`;
			const benchmarkRes = await useFetch(benchMarkUrl, {}, fetch);
			benchmarkData = benchmarkRes.ok ? benchmarkRes?.data || {} : {};
		}

		(summaryData = resData[0].ok ? resData[0].data?.data?.summary || {} : {}),
			(fundChartData =
				resData[1].ok && resData[1].data?.status === 'success' ? resData[1].data?.data || {} : {}),
			(distributionData =
				resData[2].ok && resData[2].data?.status === 'success' ? resData[2].data?.data || {} : {}),
			(taxationData = resData[3].ok ? resData[3]?.data || {} : {});
	};

	onMount(async () => {
		const allResData = await allResponse;
		summaryData = allResData.summaryData;
		fundChartData = allResData.chartData?.chart;
		distributionData = allResData.distributionData;
		benchmarkData = allResData.benchmarkData;
		taxationData = await data?.api?.taxation;
	});
</script>

<SEO
	seoTitle="Mutual Fund Investment Portfolio Analysis | Angel One"
	seoDescription="'Get your mutual fund investment portfolio analysis including portfolio detailed structure and investment returns, etc.'"
/>

{#await allResponse}
	<InvestmentPortfolioLoader />
{:then}
	{#if summaryData}
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />
			<PageTitle title="Portfolio Analysis" class="mb-0 lg:mb-4" />
			<PortfolioOverview
				{data}
				folioSummary={summaryData}
				xirr={summaryData?.xirr}
				isExternal={true}
				on:fetchFundsSuccess={updatePageData}
			/>
			{#if fundChartData}
				<PortfolioGraph
					bind:fundChartData
					bind:benchmarkData
					isEquityPortfolioFlag={summaryData?.isEquityPortfolioFlag}
					on:portfolioChartTagChange={(e) => updateLineChart(e?.detail)}
				/>
			{/if}
		</section>
		{#await data?.api?.taxation}
			<div />
		{:then}
			{#if taxationData?.stcgCurAmount !== 0 && taxationData?.ltcgCurAmount !== 0}
				<TaxAnalysis isExternal={true} {taxationData} class="mt-2 sm:mt-4" />
			{/if}
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
