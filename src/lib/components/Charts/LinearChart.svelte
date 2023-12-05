<script lang="ts">
	import type { LinearChartInput } from '$lib/types/IChart';

	export let chartInput: LinearChartInput[] = [];
</script>

<section class="mb-4 flex w-full">
	{#each chartInput as inputVar, i}
		<div class="items-center" style={`width: ${inputVar.weightage}%;`}>
			<div
				class="h-4 pr-2 {i == 0 ? 'rounded-l' : ''} {i == chartInput.length - 1
					? 'rounded-r'
					: 'mr-1'}"
				style={`background-color: ${inputVar.color};`}
			/>
			<slot name="weightage" {inputVar} />
		</div>
	{/each}
</section>
