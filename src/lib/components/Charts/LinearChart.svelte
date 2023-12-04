<script lang="ts">
	import type { LinearChartInput } from '$lib/types/IChart';
	import { WMSIcon } from 'svelte-components';

	export let chartInput: LinearChartInput[] = [];
</script>

<section class="mb-4 flex justify-between">
	{#each chartInput as inputVar, i}
		<div class="items-center w-[{inputVar.weightage}%]">
			<div
				class="h-4 pr-2 {i == 0 ? 'rounded-l' : ''} {i == chartInput.length - 1 ? 'rounded-r' : ''}"
				style={`background-color: ${inputVar.color};`}
			/>
			<slot name="weightage">
				<div class="flex items-center justify-center pt-2 text-center text-sm">
					<WMSIcon name="eclipse" width={8} height={8} stroke={inputVar.color} />
					<div class="pl-2">{inputVar.weightage}%</div>
				</div>
			</slot>
		</div>
	{/each}
</section>
