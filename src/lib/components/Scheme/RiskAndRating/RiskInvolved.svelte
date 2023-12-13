<script lang="ts">
	import Riskometer from '$components/Charts/Riskometer.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	let schemeDetails: SchemeDetails;

	const riskoMeterColor = ['#5EC4B6', '#6DA160', '#D7AE45', '#EFBD61', '#F6895A', '#F65E5A'];

	const riskometerData = {
		labels: ['Low', 'Low to Moderate', 'Moderate', 'Moderately High', 'High', 'Very High'],
		datasets: [
			{
				backgroundColor: riskoMeterColor,
				data: [1, 1, 1, 1, 1, 1],
				cutout: '55%',
				circumference: 180,
				rotation: 270,
				borderRadius: 2,
				borderWidth: 0,
				needleValue: schemeDetails?.riskoMeterCode || 0
			},
			{
				backgroundColor: riskoMeterColor,
				data: [1, 1, 1, 1, 1, 1],
				cutout: '70%',
				circumference: 180,
				rotation: 270,
				borderRadius: 0,
				borderWidth: 0
			}
		]
	};
	$: borderColor = riskoMeterColor[schemeDetails?.riskoMeterCode];

	export { schemeDetails };
</script>

<section class="p-4 pb-0">
	<section class="flex flex-col items-center justify-center">
		<div class="flex h-32 w-64 items-center justify-center">
			<Riskometer data={riskometerData} chartClass="!w-64 !h-32" />
		</div>
		<div class="mt-2 flex flex-col items-center justify-center rounded border-0 bg-white px-9">
			<div class="text-center text-sm font-normal text-grey-body">
				<span>Your investment will be at </span>

				<span class="text-sm font-normal" style="color: {borderColor};">
					{schemeDetails?.riskoMeterValue}
				</span>
				<span>risk</span>
			</div>
		</div>
	</section>
</section>
