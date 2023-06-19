<script>
	import SkeletonCircle from '$components/Skeleton/SkeletonCircle.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
</script>

<div class="flex h-full flex-col">
	<article
		class="flex flex-col items-center border-b border-grey-line bg-white px-4 py-3 sm:border-b-0"
	>
		<div class="flex flex-row items-center">
			<SkeletonCircle class="h-6 w-6" />
			<div class="ml-2">
				<SkeletonRectangle class="w-52" />
			</div>
		</div>
		<SkeletonRectangle class="mt-2 w-full" />
	</article>
	<div
		class="my-2 ml-2 mr-2 flex flex-col rounded border border-grey-line bg-white px-4 py-3 shadow-csm sm:m-0 sm:my-3 sm:py-6"
	>
		<div class="mb-2 flex flex-row items-center">
			<SkeletonCircle class="h-9 w-9" />
			<SkeletonRectangle class="ml-2 w-24" />
		</div>
		<div class="flex w-full flex-col bg-grey px-4 py-2 sm:px-6 sm:py-4">
			<SkeletonRectangle class="mb-1 w-16" />
			<SkeletonRectangle class="w-10" />
		</div>
		<SkeletonRectangle class="mt-6 w-32 self-end" />
	</div>
</div>
