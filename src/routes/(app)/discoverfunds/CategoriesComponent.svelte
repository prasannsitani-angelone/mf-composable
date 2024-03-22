<script lang="ts">
	import type { DashboardCategoryEntity } from '$lib/types/IDiscoverFunds';
	import CollectionsCategoryComponent from '$components/LMSICollections/CollectionsCategoryComponent.svelte';

	export let categories: DashboardCategoryEntity[];
</script>

{#each categories || [] as category}
	<article
		class="max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm last:mb-0 ${$$props.class}"
	>
		{#if category.type === 'click'}
			<CollectionsCategoryComponent {category} />
		{/if}
	</article>
{/each}
