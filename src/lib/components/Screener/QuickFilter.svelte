<script lang="ts">
	import QuickFilterChip from './QuickFilterChip.svelte';

	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';

	$: quickFilter = $schemeScreenerStore.data.quickFilters;

	let onQuickFilterSelect = () => {
		return;
	};
	const selectQuickFilter = (name: string) => {
		schemeScreenerStore.selectQuickFilter(name);

		if (typeof onQuickFilterSelect === 'function') {
			onQuickFilterSelect();
		}
	};

	export { onQuickFilterSelect };
</script>

<div class="scrollbar-hide mb-4 flex w-screen overflow-x-auto">
	<div class="scrollbar-hide flex w-full gap-2 overflow-x-scroll pr-10 pt-0 md:px-0">
		{#each quickFilter as filter}
			<QuickFilterChip
				selected={filter.selected}
				on:click={() => {
					selectQuickFilter(filter.label);
				}}>{filter.label}</QuickFilterChip
			>
		{/each}
	</div>
</div>
