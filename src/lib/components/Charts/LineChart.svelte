<script>
	import 'chartjs-adapter-date-fns';
	import { Line } from 'svelte-chartjs';
	import {
		Chart,
		LineElement,
		PointElement,
		LineController,
		LinearScale,
		TimeScale,
		TimeSeriesScale,
		Legend,
		Title,
		Tooltip,
		SubTitle,
		CategoryScale
	} from 'chart.js';
	import merge from 'lodash.merge';

	Chart.register(
		LineElement,
		PointElement,
		LineController,
		LinearScale,
		TimeScale,
		TimeSeriesScale,
		Legend,
		Title,
		Tooltip,
		SubTitle,
		CategoryScale
	);

	export let chartId = 'line-chart';
	export let width = 600;
	export let height = 600;
	export let chartPlugins = [];
	export let data = {};
	export let chartOptions = {};
	export let tooltipSymbol = '';
	export let chartClass = '';

	const formatDate = (navDate) => {
		navDate = navDate.split(',');
		navDate.pop();
		navDate = navDate.join(',');
		const date = new Date(navDate);
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'short' });
		const year = date.getFullYear()?.toString().substr(2, 2);

		return `${day} ${month} ${year}`;
	};

	$: plugins = merge(
		[
			{
				id: 'tooltipLine',
				afterDatasetsDraw: (chart) => {
					if (chart.tooltip?._active?.length) {
						const x = chart.tooltip._active[0].element.x;
						const y = chart.tooltip._active[0].element.y;
						const { hoverRadius, hoverBorderWidth } = chart.config.options.elements.point;
						const yAxis = chart.scales.y;
						const ctx = chart.ctx;
						ctx.save();
						ctx.beginPath();
						ctx.moveTo(x, yAxis.top);
						ctx.lineTo(x, y - (hoverRadius + hoverBorderWidth / 2));
						ctx.lineWidth = 1;
						ctx.strokeStyle = '#6A7582';
						ctx.stroke();
						ctx.restore();

						if (yAxis.bottom > y + (hoverRadius + hoverBorderWidth / 2)) {
							ctx.beginPath();
							ctx.moveTo(x, yAxis.bottom);
							ctx.lineTo(x, y + (hoverRadius + hoverBorderWidth / 2));
							ctx.lineWidth = 1;
							ctx.strokeStyle = '#6A7582';
							ctx.stroke();
							ctx.restore();
						}
					}
				}
			}
		],
		chartPlugins
	);

	$: options = merge(
		{
			responsive: true,
			maintainAspectRatio: true,
			elements: {
				line: {
					tension: 0,
					borderWidth: 1.5
				},
				point: {
					pointHoverBorderColor: '#3F5BD9',
					pointHoverBackgroundColor: '#fff',
					pointBackgroundColor: 'transparent',
					pointBorderColor: 'transparent',
					pointStyle: 'circle',
					borderWidth: 4,
					pointRadius: 7,
					hoverRadius: 7,
					hoverBorderWidth: 4
					// hitRadius: 1,
				}
			},
			scales: {
				y: {
					type: 'linear',
					display: false,
					position: 'left',
					// grid line settings
					grid: {
						display: false,
						drawOnChartArea: false // only want the grid lines for one axis to show up
					}
				},
				x: {
					type: 'time',
					time: {
						unit: 'year'
					},
					display: true,
					grid: {
						display: false,
						drawOnChartArea: false // only want the grid lines for one axis to show up
					},
					ticks: {
						source: 'auto',
						color: '#6A7582',
						padding: 0,
						font: {
							size: 14,
							family: 'Barlow',
							weight: 400
						}
					}
				}
			},
			layout: {
				padding: {
					top: 15,
					left: 15,
					bottom: 15,
					right: 15
				},
				height: 250
			},
			interaction: {
				intersect: false,
				mode: 'nearest',
				axis: 'xy'
			},
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					enabled: false,
					external: function (context) {
						// Tooltip Element
						const tooltipId = `${chartId}-tooltip`;
						let tooltipEl = document.getElementById(tooltipId);
						const chartParent = document.getElementById(chartId)?.parentNode;

						// Create element on first render
						if (!tooltipEl) {
							tooltipEl = document.createElement('div');
							tooltipEl.id = tooltipId;
							tooltipEl.style =
								'border: 1px solid #E8EBF1; background: #FFFFFF; box-shadow: 0px 2px 8px rgba(138, 141, 153, 0.16); border-radius: 4px; padding: 0.625rem 1rem; width: fit-content; opacity: 1;';
							tooltipEl.innerHTML = '';
							chartParent.appendChild(tooltipEl);
						}
						// Hide if no tooltip
						const tooltipModel = context.tooltip;
						if (tooltipModel.opacity === 0) {
							tooltipEl.style.opacity = 0;
							return;
						}

						const getBody = (bodyItem) => {
							return bodyItem.lines;
						};

						// Set Text
						if (tooltipModel.body) {
							const titleLines = tooltipModel.title || [];
							const bodyLines = tooltipModel.body.map(getBody);
							let innerHtml = '';

							bodyLines.forEach((body) => {
								let formattedText = '';

								if (body[0]?.includes(':')) {
									const splitArray = body[0]?.split(':');
									formattedText = `${splitArray[0]}: ${
										tooltipSymbol ? tooltipSymbol : ''
									}${splitArray[1].trim()}`;
								}

								const style =
									'color: #2A394E; font-size: 1rem; font-weight: 500; font-family: Barlow;';
								const span = `<span style="${style}">${
									formattedText?.length ? formattedText : body
								}</span>`;
								innerHtml += span;
								const line =
									'<span style="border-left: 1px solid #6A7582; margin-left: 0.5rem;" />';
								innerHtml += line;
							});
							titleLines.forEach((title) => {
								const style =
									'color: #6A7582; font-size: 1rem; font-weight: 400; font-family: Barlow; margin-left: 0.5rem;';
								innerHtml += `<span style="${style}">${formatDate(title)}</span>`;
							});
							innerHtml += '</div>';
							tooltipEl.innerHTML = innerHtml;
						}

						// // Display, position, and set styles for font
						tooltipEl.style.opacity = 1;
						tooltipEl.style.position = 'absolute';
						tooltipEl.style.top = '0px';
						const tooltipWidth = tooltipEl.offsetWidth;

						if (tooltipModel.caretX < tooltipWidth / 2) {
							tooltipEl.style.left = 0;
							tooltipEl.style.right = 'auto';
						} else if (chartParent.offsetWidth - tooltipModel.caretX < tooltipWidth / 2) {
							tooltipEl.style.left = 'auto';
							tooltipEl.style.right = 0;
						} else {
							tooltipEl.style.right = 'auto';
							tooltipEl.style.left = tooltipModel.caretX - tooltipEl.offsetWidth / 2 + 'px';
						}
						tooltipEl.style.transform = 'translate(0%, -50%)';
					}
				}
			}
		},
		chartOptions
	);
</script>

<div class="relative">
	<Line id={chartId} {data} {width} {height} {plugins} {options} class={chartClass} />
</div>
