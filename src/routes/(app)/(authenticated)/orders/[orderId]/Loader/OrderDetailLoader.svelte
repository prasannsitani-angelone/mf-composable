<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import OrderCardLoader from './OrderCardLoader.svelte';
</script>

<SkeletonWrapper class="w-full">
	<SkeletonRectangle class="!h-16 w-full md:!h-32" />
	<div class="mt-3 px-2 md:px-0">
		<OrderCardLoader />
		<div class="mt-3 rounded-lg bg-background-alt px-3 py-3">
			<SkeletonRectangle class="!h-64 md:!h-24" />
		</div>
		<SkeletonRectangle class="mt-3 !h-16" />
	</div>
</SkeletonWrapper>
