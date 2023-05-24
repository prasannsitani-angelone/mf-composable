<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper
	class="mt-5 hidden h-120 w-full rounded-lg bg-white px-3 shadow-csm md:block md:w-[350px] md:py-3"
>
	<SkeletonRectangle class="h-72 w-full " />
	<div class=" mt-2 rounded-lg border border-grey-line bg-white px-3 pt-5 pb-4">
		<div class="flex">
			<SkeletonRectangle class="h-5 w-20" />
			<SkeletonRectangle class="ml-auto h-5 w-36" />
		</div>
		<SkeletonRectangle class="mt-6 h-12 w-full" />
	</div>
	<div class="mt-6 mb-5 flex justify-center">
		<SkeletonRectangle class="h-3 w-64" />
	</div>
	<SkeletonRectangle class="h-12 w-full" />
</SkeletonWrapper>
