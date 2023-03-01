<script>
	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import merge from 'lodash.merge';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	export let chartId = 'doughnut-chart';
	export let width = 450;
	export let height = 270;
	export let chartPlugins = [];
	export let data = {};
	export let chartOptions = {};
	export let tooltipLength = 50;
	export let chartParentId = 'doughnut-chart-parent';
	export let chartClass = '';

	$: options = merge(
		{
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					enabled: false,
					callbacks: {
						title: (tooltip) => {
							const titles = [];
							tooltip?.forEach((item) => {
								titles.push(item.label);
							});
							return titles;
						},
						label: (tooltip) => {
							return `${tooltip.formattedValue}%`;
						}
					},
					external: function (context) {
						// Tooltip Element
						let tooltipEl = document.getElementById(`${chartId}-tooltip`);
						const chartParent = document.getElementById(chartParentId);
						// Create element on first render
						if (!tooltipEl) {
							tooltipEl = document.createElement('div');
							tooltipEl.id = `${chartId}-tooltip`;
							tooltipEl.style =
								'border: 1px solid #E8EBF1; background: #FFFFFF; box-shadow: 0px 2px 8px rgba(138, 141, 153, 0.16); border-radius: 0.25rem; padding: 0.5rem 0.75rem; width: fit-content; display: flex; flex-direction: row; align-items: center';
							tooltipEl.innerHTML = '';
							chartParent.appendChild(tooltipEl);
						}
						// Hide if no tooltip
						const tooltipModel = context.tooltip;
						const color = tooltipModel.labelColors[0].backgroundColor;
						if (tooltipModel.opacity === 0) {
							tooltipEl.style.opacity = 0;
							return;
						}

						// Set caret Position
						tooltipEl.classList.remove('above', 'below', 'no-transform');
						if (tooltipModel.yAlign) {
							tooltipEl.classList.add(tooltipModel.yAlign);
						} else {
							tooltipEl.classList.add('no-transform');
						}

						const getBody = (bodyItem) => {
							return bodyItem.lines;
						};

						// Set Text
						if (tooltipModel.body) {
							const titleLines = tooltipModel.title || [];
							const bodyLines = tooltipModel.body.map(getBody);

							let innerHtml = '';

							let span = `<span style="height: 0.375rem; width: 0.375rem; border-radius: 50%; background-color: ${color}; display: inline-block; margin-right: 0.5rem"></span>`;
							innerHtml += span;

							bodyLines.forEach((body) => {
								const style =
									'color: #2A394E; font-size: 1rem; font-weight: 500; font-family: Barlow;';
								span = `<span style="${style}">${body}</span>`;
								innerHtml += span;
							});
							titleLines.forEach((title) => {
								const style =
									'color: #6A7582; font-size: 1rem; font-weight: 400; font-family: Barlow; margin-left: 0.25rem;';
								innerHtml += `<span style="${style}">${title}</span>`;
							});
							innerHtml += '</div>';
							tooltipEl.innerHTML = innerHtml;
						}

						const canvas = context.chart.canvas;

						// // Display, position, and set styles for font
						tooltipEl.style.opacity = 1;
						tooltipEl.style.position = 'absolute';
						const centerX = tooltipModel._active[0].element.x;
						if (centerX > tooltipModel.caretX) {
							const xfromParent = canvas.offsetLeft + tooltipModel.caretX - tooltipLength;
							let startPoint = 0;
							if (xfromParent - tooltipEl.offsetWidth >= 0) {
								startPoint = xfromParent - tooltipEl.offsetWidth;
							}
							tooltipEl.style.left = startPoint + 'px';
						} else {
							const parentWidth = chartParent.offsetWidth;
							const xfromParent = canvas.offsetLeft + tooltipModel.caretX + tooltipLength;
							let startPoint = parentWidth - tooltipEl.offsetWidth;
							if (parentWidth - xfromParent - tooltipEl.offsetWidth >= 0) {
								startPoint = xfromParent;
							}
							tooltipEl.style.left = startPoint + 'px';
						}
						tooltipEl.style.transform = 'translate(0, -50%)';
						tooltipEl.style.top = canvas.offsetTop + tooltipModel.caretY + 'px';
						tooltipEl.style.pointerEvents = 'none';
					}
				},
				tooltipLine: {
					heading: '',
					subHeading: '',
					headingStyle: '1.5rem Helvetica',
					subHeadingStyle: '0.875rem Helvetica'
				}
			},
			layout: {
				padding: {
					left: 10,
					right: 10
				}
			},
			hover: {
				mode: 'index'
			}
		},
		chartOptions
	);

	$: plugins = merge(
		[
			{
				id: 'tooltipLine',
				afterDatasetsDraw: (chart) => {
					const {
						chartArea: { left, width },
						_metasets,
						ctx,
						tooltip,
						config
					} = chart;
					const { heading, subHeading, headingStyle, subHeadingStyle } =
						config._config.options.plugins.tooltipLine;
					const cx = left + width / 2;
					const cy = _metasets[0].data[0].y;
					if (tooltip?._active?.length) {
						const centerX = tooltip._active[0].element.x;
						const x = tooltip.caretX;
						const y = tooltip.caretY;
						ctx.save();
						ctx.beginPath();
						ctx.moveTo(x, y);
						if (centerX > x) {
							ctx.lineTo(x - tooltipLength, y);
						} else {
							ctx.lineTo(x + tooltipLength, y);
						}
						ctx.lineWidth = 1;
						ctx.strokeStyle = '#E8EBF1';
						ctx.stroke();
						ctx.restore();
					}
					// text
					ctx.font = headingStyle;
					ctx.fillStyle = '#2A394E';
					const metrics = ctx.measureText(heading);
					ctx.fillText(heading, cx - metrics.width / 2, cy);
					ctx.restore();
					const text2 = subHeading;
					ctx.font = subHeadingStyle;
					ctx.fillStyle = '#6A7582';
					const text1Height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
					ctx.fillText(text2, cx - ctx.measureText(text2).width / 2, cy + text1Height + 2);
					ctx.restore();
				}
			}
		],
		chartPlugins
	);
</script>

<div id={chartParentId} class="relative">
	<Doughnut id={chartId} {data} {width} {height} {plugins} {options} class={chartClass} />
</div>
