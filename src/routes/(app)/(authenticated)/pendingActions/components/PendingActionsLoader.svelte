<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper>
	<SkeletonWrapper>
		<SkeletonRectangle class="mb-2 !h-52 w-full rounded-lg" />
	</SkeletonWrapper>
	<SkeletonWrapper>
		<SkeletonRectangle class="mb-2 !h-52 w-full rounded-lg" />
	</SkeletonWrapper>
</SkeletonWrapper>
