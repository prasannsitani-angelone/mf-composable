<script lang="ts">
	import DoughnutChart from '$components/Charts/DoughnutChart.svelte';
	import { getColorSchemeForScore } from '$components/SipHealth/utils.js';

	export let score: number;
	$: selectedColor = getColorSchemeForScore(score);
	$: doughnutData = {
		datasets: [
			{
				backgroundColor: [selectedColor.primary, selectedColor.secondary],
				hoverBackgroundColor: [selectedColor.primary, selectedColor.secondary],
				data: [score, 100 - score],
				cutout: '70%',
				borderRadius: 0,
				borderWidth: 0, // can make responsive
				borderAlign: 'inner',
				offset: 0,
				borderJoinStyle: 'round'
			}
		]
	};

	const doughnutChartOptions = {
		plugins: {
			tooltipLine: {},
			tooltips: {
				enabled: false
			}
		}
	};
</script>

<div class="relative h-24 w-24 {$$props.class}">
	<DoughnutChart
		data={doughnutData}
		chartOptions={doughnutChartOptions}
		tooltipLength={0}
		chartClass="m-0 p-0"
	/>
	<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl">
		<p>{score}</p>
	</div>
</div>
