<script lang="ts">
	import ErrorView from '$components/ErrorView.svelte';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';
	import HoldingsOverview from './HoldingsOverview.svelte';
	import AssetAnalysis from './AssetAnalysis.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import type { PageData } from './$types';
	import type { Tag } from '$lib/types/IPortfolioDetails';

	const handleErrorNavigation = () => '';
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
			<PageTitle title="Portfolio Analysis" class="mb-0 lg:mb-4" />
			<HoldingsOverview
				folioSummary={response.summaryData.summary}
				chartDataList={ChartDataToSend}
				showGraphTags={true}
				on:portfolioChartTagChange={updateLineChart}
			/>
		</section>
		<section>
			<AssetAnalysis />
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
