<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper>
	<SkeletonRectangle class="mb-2 !h-20 w-full rounded-lg" />
	<SkeletonRectangle class="mb-2 !h-[50vh] w-full rounded-lg" />
	<SkeletonRectangle class="mb-2 !h-[50vh] w-full rounded-lg" />
</SkeletonWrapper>
