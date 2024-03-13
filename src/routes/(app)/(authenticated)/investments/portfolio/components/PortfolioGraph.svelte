<script lang="ts">
	import Card from '$components/Card.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import { tags } from '$lib/constants/tags';
	import type { BenchmarkDataType, ChartDataType } from '$lib/types/IPortfolioDetails';
	import { addCommasToAmountString, formatIntoK } from '$lib/utils/helpers/formatAmount';
	import { createEventDispatcher } from 'svelte';
	import { SkeletonRectangle, WMSIcon } from 'svelte-components';
	import Chart from '../../../schemes/fundcomparision/components/Chart.svelte';
	import {
		portfolioBenchmarkInfoIconClickAnalytics,
		portfolioBenchmarkPopupOpenAnalytics
	} from '../../analytics';

	export let fundChartData: Array<ChartDataType>;
	export let benchmarkData: BenchmarkDataType;
	export let isEquityPortfolioFlag: boolean;

	const dispatch = createEventDispatcher();

	const chartDatasetConfig = [
		{
			label: '',
			backgroundColor: 'transparent',
			borderColor: '#21C7DB',
			yAxisID: 'y',
			fill: true
		},
		{
			label: '',
			borderColor: '#F9BA4D',
			yAxisID: 'y',
			fill: true,
			backgroundColor: 'transparent'
		}
	];

	const benchmarkInfoPoints = [
		`Benchmarks help you compare your portfolio's performance with the average returns of markets. Nifty 50 is the standard benchmark for portfolios in the Indian market.`,
		`If your portfolio returns beat the benchmark over time, it means your portfolio is doing well. This is a positive indicator of your mutual fund selection and investment timing.`,
		`Losing to the benchmark may indicate that the mutual funds you selected are not performing well or you invested at the wrong time, or both.`
	];

	let chartDataLoading = false;
	let selectedTag = 6;
	let chartNavData: Array<Array<ChartDataType>> = [];
	let lineData = {};
	let chartId = 'portfolio-line-chart';
	let tooltipLength = 10;
	let showAboutBenchmarkModal = false;

	const toggleShowAboutBenchmarkModal = () => {
		showAboutBenchmarkModal = !showAboutBenchmarkModal;
		if (showAboutBenchmarkModal) {
			portfolioBenchmarkInfoIconClickAnalytics();
			portfolioBenchmarkPopupOpenAnalytics();
		}
	};

	const fillChartData = (mutipleNavs: Array<Array<ChartDataType>>) => {
		const lineChartData = {
			time: [],
			navs: []
		};

		let minAmount = Number.MAX_VALUE,
			maxAmount = 0;

		let maxNavsLength = 0,
			maxNavsIndex = 0;

		mutipleNavs.forEach((navs, navIndex) => {
			lineChartData.navs.push([]);
			if (maxNavsLength < navs?.length) {
				maxNavsLength = navs?.length;
				maxNavsIndex = navIndex;
			}
			navs?.forEach((nav) => {
				if (minAmount > nav.value) {
					minAmount = nav.value;
				}
				if (maxAmount < nav.value) {
					maxAmount = nav.value;
				}
				lineChartData.navs[navIndex].push(nav.value);
			});
		});

		mutipleNavs?.[maxNavsIndex]?.forEach((nav) => {
			lineChartData.time.push(nav.timestamp);
		});

		const datasets = lineChartData.navs.map((nav, index) => {
			let pointHoverColor = '#3F5BD966';
			let pointHoverBgColor = '#3F5BD9';
			if (index === 0) {
				pointHoverColor = '#21c7db66';
				pointHoverBgColor = '#21c7db';
			} else if (index === 1) {
				pointHoverColor = '#F9BA4D66';
				pointHoverBgColor = '#F9BA4D';
			}

			return {
				...(chartDatasetConfig[index] || {}),
				data: nav,
				borderWidth: 1.5, // make responsive
				pointRadius: 3, // make responsive
				hoverRadius: 3, // make responsive
				hoverBorderWidth: 6, // make responsive
				pointHoverBorderColor: pointHoverColor,
				pointHoverBackgroundColor: pointHoverBgColor,
				pointBackgroundColor: 'transparent',
				pointBorderColor: 'transparent',
				pointStyle: 'circle'
			};
		});

		// decrease the min by 2.5% and increase max by 2.5% as directed by product for scales
		minAmount = Math.round(0.975 * minAmount * 10) / 10;
		maxAmount = Math.round(1.025 * maxAmount * 10) / 10;
		let stepSize = Math.round((maxAmount - minAmount) / 2);
		if (maxAmount - minAmount >= 10) {
			maxAmount = Math.round(maxAmount);
			minAmount = Math.round(minAmount);
			stepSize = Math.round(stepSize);
		}
		lineChartOptions.scales.y.max = maxAmount;
		lineChartOptions.scales.y.min = minAmount;
		lineChartOptions.scales.y.ticks.stepSize = stepSize;

		lineData = {
			labels: lineChartData.time,
			datasets
		};
	};

	const onTagClick = async (tag: number, tagsClicked = true) => {
		if (tagsClicked === false) {
			chartDataLoading = true;
		} else {
			dispatch('portfolioChartTagChange', tag);
		}
		selectedTag = tag;

		if (tagsClicked === false) {
			chartDataLoading = false;
		}
	};

	const removeNonIntersectingTimestamps = () => {
		if (!fundChartData?.length || !benchmarkData?.holdingChart?.length) return;
		const fundChartTimestamps = new Set();
		fundChartData?.map((item) => fundChartTimestamps.add(item?.timestamp));
		const commonTimestamps = new Set();
		benchmarkData?.holdingChart?.map((item) => {
			if (fundChartTimestamps.has(item?.timestamp)) {
				commonTimestamps.add(item?.timestamp);
			}
		});

		fundChartData = fundChartData?.filter((item) => commonTimestamps?.has(item?.timestamp));
		benchmarkData.holdingChart = benchmarkData?.holdingChart?.filter((item) =>
			commonTimestamps?.has(item?.timestamp)
		);
	};

	const updateChartData = () => {
		if (!fundChartData?.length) return;
		chartNavData = [];
		chartNavData.push(fundChartData);
		if (isEquityPortfolioFlag) {
			if (!benchmarkData?.holdingChart?.length) return;
			chartNavData.push(benchmarkData?.holdingChart);
		}
		fillChartData(chartNavData);
	};

	$: fundChartData, benchmarkData, removeNonIntersectingTimestamps(), updateChartData();

	$: benchmarkText =
		benchmarkData?.summary?.portReturnsOverBm < 0
			? 'less than'
			: benchmarkData?.summary?.portReturnsOverBm > 0
			? 'better than'
			: 'equal to';

	const formatDate = (navDate) => {
		navDate = navDate.split(',');
		navDate.pop();
		navDate = navDate.join(',');
		const date = new Date(navDate);
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'short' });
		const year = date.getFullYear()?.toString();

		return `${day} ${month} ${year}`;
	};

	const getFormattedDate = (originalDateString: string) => {
		const tempDate = new Date(originalDateString);
		tempDate.setHours(5);
		tempDate.setMinutes(30);
		return tempDate.getTime();
	};

	const getDataLabelIndex = (originalDateString: string) => {
		const formattedDate = getFormattedDate(originalDateString);

		const selectedIndex = lineData?.labels?.findIndex((label: number) => label === formattedDate);
		return selectedIndex;
	};

	const getNavDataList = (title: string) => {
		const selectedIndex = getDataLabelIndex(title) || 0;
		let navData = [];

		lineData?.datasets?.forEach((data) => {
			navData.push({
				nav: data?.data[selectedIndex],
				color: data?.pointHoverBackgroundColor
			});
		});

		return navData;
	};

	const lineChartOptions = {
		maintainAspectRatio: false,
		elements: {
			point: {
				borderWidth: 4,
				pointRadius: 3,
				hoverRadius: 3,
				hoverBorderWidth: 4,
				pointHoverBorderColor: '#3F5BD966',
				pointHoverBackgroundColor: '#3F5BD9',
				pointBackgroundColor: 'transparent',
				pointBorderColor: 'transparent',
				pointStyle: 'circle'
			}
		},
		scales: {
			y: {
				type: 'linear',
				display: 'auto',
				position: 'left',
				grid: {
					display: true,
					drawOnChartArea: true
				},
				border: {
					display: false
				},
				min: 0,
				max: 100,
				ticks: {
					stepSize: 50,
					beginAtZero: false,
					autoSkip: false,
					callback: function (value: number) {
						if (lineChartOptions.scales.y.max - lineChartOptions.scales.y.min >= 10)
							return '₹' + formatIntoK(value);
						else return '₹' + formatIntoK(value);
					}
				}
			},
			x: {
				display: false
			}
		},
		layout: {
			padding: {
				left: 5
			}
		},
		plugins: {
			tooltip: {
				enabled: false,
				callbacks: {},
				external: function (context) {
					// Tooltip Element
					let tooltipEl = document.getElementById(`${chartId}-tooltip`);

					// const chartParent = document.getElementById(chartParentId);
					const chartParent = document.getElementById(chartId)?.parentNode;

					// Create element on first render
					if (!tooltipEl) {
						tooltipEl = document.createElement('div');
						tooltipEl.id = `${chartId}-tooltip`;
						tooltipEl.style =
							'display: flex; flex-direction: column; align-items: flex-start; width: fit-content; padding: 8px; font-size: 10px; font-weight: 400; font-family: Roboto; color: var(--BODY); background: var(--BACKGROUND-ALT); box-shadow: 0px 1px 4px 0px rgba(24, 31, 41, 0.08); border-radius: 4px;';
						tooltipEl.innerHTML = '';
						chartParent.appendChild(tooltipEl);
					}

					// Hide if no tooltip
					const tooltipModel = context.tooltip;
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

					// Set Tooltip Text
					if (tooltipModel.body) {
						const titleLines = tooltipModel.title || [];
						const bodyLines = tooltipModel.body.map(getBody);

						let innerHtml = '';

						const title = titleLines?.[0];

						if (title) {
							const style = '';
							innerHtml += `<span style="${style}">${formatDate(title)}</span>`;
						}
						innerHtml += '</div>';

						const body = bodyLines?.[0];

						const navDataList = getNavDataList(formatDate(title));

						if (body) {
							const style = 'display: flex; align-items: center;';
							navDataList?.forEach((nav, index) => {
								const div = `<div style="${style} class="mt-1 text-xs">
										<div style="width: 8px; height: 8px; background: ${nav?.color}; border-radius: 100%;"></div>
										<div class="ml-1 flex items-start gap-1">
                      <span class="text-body whitespace-nowrap">${
												index === 0 ? 'Your Portfolio' : 'Nifty 50'
											}: </span>
                      <span class="text-title font-medium">
											${nav?.nav > 0 ? `₹${addCommasToAmountString(parseFloat(nav?.nav?.toFixed(2)))}` : 'NA'}
                      </span>
										</div>
										<div class="ml-1 text-buy">
											(${nav?.nav > 0 ? `+${parseFloat(((nav?.nav - 1000) / 10)?.toFixed(2))}%` : 'NA'})
										</div>
									</div>`;
								innerHtml += div;
							});
						}
						tooltipEl.innerHTML = innerHtml;
					}

					const canvas = context.chart.canvas;

					// Display, position, and set styles for font
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
					tooltipEl.style.transform = 'translate(-50%, -110%)';
					tooltipEl.style.top = canvas.offsetTop + tooltipModel.caretY + 'px';
					tooltipEl.style.pointerEvents = 'none';
				}
			}
		}
	};
