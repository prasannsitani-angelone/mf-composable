<script lang="ts">
	import SchemeTable from '$components/SchemeTable.svelte';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';

	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	const invalidateFavourites = (event) => {
		const { isFavourite } = event.detail;
		if (!isFavourite) {
			invalidate('favourites');
		}
	};

	export let data: PageData;
</script>

<article>
	<header class="hidden sm:block">
		<h2 class="mb-6 mt-1 text-lg font-medium text-black-title">Favourites</h2>
	</header>
	<section class="ml-[calc(50%-50vw)] w-screen shadow-csm sm:ml-0 sm:w-full sm:shadow-none">
		{#await data.api.favourites}
			<TableSkeleton />
		{:then favourites}
			<SchemeTable searchOption={favourites} toggleFavourites={invalidateFavourites} />
		{/await}
	</section>
</article>
