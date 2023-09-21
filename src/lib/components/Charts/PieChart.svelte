<script>
	import { Pie } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import merge from 'lodash.merge';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	export let chartId = 'pie-chart';
	export let width = '320px';
	export let height = '200px';
	export let chartPlugins = [];
	export let data = {};
	export let chartOptions = {};
	export let chartParentId = chartId + 'pie-chart-parent';
	export let chartClass = '';

	$: options = merge(
		{
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					align: 'center',
					position: 'bottom',
					onClick: () => null,
					labels: {
						boxWidth: 8,
						boxHeight: 8,
						padding: 16,
						color: '#2A394E',
						font: {
							size: 11,
							weight: 'normal'
						}
					}
				},
				tooltip: {
					enabled: false
				},
				dataInCenter: {
					enabled: true
				}
			}
		},
		chartOptions
	);

	$: plugins = merge(
		[
			{
				id: 'dataInCenter',
				afterDatasetDraw(chart) {
					const {
						ctx,
						chartArea: { left, width, height, top },
						_metasets
					} = chart;
					ctx.save();
					const segments = _metasets[0].data;
					const data = _metasets[0]._dataset;
					const cx = left + width / 2;
					const cy = top + height / 2;
					for (let i = 0; i < segments.length; i++) {
						ctx.fillStyle = 'white';
						const fontSize = 11;
						ctx.font = `${fontSize}px Roboto`;
						// Get needed variables
						const radius = segments[i].outerRadius;
						const value1 = data.displayData[i];
						const value2 = data.subDisplayData[i];
						const startAngle = segments[i].startAngle;
						const endAngle = segments[i].endAngle;
						if (startAngle !== endAngle) {
							const middleAngle = startAngle + (endAngle - startAngle) / 2;
							const posX = ((3 * radius) / 5) * Math.cos(middleAngle) + cx;
							const posY = ((3 * radius) / 5) * Math.sin(middleAngle) + cy;
							ctx.fillText(value1, posX - ctx.measureText(value1).width / 2, posY);
							ctx.restore();
							ctx.fillStyle = 'white';
							ctx.font = `${fontSize}px Roboto`;
							ctx.fillText(value2, posX - ctx.measureText(value2).width / 2, posY + fontSize + 4);
							ctx.restore();
						}
					}
				}
			}
		],
		chartPlugins
	);
</script>

<div id={chartParentId} class="relative">
	<Pie id={chartId} {data} {width} {height} {plugins} {options} class={chartClass} />
</div>
