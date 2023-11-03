<script lang="ts">
	import AmountText from '$lib/components/AmountText.svelte';
	import type { CalculatedValue } from '$lib/types/IStandaloneCalculator';
	import DoughnutChart from '$components/Charts/DoughnutChart.svelte';
	import { onMount } from 'svelte';

	export let outputData: CalculatedValue = {};
	let chartId = 'doughnut-chart';
	let chartParentId = chartId + 'doughnut-chart-parent';
	let tooltipLength = 0;

	let outputDataProps: CalculatedValue | null = null;

	onMount(() => {
		outputDataProps = outputData;
	});

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
				backgroundColor: ['#94A7FF', '#3F5BD9'],
				hoverBackgroundColor: ['#94A7FF', '#3F5BD9'],
				hoverBorderColor: ['#94A7FF', '#3F5BD9'],
				data: [outputData?.capitalGain, outputData?.totalInvestment],
				cutout: '65%',
				borderRadius: 0,
				borderWidth: 0, // can make responsive
				borderAlign: 'inner',
				offset: 0,
				borderJoinStyle: 'round'
			}
		]
	};

	const doughnutChartOptions = {
		animation: {
			animateRotate: false
		},
		plugins: {
			customCanvasBackgroundColor: {
				fill: 'white'
			},
			tooltip: {
				enabled: false,
				callbacks: {},
				external: function (context) {
					// Tooltip Element
					let tooltipEl = document.getElementById(`${chartId}-tooltip`);
					const chartParent = document.getElementById(chartParentId);
					// Create element on first render
					if (!tooltipEl) {
						tooltipEl = document.createElement('div');
						tooltipEl.id = `${chartId}-tooltip`;
						tooltipEl.style =
							'border: 1px solid #E8EBF1; background: #FFFFFF; box-shadow: 0px 2px 8px rgba(138, 141, 153, 0.16); border-radius: 0.25rem; padding: 2px 4px; width: fit-content; display: flex; flex-direction: row; align-items: center';
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

						let span = `<span style="height: 0.375rem; width: 0.375rem; border-radius: 50%; background-color: ${color}; display: inline-block; margin-right: 0.25rem"></span>`;
						innerHtml += span;

						bodyLines.forEach((body) => {
							const style =
								'color: #425061; font-size: 11px; font-weight: 400; font-family: Roboto;';
							span = `<span style="${style}">₹${body}</span>`;
							innerHtml += span;
						});
						titleLines.forEach((title) => {
							const style =
								'color: #6A7582; font-size: 1rem; font-weight: 400; font-family: Roboto; margin-left: 0.25rem;';
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
			}
		}
	};
</script>

{#if outputDataProps}
	<section class="items-center justify-center md:flex {$$props.class || ''}">
		<article>
			<div class="mx-auto h-40 w-40 md:mx-0">
				<DoughnutChart
					chartPlugins={[plugin]}
					data={doughnutData}
					chartOptions={doughnutChartOptions}
					tooltipLength={0}
					chartClass="m-0 p-0 !p-0 flip-horizontal"
				/>
			</div>

			<section class="flex items-center justify-center">
				<article class="flex items-center">
					<div class="h-2 w-2 rounded-full bg-blue-primary" />
					<div class="ml-1 text-xs font-normal text-black-title">Invested</div>
				</article>
				<article class="ml-3 flex items-center">
					<div class="h-2 w-2 rounded-full bg-[#94A7FF]" />
					<div class="ml-1 text-xs font-normal text-black-title">Gains</div>
				</article>
			</section>
		</article>

		<section class="mt-4 md:ml-16">
			<article class="text-xs font-normal text-grey-body">
				<span>If you invest </span>
				<span>
					<AmountText amount={outputData?.investedAmount || 0} />
				</span>
				{#if outputData?.currentCalculatorMode === 'SIP'}
					<span> monthly for </span>
				{:else}
					<span>and hold it for</span>
				{/if}
				<span>
					{outputData?.selectedYear}
					{#if outputData?.selectedYear <= 1}
						<span>year</span>
					{:else}
						<span>years</span>
					{/if}
				</span>
			</article>

			<article class="mt-1 text-sm font-medium md:w-64">
				<span class="text-black-title"> Total Value: </span>

				<span class="text-lg">
					<AmountText amount={outputData?.matuarityAmount || 0} />
				</span>

				<span class="text-green-amount">
					(+{outputData?.gainLossPercentage?.toFixed(2)}%)
				</span>
			</article>
		</section>
	</section>
{/if}
