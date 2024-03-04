<script lang="ts">
	import SearchDarkIcon from '$lib/images/icons/SearchDarkIcon.svelte';
</script>

<article class="mt-2 flex items-center rounded-lg border-0 bg-background-alt shadow-csm">
	<SearchDarkIcon class="search-placeholder mx-4 mr-1 mt-1 h-5 w-6" />
	<div class="search-placeholder py-3 text-base">Search by fund name, type or AMC</div>
</article>

<style>
	.search-placeholder {
		color: var(--N-800);
	}
</style>
