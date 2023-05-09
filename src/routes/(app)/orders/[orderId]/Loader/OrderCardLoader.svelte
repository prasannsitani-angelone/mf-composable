<script>
	import SkeletonCircle from '$components/Skeleton/SkeletonCircle.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
</script>

<div class="grid grid-cols-1 divide-y rounded-lg bg-white px-3 py-4 shadow-csm">
	<div class="flex pb-3">
		<SkeletonCircle class="mr-3 h-12 w-14 md:w-12" />
		<SkeletonRectangle class="!h-12 w-full md:!h-12" />
	</div>
	<div class={`grid grid-cols-3 divide-x pt-3`}>
		<div class="p-2">
			<SkeletonRectangle class="!h-12" />
		</div>
		<div class="p-2">
			<SkeletonRectangle class="!h-12" />
		</div>
		<div class="p-2">
			<SkeletonRectangle class="!h-12" />
		</div>
	</div>
</div>
