<script lang="ts">
	import { page } from '$app/stores';
	import ImportFunds from '$lib/images/ImportFunds.svg';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
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
	export let isPartialImport: boolean;
	type ChartData = {
		data: string[];
		timestamp: number[];
	};
	let prepareChartData: ChartData;
	$: prepareChartData = {
		data: ((Array.isArray(chartDataList) && chartDataList) || []).map((each) =>
			each.value?.toFixed(2)
		),
		timestamp: ((Array.isArray(chartDataList) && chartDataList) || []).map((each) => each.timestamp)
	};
	$: chartData = prepareChartData.data;
	$: chartLabel = prepareChartData.timestamp;
	$: isExternal = $page?.data?.isExternal;
</script>

<article>
	<Card
		class={`
            border-0 border-grey-line px-0  pb-0
            text-lg md:pt-5 `}
	>
		<div class="px-4 md:px-6 {folioSummary?.sipEnabled ? 'max-sm:pb-4' : ''}">
			<section>
				<PortfolioHighlights data={folioSummary} {isPartialImport} />
				{#if !isPartialImport}
					<article class="mt-10 lg:mt-20">
						{#if chartData.length > 0}
							<HighlightsLineChart
								data={chartData}
								label={chartLabel}
								{showGraphTags}
								on:portfolioChartTagChange
								{isExternal}
							/>
						{:else}
							<div class="pb-8 text-center text-sm text-grey-body">
								<img
									src={ImportFunds}
									class="mb-4 inline-block"
									loading="lazy"
									alt="Illustration showing not able to fetch chart data"
								/>
								<div>Generating your investment value graph.</div>
								{#if isExternal}
									<div>
										This can take up to <span class="font-normal text-black">24 hours</span>
									</div>
								{/if}
							</div>
						{/if}
					</article>
				{/if}
			</section>
			<!-- Visible only for SIPs enabled cases -->
			<!-- This section is not visible on portfolio details page as the data doesnot have "sipEnabled" kry. -->
			{#if folioSummary?.sipEnabled && !isExternal}
				<section
					class="flex items-end justify-center rounded bg-grey py-2.5 text-sm font-normal text-black-title lg:mx-0 lg:bg-inherit lg:py-5"
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
		</div>
		{#if isExternal}
			<section
				class="flex items-center justify-center border-t py-3 text-xs font-normal text-black-title sm:mt-4 sm:text-sm lg:mx-0 lg:bg-inherit lg:py-5"
			>
				<div class="mr-1">
					<WMSIcon width={32} height={32} name="refresh-icon" />
				</div>
				<span>
					Last refreshed on {getDateTimeString(folioSummary?.lastSuccessfullImportTs, 'DATE', true)}
				</span>
			</section>
		{/if}
	</Card>
</article>
