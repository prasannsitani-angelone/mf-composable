<script lang="ts">
	import DoughnutChart from '$lib/components/Charts/DoughnutChart.svelte';
	import LineChart from '$lib/components/Charts/LineChart.svelte';
	import Riskometer from '$lib/components/Charts/Riskometer.svelte';
	import { lineData, doughnutData, riskometerData } from './__mock__';
</script>

<section>
	<LineChart
		data={lineData.data}
		chartOptions={lineData.options}
		chartClass="w-full h-64 relative"
	/>
	<DoughnutChart
		data={doughnutData.data}
		chartOptions={doughnutData.options}
		tooltipLength={50}
		chartClass="w-48 h-48 m-auto mt-2"
	/>
	<Riskometer data={riskometerData} chartClass="!w-64 !h-32" />
</section>
