<script lang="ts">
	import DoughnutChart from '$lib/components/Charts/DoughnutChart.svelte';
	import Riskometer from '$lib/components/Charts/Riskometer.svelte';
	import { doughnutData, riskometerData } from './__mock__';
</script>

<scetion>Below Section is Work in progress!!</scetion>
<section>
	<DoughnutChart
		data={doughnutData.data}
		chartOptions={doughnutData.options}
		tooltipLength={50}
		chartClass="w-48 h-48 m-auto mt-2"
	/>
	<Riskometer data={riskometerData} chartClass="!w-64 !h-32" />
</section>
