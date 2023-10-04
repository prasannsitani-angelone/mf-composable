<script lang="ts">
	import type { DashboardCategoryEntity } from '$lib/types/IDiscoverFunds';
	import TabCategoryComponent from '$components/TopPicks/TabCategoryComponent.svelte';
	import CollectionsCategoryComponent from '$components/LMSICollections/CollectionsCategoryComponent.svelte';

	export let categories: DashboardCategoryEntity[];
</script>

{#each categories || [] as category}
	<article class="mt-2 max-w-4xl rounded-lg bg-white text-sm shadow-csm ${$$props.class}">
		<p class="px-6 py-3 text-lg font-normal text-black-title sm:px-6">{category.name}</p>

		{#if category.type === 'tab'}
			<TabCategoryComponent {category} />
		{:else if category.type === 'click'}
			<CollectionsCategoryComponent {category} />
		{/if}
	</article>
{/each}
