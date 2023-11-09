<script lang="ts">
	import DoughnutChart from '$components/Charts/DoughnutChart.svelte';
	import { getColorSchemeForScore } from '$components/SipHealth/utils.js';

	export let score: number;
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

	const plugin = {
		id: 'customCanvasBackgroundColor',
		beforeDraw: (chart, args, options) => {
			const { ctx } = chart;
			const radius = chart._metasets[0].controller.innerRadius;
			const x = chart.getDatasetMeta(0).data[0].x;
			const y = chart.getDatasetMeta(0).data[0].y;
			ctx.arc(x, y, radius, 0, 2 * Math.PI);
			ctx.fillStyle = options.fill;
			ctx.fill();
		}
	};

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

<div class="relative h-24 w-24 {$$props.class}">
	<DoughnutChart
		chartPlugins={[plugin]}
		data={doughnutData}
		chartOptions={doughnutChartOptions}
		tooltipLength={0}
		chartClass="m-0 p-0 rotate-180"
	/>
	<div
		class={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-medium text-${selectedColorClass}`}
	>
		<p>{score}</p>
	</div>
</div>
