<script lang="ts">
	import DoughnutChart from '$components/Charts/DoughnutChart.svelte';
	import type { SchemeDetailsContext } from '$lib/types/ISchemeDetails';
	import { getContext } from 'svelte';
	import { SCHEME_DETAILS_KEY } from '../constants';

	let { getHoldingData } = getContext<SchemeDetailsContext>(SCHEME_DETAILS_KEY);
	const doughnutData = {
		labels: ['REC Ltd.', 'ABC Ltd.', 'DEF Ltd.', 'XYZ Ltd.', 'NOV Ltd.', 'DEC Ltd.'],
		datasets: [
			{
				backgroundColor: ['#F9BA4D', '#4BD9EA', '#581DBE', '#1EC7B6', '#F65E5A', '#3F5BD9'],
				hoverBackgroundColor: ['#F9BA4D', '#4BD9EA', '#581DBE', '#1EC7B6', '#F65E5A', '#3F5BD9'],
				hoverBorderColor: ['#F9BA4D', '#4BD9EA', '#581DBE', '#1EC7B6', '#F65E5A', '#3F5BD9'],
				data: [25, 15, 15, 10, 5, 30],
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

	const doughnutChartOptions = {
		plugins: {
			tooltipLine: {
				heading: '15,120',
				subHeading: 'Crores'
			}
		}
	};
</script>

{#await getHoldingData() then holdings}
	<DoughnutChart
		data={doughnutData}
		chartOptions={doughnutChartOptions}
		tooltipLength={50}
		chartClass="w-48 h-48 m-auto mt-2"
	/>
{/await}
