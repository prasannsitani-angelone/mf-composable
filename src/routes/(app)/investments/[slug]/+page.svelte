<script lang="ts">
	import DoughnutChart from '$lib/components/Charts/DoughnutChart.svelte';
	import Riskometer from '$lib/components/Charts/Riskometer.svelte';
	import AssetAnalysis from '../portfolio/AssetAnalysis.svelte';
	import { doughnutData, riskometerData, holdingsSummary, portfolioData } from './__mock__';
</script>

<section>
	<AssetAnalysis
		summary={holdingsSummary.data.summary}
		distributions={portfolioData?.data?.distributions}
	/>
</section>
<DoughnutChart
	data={doughnutData.data}
	chartOptions={doughnutData.options}
	tooltipLength={50}
	chartClass="w-48 h-48 m-auto mt-2"
/>
<Riskometer data={riskometerData} chartClass="!w-64 !h-32" />
