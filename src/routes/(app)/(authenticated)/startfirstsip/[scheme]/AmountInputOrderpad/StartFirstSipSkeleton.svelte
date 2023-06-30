<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper>
	<SkeletonRectangle class="mb-2 !h-72 w-full rounded-lg" />
</SkeletonWrapper>

<section
	class="fixed inset-0 top-auto z-20 block rounded-t-lg bg-white px-3 py-6 shadow-csm md:hidden"
>
	<SkeletonWrapper>
		<SkeletonRectangle class="mt-2 mb-2 !h-52 w-full rounded-lg" />
	</SkeletonWrapper>

	<SkeletonWrapper class="flex w-full items-center justify-around">
		<SkeletonRectangle class="!h-12 w-full rounded" />
	</SkeletonWrapper>
</section>
