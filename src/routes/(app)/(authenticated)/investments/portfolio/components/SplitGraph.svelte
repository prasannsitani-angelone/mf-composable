<script lang="ts">
	import DoughnutChart from '$lib/components/Charts/DoughnutChart.svelte';
	import { generateGraphDataset } from '../utils';
	import {
		addCommasToAmountString,
		getRoundedOffLargeAmounts,
		getAmountUnit
	} from '$lib/utils/helpers/formatAmount';
	import { getResponsiveFontSize } from '$lib/utils/helpers/charts';
	import type { TableDataTypes } from '$lib/types/IPortfolioDetails';

	export let parentId: string;
	export let holding: TableDataTypes[];
	export let graphColor: string[];
	export let aum = 0;
	export let subLabel = '';

	const tooltipLength = getResponsiveFontSize(30);

	const doughnutBorderWidth = getResponsiveFontSize(4);

	let prepDoughnutData = {
		labels: [''],
		datasets: [
			{
				backgroundColor: graphColor,
				hoverBackgroundColor: graphColor,
				hoverBorderColor: graphColor,
				data: [''],
				cutout: '70%',
				borderRadius: 0,
				borderWidth: doughnutBorderWidth,
				borderAlign: 'inner',
				borderColor: '#F4F6FB',
				offset: 0,
				hoverOffset: 3,
				borderJoinStyle: 'round'
			}
		]
	};

	$: doughnutData = prepDoughnutData;

	let prepChartOptions = {
		plugins: {
			tooltipLine: {
				heading: '',
				subHeading: ''
			}
		}
	};

	$: chartOptions = prepChartOptions;

	const graphData = (holdings: TableDataTypes[]) => {
		if (holdings) {
			const holdingDataset = generateGraphDataset(holdings);

			prepDoughnutData.labels = holdingDataset.label;
			prepDoughnutData.datasets[0].data = holdingDataset.data;
			prepChartOptions.plugins.tooltipLine.heading = `₹${
				aum
					? addCommasToAmountString(getRoundedOffLargeAmounts(aum)?.toString())
					: aum === 0
					? aum
					: '-'
			} ${getAmountUnit(aum)}`;
			prepChartOptions.plugins.tooltipLine.subHeading = subLabel;
			prepDoughnutData = prepDoughnutData;
			prepChartOptions = prepChartOptions;
		}
	};
	$: {
		graphData(holding);
	}
</script>

<div id={parentId} class="relative rounded-lg py-2 px-3 lg:border">
	<DoughnutChart
		data={doughnutData}
		chartId={parentId}
		chartClass="!h-64 m-auto !w-64"
		{tooltipLength}
		width={10}
		height={10}
		{chartOptions}
	/>
</div>
