<script>
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
</script>

<SkeletonWrapper>
	<SkeletonRectangle class="mb-2 !h-24 w-full rounded-lg {$$props.class}" />
</SkeletonWrapper>
