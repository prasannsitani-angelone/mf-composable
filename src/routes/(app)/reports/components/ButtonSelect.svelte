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

<div class="mt-2 ml-4 flex flex-wrap gap-3 pl-4">
	{#each list as item (item.title)}
		<Button
			variant="outlined"
			color="secondary"
			class={`w-36 rounded bg-white py-2 font-medium ${
				item.title === selected?.title
					? '!border !border-blue-primary !bg-grey !text-blue-primary'
					: '!border !border-grey-line !bg-white !text-grey-body'
			}`}
			onClick={() => selectOption(item.title)}
		>
			{item.title}
		</Button>
	{/each}
</div>
