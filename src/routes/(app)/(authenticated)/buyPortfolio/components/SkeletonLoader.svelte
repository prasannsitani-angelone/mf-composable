<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper class="w-full">
	<SkeletonRectangle class="mb-2 !h-24 w-full rounded-lg" />
</SkeletonWrapper>
<SkeletonWrapper class="w-full">
	<SkeletonRectangle class="mb-2 !h-64 w-full rounded-lg" />
	<SkeletonRectangle class="mb-2 !h-64 w-full rounded-lg" />
</SkeletonWrapper>
