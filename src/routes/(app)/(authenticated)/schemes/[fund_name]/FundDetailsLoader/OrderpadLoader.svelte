<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper
	class="mt-5 hidden h-120 w-full rounded-lg bg-background-alt px-3 shadow-csm md:block md:w-[350px] md:py-3"
>
	<SkeletonRectangle class="h-72 w-full " />
	<div class=" mt-2 rounded-lg border bg-background-alt px-3 pb-4 pt-5">
		<div class="flex">
			<SkeletonRectangle class="h-5 w-20" />
			<SkeletonRectangle class="ml-auto h-5 w-36" />
		</div>
		<SkeletonRectangle class="mt-6 h-12 w-full" />
	</div>
	<div class="mb-5 mt-6 flex justify-center">
		<SkeletonRectangle class="h-3 w-64" />
	</div>
	<SkeletonRectangle class="h-12 w-full" />
</SkeletonWrapper>
