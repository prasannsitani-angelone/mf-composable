<script>
	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import merge from 'lodash.merge';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	export let chartId = 'riskometer';
	export let width;
	export let height;
	export let chartPlugins = [];
	export let data = {};
	export let chartOptions = {};
	export let chartClass = '';

	$: plugins = merge(
		[
			{
				id: 'gaugeneedle',
				afterDatasetDraw(chart) {
					const {
						ctx,
						data,
						chartArea: { left, width },
						_metasets
					} = chart;
					ctx.save();

					const { needleValue, backgroundColor } = data.datasets[0];
					const datasetLength = data.datasets[0].data.length;

					const dataTotal = _metasets[0].total;
					const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;
					const activeElement =
						Math.floor(needleValue) === datasetLength
							? Math.floor(needleValue) - 1
							: Math.floor(needleValue);
					const radius = chart._metasets[1].data[0].innerRadius;
					const cx = left + width / 2;
					const cy = _metasets[0].data[0].y;

					const tenPointResposinve = (10 / 100) * radius;
					const fivePointResponsive = (5 / 100) * radius;
					const thirtyPointResponsive = (30 / 100) * radius;
					const twoPointResponsive = (2 / 100) * radius;
					_metasets[0].data[activeElement].outerRadius = width / 2;

					// needle
					const needleDistanceFromInnerCircle = thirtyPointResponsive;
					const needleYStartingPoint = radius - needleDistanceFromInnerCircle;
					ctx.translate(cx, cy);
					ctx.rotate(angle);
					ctx.beginPath();
					ctx.moveTo(needleYStartingPoint, -fivePointResponsive);
					ctx.lineTo(needleYStartingPoint + tenPointResposinve, 0);
					ctx.lineTo(needleYStartingPoint, fivePointResponsive);
					ctx.fillStyle = '#6A7582';
					ctx.fill();
					ctx.restore();

					// needle dots
					let movingAngle = 0;
					const radian = Math.PI / 180;
					const dotsPerDataset = 4;
					const dotsDistanceFromInnerCircle = tenPointResposinve;
					const dotsRadius = radius - dotsDistanceFromInnerCircle;
					const staticAngle = 180 / (dotsPerDataset * datasetLength);
					for (let i = 0; i <= dotsPerDataset * datasetLength; i++) {
						const x = cx - dotsRadius * Math.cos(movingAngle);
						const y = cy - dotsRadius * Math.sin(movingAngle);
						ctx.beginPath();
						ctx.arc(x, y, twoPointResponsive, 0, 10);
						if (i >= activeElement * dotsPerDataset && i <= (activeElement + 1) * dotsPerDataset) {
							ctx.fillStyle = backgroundColor[activeElement];
						} else {
							ctx.fillStyle = 'grey';
						}
						ctx.fill();
						ctx.restore();
						movingAngle += staticAngle * radian;
					}

					// text
					const text = data.labels[activeElement];
					ctx.font = '1rem Helvetica';
					ctx.fillStyle = '#6A7582';
					ctx.fillText(text, cx - ctx.measureText(text).width / 2, cy);
					ctx.restore();
				}
			}
		],
		chartPlugins
	);

	$: options = merge(
		{
			responsive: true,
			hover: { mode: null },
			maintainAspectRatio: true,
			aspectRatio: 2,
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					enabled: false
				}
			},
			layout: {
				padding: {
					top: 10,
					left: 10,
					bottom: 10,
					right: 10
				}
			}
		},
		chartOptions
	);
</script>

<div class="relative">
	<Doughnut id={chartId} {data} {width} {height} {plugins} {options} class={chartClass} />
</div>
