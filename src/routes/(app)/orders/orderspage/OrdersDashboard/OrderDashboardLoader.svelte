<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper class="w-full">
	<SkeletonRectangle class="mb-2 mt-2 !h-60 w-full rounded-lg" />
	<SkeletonRectangle class="mb-2 mt-2 block !h-[22rem] w-full rounded-lg md:hidden" />
</SkeletonWrapper>
<SkeletonWrapper class="hidden w-full md:block">
	{#each Array(10) as loader, index (index)}
		<SkeletonRectangle class="mb-2 mt-2 !h-40 w-full rounded-lg" />
	{/each}
</SkeletonWrapper>
