<script lang="ts">
	import Button from '$components/Button.svelte';
	import LineChart from '$components/Charts/LineChart.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { MFCommonHeader } from '$lib/utils';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { tags } from '$lib/constants/tags';
	import type { LineChartData, NavDetails } from '../types';
	import { chartTimeIntervalSelection } from '../analytics';

	const dispatch = createEventDispatcher();

	function chartRangeChange(month: number) {
		dispatch('chartRangeChange', {
			text: month
		});
	}

	let schemeDetails: SchemeDetails;
	$: selectedMonth = (function () {
		const returnOrder = [
			'returns3yr',
			'returns1yr',
			'returns6Month',
			'returns3Month',
			'returns1Month'
		];
		let month = 0;
		returnOrder.forEach((order) => {
			if (!month && schemeDetails[order]) {
				const returns = tags.filter((tag) => tag.returnPeriod === order);
				month = returns[0].months;
			}
		});
		return month || 240;
	})();

	let lineData = {};
	const lineChartOptions = {
		maintainAspectRatio: false,
		elements: {
			point: {
				borderWidth: 6, // make responsive
				pointRadius: 10, // make responsive
				hoverRadius: 10, // make responsive
				hoverBorderWidth: 6 // make responsive
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
							return '₹' + value.toFixed(0).toString();
						else return '₹' + value.toFixed(1).toString();
					}
				}
			}
		},
		layout: {
			padding: {
				left: 5
			}
		}
	};

	function setChartData(navs: Array<NavDetails>) {
		const lineChartData: LineChartData = {
			time: [],
			navValue: []
		};

		if (navs && navs.length > 0) {
			navs.forEach((nav) => {
				lineChartData.time.push(nav.navDate);
				lineChartData.navValue.push(nav.navValue);
			});
		}

		return lineChartData;
	}

	const fillChartData = (lineChartData: LineChartData) => {
		lineData = {
			labels: lineChartData.time,
			datasets: [
				{
					label: 'NAV',
					backgroundColor: (context: { chart: { chartArea: any; ctx?: any } }) => {
						if (!context.chart.chartArea) {
							return;
						}
						const {
							ctx,
							chartArea: { top, bottom }
						} = context.chart;
						const bgGradient = ctx.createLinearGradient(0, top, 0, bottom);
						bgGradient.addColorStop(0, 'rgba(30, 199, 182, 0.24)');
						bgGradient.addColorStop(1, 'rgba(30, 199, 182, 0)');
						return bgGradient;
					},
					borderColor: '#1EC7B6',
					yAxisID: 'y',
					fill: true,
					data: lineChartData.navValue
				}
			]
		};
	};

	const selectNavDuration = async (month = 36) => {
		const navUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${schemeDetails.isin}/nav?months=${month}`;
		const res = await fetch(navUrl, {
			headers: MFCommonHeader()
		});

		const navDetails: Array<NavDetails> = await res.json();

		const lineChartData: LineChartData = setChartData(navDetails);
		// decrease the min by 2.5% and increase max by 2.5% as directed by product
		let minVal = Math.round(0.975 * Math.min(...lineChartData.navValue) * 10) / 10;
		let maxVal = Math.round(1.025 * Math.max(...lineChartData.navValue) * 10) / 10;
		let stepSize = Math.round(((minVal + maxVal) / 2) * 10) / 10;
		if (maxVal - minVal >= 10) {
			maxVal = Math.round(maxVal);
			minVal = Math.round(minVal);
			stepSize = Math.round(stepSize);
		}
		lineChartOptions.scales.y.max = maxVal;
		lineChartOptions.scales.y.min = minVal;
		lineChartOptions.scales.y.ticks.stepSize = stepSize;

		const currentMonthLable = tags.filter((tag) => tag.months === month);
		const eventMetadata = {
			ChartTimeIntervalSelected: currentMonthLable[0].label,
			ISIN: schemeDetails?.isin,
			ScreenName: 'fund_details'
		};
		chartTimeIntervalSelection(eventMetadata);

		fillChartData(lineChartData);
		selectedMonth = month;
		chartRangeChange(month);
	};

	onMount(async () => {
		await tick();
		selectNavDuration(selectedMonth);
	});

	export { schemeDetails };
</script>

<LineChart data={lineData} chartOptions={lineChartOptions} chartClass="w-full h-64 relative" />
<article class="mt-6 flex justify-center">
	<section class="flex w-auto flex-row gap-2 bg-white sm:gap-4">
		{#each tags as tag}
			{#if schemeDetails[tag.returnPeriod]}
				<Button
					variant="outlined"
					size="xs"
					class={` noselect flex h-5 w-9 cursor-pointer flex-row items-center justify-center rounded-sm border border-grey-line bg-white  p-0 py-[2px] text-xs font-medium active:opacity-70 sm:h-6 sm:w-11 sm:text-sm sm:font-normal ${
						selectedMonth === tag.months
							? '!border-blue-primary !text-blue-primary'
							: '!text-grey-body '
					}`}
					onClick={() => selectNavDuration(tag.months)}
				>
					{tag.label}
				</Button>
			{/if}
		{/each}
	</section>
</article>
