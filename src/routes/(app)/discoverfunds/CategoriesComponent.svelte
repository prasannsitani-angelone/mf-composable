<script lang="ts">
	import type { DashboardCategoryEntity } from '$lib/types/IDiscoverFunds';
	import TabCategoryComponent from '$components/TopPicks/TabCategoryComponent.svelte';
	import CollectionsCategoryComponent from '$components/LMSICollections/CollectionsCategoryComponent.svelte';

	export let categories: DashboardCategoryEntity[];
</script>

{#each categories || [] as category}
	<article class="mb-2 max-w-4xl rounded-lg bg-white text-sm shadow-csm last:mb-0 ${$$props.class}">
		{#if category.type === 'tab'}
			<TabCategoryComponent {category} />
		{:else if category.type === 'click'}
			<CollectionsCategoryComponent {category} />
		{/if}
	</article>
{/each}
