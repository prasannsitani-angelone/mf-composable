<script lang="ts">
	import ErrorView from '$components/ErrorView.svelte';
	import { goto } from '$app/navigation';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import HoldingsOverview from './HoldingsOverview.svelte';
	import AssetAnalysis from './AssetAnalysis.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { PageData } from './$types';
	import type { Tag } from '$lib/types/IPortfolioDetails';

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
	let chartData = data.api?.chartData?.chart || [];

	$: ChartDataToSend = chartData;

	const updateLineChart = async (data: { detail: Tag }) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?chart=true&months=${data.detail.months}`;

		const res = await useFetch(url, {}, fetch);
		if (res?.ok && res?.data?.status === 'success') {
			chartData = res.data.data?.chart || [];
		} else {
			chartData = [];
		}
	};
</script>

{#await data.api}
	Loading...............................!!
{:then response}
	{#if response.summaryData.summary}
		<section>
			<Breadcrumbs items={breadCrumbs} class="my-4 hidden items-center justify-start md:flex" />
			<PageTitle title="Portfolio Analysis" class="mb-0 lg:mb-4" />
			<HoldingsOverview
				folioSummary={response.summaryData.summary}
				chartDataList={ChartDataToSend}
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
