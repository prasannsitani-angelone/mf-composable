<script lang="ts">
	import Riskometer from '$components/Charts/Riskometer.svelte';
	import RiskometerIcon from '$lib/images/icons/RiskometerIcon.svelte';
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

<section class="border-b p-4">
	<header class="mb-5 flex items-center">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
			<RiskometerIcon />
		</div>

		<h3 class="ml-4 text-lg font-normal text-black-title">Risk Involved</h3>
	</header>
	<section
		class="mt-5 flex flex-col items-center gap-12 rounded border-t border-grey-line p-6 pl-11 lg:flex-row lg:items-stretch lg:border lg:bg-grey"
	>
		<div class="h-32 w-64">
			<Riskometer data={riskometerData} chartClass="!w-64 !h-32" />
		</div>
		<div
			class="flex flex-col items-center justify-center rounded border-0 bg-white px-9 lg:border"
			style="border-color: {borderColor};"
		>
			<div class="text-center text-sm font-normal text-grey-body">Your principal will be at</div>

			<h4 class="text-lg font-normal" style="color: {borderColor};">
				{schemeDetails?.riskoMeterValue} risk
			</h4>
		</div>
	</section>
</section>
