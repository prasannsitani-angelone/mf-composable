<script>
	import { Pie } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import merge from 'lodash.merge';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	export let chartId = 'pie-chart';
	export let width = '320px';
	export let height = '160px';
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
					position: 'right',
					labels: {
						boxWidth: 5,
						boxHeight: 5,
						pointStyle: 'circle',
						usePointStyle: true,
						color: '#2A394E',
						font: {
							size: 12,
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
						ctx.font = '12px Verdana';
						// Get needed variables
						const radius = segments[i].outerRadius;
						const value = data.displayData[i];
						const startAngle = segments[i].startAngle;
						const endAngle = segments[i].endAngle;
						if (startAngle !== endAngle) {
							const middleAngle = startAngle + (endAngle - startAngle) / 2;
							const posX = (radius / 2) * Math.cos(middleAngle) + cx;
							const posY = (radius / 2) * Math.sin(middleAngle) + cy;
							const w_offset = ctx.measureText(value).width / 2;
							ctx.fillText(value, posX - w_offset, posY);
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
