<script lang="ts">
	import type { DashboardCategoryEntity } from '$lib/types/IDiscoverFunds';
	import TabSelectorButton from './TabSelectorButton.svelte';
	import TabCategoryItemListComponent from './TabCategoryItemListComponent.svelte';
	import { topPicksSubCategoryClickEvent } from '$components/TopPicks/analytics';

	export let category: DashboardCategoryEntity;

	let selectedCategory = category.data[0];

	const categoryOptionClickEvent = (event, position) => {
		const { subCategory } = event.detail;
		topPicksSubCategoryClickEvent({
			Type: selectedCategory.name,
			FundName: subCategory.schemeName,
			ISIN: subCategory?.isin,
			Rank: position
		});
	};
</script>

<TabSelectorButton bind:selectedCategory categories={category.data} />

<section class="mx-2 flex flex-col flex-wrap p-3 sm:mx-1 sm:flex-row sm:px-4">
	{#if selectedCategory}
		{#each selectedCategory.data || [] as scheme, index}
			<TabCategoryItemListComponent
				on:subCategoryClicked={(event) => categoryOptionClickEvent(event, index + 1)}
				parentCategoryId={selectedCategory.id}
				class=" mb-2 sm:mb-3 sm:mr-3 sm:w-[322px]"
				schemeData={scheme}
			/>
		{/each}
	{/if}
</section>
