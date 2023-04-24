<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper>
	<SkeletonRectangle class="mb-2 mt-2 !h-60 w-full rounded-lg" />
	<SkeletonRectangle class="mb-2 mt-2 !h-[22rem] w-full rounded-lg" />
</SkeletonWrapper>