</script>

<article>
	<Card class="border-0 px-0 pb-0 text-lg md:pt-5">
		<div class="px-4 md:px-6">
			{#if isEquityPortfolioFlag}
				<article
					class="flex items-center gap-1 rounded p-2"
					class:bg-tint12-buy={benchmarkData?.summary?.portReturnsOverBm > 0}
					class:bg-tint12-sell={benchmarkData?.summary?.portReturnsOverBm < 0}
					class:bg-tint12-secondary={benchmarkData?.summary?.portReturnsOverBm === 0}
				>
					{#if benchmarkData?.summary?.portReturnsOverBm > 0}
						<WMSIcon fill="var(--BUY)" name="graph-in-circle" height={16} width={16} />
					{:else if benchmarkData?.summary?.portReturnsOverBm < 0}
						<WMSIcon
							fill="var(--SELL)"
							name="graph-in-circle"
							height={16}
							width={16}
							class="scale-y-[-1]"
						/>
					{:else}
						<WMSIcon
							fill="var(--SECONDARY)"
							stroke="var(--TINT12-SECONDARY)"
							name="equal-in-circle"
							height={16}
							width={16}
						/>
					{/if}
					<p class="text-[11px] font-normal leading-4 text-title">
						Your portfolio returns are
						<span class="font-semibold">
							{!Number.isNaN(Math.abs(benchmarkData?.summary?.portReturnsOverBm))
								? addCommasToAmountString(
										Math.abs(benchmarkData?.summary?.portReturnsOverBm)?.toFixed(2)
								  )
								: ''}% {benchmarkText} Nifty 50
						</span>since you started investing
					</p>
				</article>
				<article class="-ml-1 flex items-center px-0 py-3 text-body">
					<WMSIcon stroke="var(--CHART)" name="eclipse" height={8} width={8} class="px-0" />
					<div class="text-[10px] font-normal">
						Your Portfolio
						<span class="text-xs font-medium">
							{!Number.isNaN(Math.abs(benchmarkData?.summary?.portfolioReturns))
								? addCommasToAmountString(
										Math.abs(benchmarkData?.summary?.portfolioReturns)?.toFixed(2)
								  )
								: ''}%
						</span>
					</div>
					<WMSIcon stroke="var(--SECONDARY)" name="eclipse" height={8} width={8} />
					<div class="text-[10px] font-normal">
						Nifty 50 (Index Benchmark)
						<span class="text-xs font-medium">
							{!Number.isNaN(Math.abs(benchmarkData?.summary?.benchmarkReturns))
								? addCommasToAmountString(
										Math.abs(benchmarkData?.summary?.benchmarkReturns)?.toFixed(2)
								  )
								: ''}%
						</span>
					</div>
					<WMSIcon
						width={12}
						height={12}
						name="info-in-circle"
						fill="var(--BODY)"
						stroke="var(--BODY)"
						class="ml-1 cursor-default md:cursor-pointer"
						on:click={toggleShowAboutBenchmarkModal}
					/>
				</article>
			{/if}
			<article>
				{#if chartDataLoading}
					<SkeletonRectangle class="mb-2 !h-[50vh] w-full rounded-lg" />
				{:else}
					<Chart {lineData} {lineChartOptions} {tags} {onTagClick} {selectedTag} {chartId} />
				{/if}
			</article>
		</div>
	</Card>
</article>

<!-- About Benchmark Modal -->
{#if showAboutBenchmarkModal}
	<InfoModal
		showModal={showAboutBenchmarkModal}
		heading="Why compare this fund with Nifty 50?"
		on:crossClicked={toggleShowAboutBenchmarkModal}
	>
		<div slot="crossIconSlot" />
		<svelte:fragment slot="bodySection">
			<ul class="list-inside list-disc px-4 pb-6">
				{#each benchmarkInfoPoints as statement}
					<div class="flex items-start justify-start">
						<li class="ml-2" />
						<div class="text-sm font-normal text-body">{statement}</div>
					</div>
				{/each}
			</ul>
		</svelte:fragment>
	</InfoModal>
{/if}
