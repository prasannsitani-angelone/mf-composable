<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper>
	<SkeletonRectangle class="mb-2 mt-2 !h-24 w-full rounded-lg" />
	<SkeletonRectangle class="mb-2 mt-2 !h-44 w-full rounded-lg" />
	<SkeletonRectangle class="mb-2 mt-2 !h-40 w-full rounded-lg" />
	<SkeletonRectangle class="m-4 !h-12" />
	<article class="mx-3 mt-4 block md:hidden">
		<section class="fixed inset-0 top-auto bg-background-alt px-4 py-3">
			<SkeletonRectangle class="!h-12" />
		</section>
	</article>
</SkeletonWrapper>
