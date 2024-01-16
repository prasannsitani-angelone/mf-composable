<script lang="ts">
	import type { LinearChartInput } from '$lib/types/IChart';

	export let chartInput: LinearChartInput[] = [];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section on:click class="flex flex-col {$$props.class}" style={$$props.style}>
	<slot name="topLabel" />
	{#each chartInput as inputVar, i}
		<div
			class="mx-auto h-max w-12 sm:w-14 sm:cursor-pointer {i === 0 ? 'rounded-t' : ''}
					{i === chartInput.length - 1 ? 'rounded-b' : ''}
					{inputVar.weightage === 100 ? '!mx-0 rounded-l rounded-r' : ''}
					{inputVar.weightage === 0 ? 'hidden' : ''}"
			style={`height: ${inputVar.weightage}%; background-color: ${inputVar.color}; min-height: 4px;`}
		/>
	{/each}
	<slot name="bottomLabel" />
</section>
