<script lang="ts">
	import PortfolioHighlights from './PortfolioHighlights.svelte';
	import HighlightsLineChart from './HighlightsLineChart.svelte';
	import Card from '$components/Card.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import CalendarTickIcon from '$lib/images/icons/CalendarTickIcon.svelte';
	import type { FolioSummaryTypes } from '$lib/types/IInvestments';
	import type { ChartDataType } from '$lib/types/IPortfolioDetails';

	export let folioSummary: FolioSummaryTypes;
	export let chartDataList: Array<ChartDataType>;
	export let showGraphTags: boolean;
	type ChartData = {
		data: string[];
		timestamp: number[];
	};
	let prepareChartData: ChartData;
	$: prepareChartData = {
		data: chartDataList.map((each) => each.value?.toFixed(2)),
		timestamp: chartDataList.map((each) => each.timestamp)
	};
	$: chartData = prepareChartData.data;
	$: chartLabel = prepareChartData.timestamp;
</script>

<article>
	<Card
		class={`
            border-0 border-grey-line pb-0 text-lg
            md:px-6 md:pt-5 ${folioSummary?.sipEnabled ? 'max-sm:pb-4' : ''}`}
	>
		<section>
			<PortfolioHighlights data={folioSummary} />
			<article class="mt-10 lg:mt-20">
				<HighlightsLineChart
					data={chartData}
					label={chartLabel}
					{showGraphTags}
					on:portfolioChartTagChange
				/>
			</article>
		</section>
		<!-- Visible only for SIPs enabled cases -->
		<!-- This section is not visible on portfolio details page as the data doesnot have "sipEnabled" kry. -->
		{#if folioSummary?.sipEnabled}
			<section
				class="flex items-end justify-center rounded bg-grey py-2.5 text-sm font-medium text-black-title lg:mx-0 lg:bg-inherit lg:py-5"
			>
				<CalendarTickIcon class="mr-3" />
				<div>
					<span class="mr-1 text-grey-body"> Next SIP date: </span>
					<span>
						{getDateTimeString(folioSummary?.nextSipDate, 'DATE', true)}
					</span>
				</div>
			</section>
		{:else}
			<span />
		{/if}
	</Card>
</article>
