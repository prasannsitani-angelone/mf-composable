<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$components/Button.svelte';
	import type { FinancialYear } from '$lib/types/IReports';

	export let list: FinancialYear[] = [];
	export let selected: FinancialYear = {};

	const dispatch = createEventDispatcher();

	const selectOption = (title: string) => {
		dispatch('onSelect', title);
	};
</script>

<div class="ml-4 mt-2 flex flex-wrap gap-3 pl-4">
	{#each list as item (item.title)}
		<Button
			variant="outlined"
			color="secondary"
			class={`w-36 rounded bg-background-alt py-2 font-normal ${
				item.title === selected?.title
					? '!border !border-primary !bg-background !text-primary'
					: '!border !border-border !bg-background-alt !text-body'
			}`}
			onClick={() => selectOption(item.title)}
		>
			{item.title}
		</Button>
	{/each}
</div>
