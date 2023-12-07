<script lang="ts">
	import QuickFilterChip from './QuickFilterChip.svelte';

	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';
	import {
		tryQuickFilterClick,
		type ITryQuickFilter,
		type ScreenerSource
	} from '$lib/analytics/filters/filters';

	$: quickFilter = $schemeScreenerStore?.data?.quickFilters;

	let pageSource: ScreenerSource;
	let onQuickFilterSelect = () => {
		return;
	};
	const selectQuickFilter = (name: string, index: number) => {
		schemeScreenerStore.selectQuickFilter(name);
		const quickFilterClickMetaData: ITryQuickFilter = {
			rank: index + 1,
			source: pageSource,
			quickfilter: name
		};
		tryQuickFilterClick(quickFilterClickMetaData);
		if (typeof onQuickFilterSelect === 'function') {
			onQuickFilterSelect();
		}
	};

	const getQuickFilterId = (filterid: string) => {
		return `quickfilter-${filterid?.toLowerCase()?.split(' ')?.join('-')}`;
	};
	export { onQuickFilterSelect, pageSource };
</script>

<div class="scrollbar-hide mb-4 flex w-full overflow-x-auto">
	<div class="scrollbar-hide flex w-full gap-2 overflow-x-scroll pt-0 md:px-0">
		{#each quickFilter || [] as filter, index}
			<QuickFilterChip
				selected={filter.selected}
				id={`${getQuickFilterId(filter.id)}`}
				on:click={() => {
					selectQuickFilter(filter.label, index);
				}}>{filter.label}</QuickFilterChip
			>
		{/each}
	</div>
</div>
