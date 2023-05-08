<script>
	import SkeletonCircle from '$components/Skeleton/SkeletonCircle.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<div>
	<SkeletonWrapper class="border-1 mt-5 mt-[60px]  rounded-lg bg-white py-3">
		<div class="flex h-full flex-row space-x-5 border-b border-grey-line">
			<SkeletonRectangle class="mb-2 ml-4 w-40" />
		</div>
		<div class="mt-4 flex gap-3">
			<SkeletonCircle class="ml-4 h-9 w-9" />
			<div>
				<SkeletonRectangle class="mb-2 w-52" />
				<SkeletonRectangle class="mb-2 w-24 sm:w-80" />
			</div>
		</div>
		<div class="border-b border-grey-line px-4">
			<SkeletonRectangle class="mt-9 mb-6 h-8 w-full " />
		</div>
		<div class="flex">
			<div class="ml-4">
				<SkeletonRectangle class="mt-4 mb-2 w-16" />
				<SkeletonRectangle class="w-20" />
			</div>
			<div class="ml-auto mr-4 flex flex-col">
				<SkeletonRectangle class="mt-4 mb-2 ml-auto  w-16" />
				<SkeletonRectangle class="w-20" />
			</div>
		</div>
		<div class="mt-6 rounded px-4">
			<SkeletonRectangle class="h-64 w-full sm:h-96" />
		</div>
		<div class="mt-6 rounded px-4">
			<SkeletonRectangle class="h-8 w-full sm:h-16" />
		</div>
		<div class="mt-11 flex justify-center">
			<SkeletonRectangle class="h-6 w-32 sm:w-60" />
		</div>
	</SkeletonWrapper>

	<SkeletonWrapper class="mt-4 rounded-lg border border-grey-line bg-white py-3">
		<div class="mt-6 flex border-b border-grey-line px-4">
			<SkeletonCircle class="h-9 w-9" />
			<div class="ml-3 mb-6">
				<SkeletonRectangle class="h-4 w-56" />
				<SkeletonRectangle class="mt-3 w-40 sm:w-80" />
			</div>
		</div>
		<div class="mt-9 flex items-center justify-center gap-4 px-8 sm:px-24">
			<SkeletonRectangle class="h-10 w-64" />
			<SkeletonRectangle class="h-10 w-64" />
		</div>
		<div class="flex flex-col px-8 sm:px-24">
			<div class="mt-9 flex">
				<SkeletonRectangle class="h-4 w-24" />
				<SkeletonRectangle class="ml-auto h-4 w-24" />
			</div>
			<SkeletonRectangle class="mt-5 h-4 w-full" />
		</div>
		<div class="flex flex-col px-8 sm:px-24">
			<div class="mt-12 flex">
				<SkeletonRectangle class="h-4 w-24" />
				<SkeletonRectangle class="ml-auto h-4 w-24" />
			</div>
			<SkeletonRectangle class="mt-5 h-4 w-full" />
			<SkeletonRectangle class="mt-16 h-8 w-full " />
			<SkeletonRectangle class="mt-9 h-44 w-full" />
		</div>
	</SkeletonWrapper>
</div>
