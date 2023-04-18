<script lang="ts">
	import Button from '$components/Button.svelte';
	import DoughnutChart from '$components/Charts/DoughnutChart.svelte';
	import DownArrowIcon from '$lib/images/icons/DownArrowIcon.svelte';
	import FundHoldingIcon from '$lib/images/icons/FundHoldingIcon.svelte';
	import UpArrowIcon from '$lib/images/icons/UpArrowIcon.svelte';
	import type { SchemeHoldings } from '$lib/types/ISchemeDetails';
	import { generateGraphDataset } from '../helper';
	import type { TopHolding, TopHoldingSummary } from '../types';
	import HoldingTable from './HoldingTable.svelte';

	$: showAllHoldings = false;
	let remaningHoldings: TopHolding[];

	let fundHoldingData: Array<SchemeHoldings>;
	const graphColor = ['#F9BA4D', '#4BD9EA', '#581DBE', '#1EC7B6', '#F65E5A', '#3F5BD9'];

	$: topHoldingSummary = <TopHoldingSummary>(<unknown>[]);
	const doughnutChartOptions = {
		plugins: {
			tooltipLine: {
				heading: '15,120',
				subHeading: 'Crores'
			}
		}
	};
	const setTableData = (holdings: SchemeHoldings[]) => {
		if (!holdings?.length) {
			return [];
		}
		let sortedHoldings: TopHolding[] = holdings.sort((a, b) =>
			a.percentageHold > b.percentageHold ? -1 : 1
		);

		let topHolding = sortedHoldings.slice(0, 5);

		remaningHoldings = sortedHoldings?.slice(5, sortedHoldings.length);

		const topHoldingPercentage = topHolding.reduce((prevVal, currentVal) => {
			return prevVal + currentVal.percentageHold;
		}, 0);
		const otherHoldingsPercentage = parseFloat((100 - topHoldingPercentage).toFixed(2));
		topHolding = topHolding.map((holding, index) => {
			holding.colorCode = graphColor[index];
			return holding;
		});
		topHolding = [
			...topHolding,
			{
				companyName: 'Others',
				percentageHold: otherHoldingsPercentage,
				colorCode: graphColor[graphColor.length - 1]
			}
		];

		return topHolding;
	};
	const schemeTopHolding = setTableData(fundHoldingData);
	topHoldingSummary = generateGraphDataset(schemeTopHolding) || { label: [], data: [] };

	const doughnutData = {
		labels: topHoldingSummary.label,
		datasets: [
			{
				backgroundColor: graphColor,
				hoverBackgroundColor: graphColor,
				hoverBorderColor: graphColor,
				data: topHoldingSummary.data,
				cutout: '70%',
				borderRadius: 0,
				borderWidth: 2, // can make responsive
				borderAlign: 'inner',
				borderColor: '#F4F6FB',
				offset: 0,
				hoverOffset: 3,
				borderJoinStyle: 'round'
			}
		]
	};

	export { fundHoldingData };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm">
	<header class="mb-6 border border-b border-grey-line">
		<section
			class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
		>
			<section class="flex items-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
					<FundHoldingIcon />
				</div>
				<h2 class="ml-3 flex items-center text-left font-medium text-black-title">
					<span> Fund Holdings</span>
				</h2>
			</section>
		</section>
	</header>
	<DoughnutChart
		data={doughnutData}
		chartOptions={doughnutChartOptions}
		tooltipLength={50}
		chartClass="w-48 h-48 m-auto mt-2"
	/>

	<section class="mt-9 px-6">
		<HoldingTable topHolding holdings={schemeTopHolding} />
		{#if showAllHoldings}
			<section class="mt-7">
				<h5 class="mb-4">Other Holdings</h5>

				<HoldingTable holdings={remaningHoldings} />
			</section>
		{/if}
	</section>

	<footer class="mt-5 flex items-center justify-center px-6">
		<Button
			class="uppercase"
			variant="transparent"
			endAdornment={showAllHoldings ? UpArrowIcon : DownArrowIcon}
			onClick={() => (showAllHoldings = !showAllHoldings)}
		>
			{#if !showAllHoldings}
				Show all
			{:else}
				Hide All
			{/if}
		</Button>
	</footer>
</article>
