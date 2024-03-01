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
	import { getRGBACssVar } from '$lib/utils/colors';

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
				borderColor: getRGBACssVar('--BACKGROUND', 1),
				offset: 0,
				hoverOffset: 3,
				borderJoinStyle: 'round',
				labelUnit: '%'
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

<div id={parentId} class="relative rounded-lg px-3 py-2 lg:border">
	<DoughnutChart
		chartParentId={`${parentId}-doughnut-chart-parent`}
		data={doughnutData}
		chartId={parentId}
		chartClass="!h-64 m-auto !w-64"
		{tooltipLength}
		width={256}
		height={256}
		{chartOptions}
	/>
</div>
