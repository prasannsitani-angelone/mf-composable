<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	let discoverPage = false;
	let hideBottomLoader = false;
	export { discoverPage, hideBottomLoader };
</script>

<SkeletonWrapper class=" w-full rounded-lg bg-white p-6 shadow-csm max-sm:p-4 max-sm:pb-0 ">
	<div class="  bg-white pb-2">
		<div class="mb-2 flex">
			<SkeletonRectangle class="h-2 flex-1" />
			<SkeletonRectangle class="ml-8 h-2 flex-1" />
		</div>
		<div class="flex">
			<SkeletonRectangle class="h-5 flex-1" />
			<SkeletonRectangle class="ml-8 h-5 flex-1" />
		</div>
		<SkeletonRectangle class="mt-6 !h-16 w-full {discoverPage ? 'max-sm:hidden' : ''}" />
	</div>
	<div
		class="mx-auto mt-2 flex w-full justify-center rounded-md border border-grey-line px-3 py-5 max-sm:hidden"
	>
		<SkeletonRectangle class="h-5 w-[60%] " />
	</div>

	<div
		class=" mt-2 flex border-t border-grey-line bg-white pb-4 pt-2 sm:hidden {!discoverPage
			? 'pt-4'
			: ''} {hideBottomLoader ? 'hidden' : ''}"
	>
		<SkeletonRectangle class="h-2 flex-1 " />
		<SkeletonRectangle class="ml-8 h-2 flex-1 {discoverPage ? 'flex' : 'hidden'}" />
	</div>
</SkeletonWrapper>
