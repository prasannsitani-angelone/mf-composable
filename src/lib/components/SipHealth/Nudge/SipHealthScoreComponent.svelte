<script lang="ts">
	import DoughnutChart from '$components/Charts/DoughnutChart.svelte';
	import { getColorSchemeForScore } from '$components/SipHealth/utils.js';
	import { customCanvasBackgroundColorPlugin } from '$components/Charts/utils.js';

	export let score: number;
	export let scoreNumberClass = '';
	export let chartWidth = 65;
	export let chartHeight = 65;

	$: selectedColor = getColorSchemeForScore(score);

	let selectedColorClass = '';

	$: {
		if (selectedColor?.primary === '#D64D4D') {
			selectedColorClass = 'red-errorDark';
		} else if (selectedColor?.primary === '#F9BA4D') {
			selectedColorClass = 'yellow-primary';
		} else if (selectedColor?.primary === '#008F75') {
			selectedColorClass = 'green-amount';
		}
	}

	$: doughnutData = {
		datasets: [
			{
				backgroundColor: [selectedColor.primary, selectedColor.secondary],
				hoverBackgroundColor: [selectedColor.primary, selectedColor.secondary],
				data: [score, 100 - score],
				cutout: '80%',
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
			tooltip: {
				enabled: false,
				callbacks: {},
				external: function () {
					return;
				}
			},
			customCanvasBackgroundColor: {
				fill: 'white'
			}
		}
	};
</script>

<div class={`relative h-[${chartWidth}px] w-[${chartWidth}px] ${$$props.class}`}>
	<DoughnutChart
		chartPlugins={[customCanvasBackgroundColorPlugin]}
		data={doughnutData}
		chartOptions={doughnutChartOptions}
		tooltipLength={0}
		chartClass="m-0 p-0 ml-0.5"
		width={chartWidth}
		height={chartHeight}
	/>
	<div
		class={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-medium text-${selectedColorClass} ${
			scoreNumberClass || ''
		}`}
	>
		<p>{score}</p>
	</div>
</div>
