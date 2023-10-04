<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let filterList: Array<string>;
	export let selectedFilter: number;
	const emitFilterChange = (index: number) => {
		dispatch('filterChange', { index });
	};
</script>

<article class={$$props.class}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#each filterList as item, index (index)}
		<div
			class={`ml-1 mt-1 cursor-pointer rounded-sm border px-4 py-2 text-xs font-normal lg:text-sm ${
				selectedFilter === index
					? 'border-blue-primary text-blue-primary lg:bg-blue-background'
					: 'text-grey-body'
			}`}
			on:click={() => emitFilterChange(index)}
		>
			{item || '-'}
		</div>
	{/each}
</article>
