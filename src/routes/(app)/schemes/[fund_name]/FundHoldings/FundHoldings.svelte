<script lang="ts">
	import DoughnutChart from '$components/Charts/DoughnutChart.svelte';
	import Table from '$components/Table/Table.svelte';
	import TBody from '$components/Table/TBody.svelte';
	import Th from '$components/Table/TH.svelte';
	import Tr from '$components/Table/TR.svelte';
	import THead from '$components/Table/THead.svelte';
	import FundHoldingIcon from '$lib/images/icons/FundHoldingIcon.svelte';
	import type { SchemeHoldings } from '$lib/types/ISchemeDetails';
	import { generateGraphDataset } from '../helper';
	import type { TopHoldingSummary } from '../types';
	import Td from '$components/Table/TD.svelte';

	interface TopHolding extends SchemeHoldings {
		colorCode?: string;
		percentageHold: number;
	}

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
		let topHolding: TopHolding[] = holdings
			.sort((a, b) => (a.percentageHold > b.percentageHold ? -1 : 1))
			.slice(0, 5);
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
		<Table class="border border-grey-line">
			<THead slot="thead" class="border-t border-grey-line">
				<Th class="w-3/5">Top Holding</Th>
				<Th class="text-right">Allocation</Th>
			</THead>
			<TBody slot="tbody">
				{#each schemeTopHolding as holdings}
					<Tr>
						<Td>
							<div class="flex items-center">
								<div
									class="mr-2 h-[6px] w-[6px] rounded-full"
									style={`background-color:${holdings.colorCode}`}
								/>
								<div>
									{holdings.companyName}
								</div>
							</div>
						</Td>
						<Td class="text-right">{holdings.percentageHold}%</Td>
					</Tr>
				{/each}
			</TBody>
		</Table>
	</section>
</article>
