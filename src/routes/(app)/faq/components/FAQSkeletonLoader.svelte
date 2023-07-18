<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
</script>

<section class="rounded-b-lg rounded-t-lg bg-white px-3 md:rounded-t-none md:px-4">
	{#each Array(5) as index}
		<section class="pb-2 pt-3 md:py-5">
			<SkeletonRectangle class="h-5 w-full" />
		</section>
	{/each}
</section>
