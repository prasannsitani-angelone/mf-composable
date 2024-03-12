<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<section class="w-full">
	<SkeletonWrapper class="w-full px-4 pb-8 pt-4 md:px-8">
		<div class="flex w-full flex-col gap-2">
			<SkeletonRectangle class="!h-24 rounded-lg !bg-border" />
		</div>
	</SkeletonWrapper>
</section>
