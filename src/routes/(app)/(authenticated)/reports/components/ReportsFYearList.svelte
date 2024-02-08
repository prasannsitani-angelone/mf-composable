<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import RadioTick from '$components/RadioTick.svelte';
	import type { FinancialYear } from '$lib/types/IReports';

	const dispatch = createEventDispatcher();

	export let list: FinancialYear[];
	export let selected: FinancialYear;

	const selectOption = (option: FinancialYear) => {
		dispatch('onSelect', option);
	};
</script>

<section>
	{#each list as item, index (item?.title)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class={`flex flex-row px-0 py-4 hover:cursor-pointer sm:px-6 ${
				selected.title === item.title ? 'text-primary sm:bg-background sm:text-title' : 'text-title'
			} ${index !== list?.length - 1 ? 'border-b sm:border-none' : ''}`}
			on:click={() => selectOption(item)}
		>
			<span class="text-sm font-normal">{item?.title}</span>

			<RadioTick selected={selected.title === item.title} class="ml-auto" />
		</div>
	{/each}
</section>
