<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper class="mb-3 mt-3 flex flex-col items-center gap-2 px-3">
	<SkeletonRectangle class="!h-36 w-full" />
	<SkeletonRectangle class="h-[26rem] w-full" />
</SkeletonWrapper>
