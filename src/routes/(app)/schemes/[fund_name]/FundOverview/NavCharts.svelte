<script lang="ts">
	import Button from '$components/Button.svelte';
	import LineChart from '$components/Charts/LineChart.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { MFCommonHeader } from '$lib/utils';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { tags } from '../constants';
	import type { LineChartData, NavDetails } from '../types';

	const dispatch = createEventDispatcher();

	function chartRangeChange(month: number) {
		dispatch('chartRangeChange', {
			text: month
		});
	}
	let selectedMonth = 36;

	let schemeDetails: SchemeDetails;

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
					backgroundColor: '#1EC7B6',
					borderColor: '#1EC7B6',
					yAxisID: 'y',
					fill: false,
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

		fillChartData(lineChartData);
		selectedMonth = month;
		chartRangeChange(month);
	};
	onMount(async () => {
		await tick();
		selectNavDuration(36);
	});

	export { schemeDetails };
</script>

<LineChart data={lineData} chartOptions={lineChartOptions} chartClass="w-full h-64 relative" />
<article class="mt-6 flex justify-center">
	<section class="flex w-auto flex-row gap-2 bg-white sm:gap-4">
		{#each tags as tag}
			<Button
				variant="outlined"
				class={`${
					selectedMonth === tag.months ? '!border-blue-primary !text-blue-primary' : ''
				} noselect flex h-5 w-9 cursor-pointer flex-row items-center justify-center rounded-sm border border-grey-line bg-white  p-0 py-[2px] text-xs font-semibold !text-grey-body active:opacity-70 sm:h-6 sm:w-11 sm:text-sm sm:font-medium`}
				onClick={() => selectNavDuration(tag.months)}
			>
				{tag.label}
			</Button>
		{/each}
	</section>
</article>
