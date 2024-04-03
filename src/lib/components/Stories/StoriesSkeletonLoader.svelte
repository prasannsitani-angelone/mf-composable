<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { SkeletonCircle } from 'svelte-components';
</script>

<SkeletonWrapper
	class="flex w-full items-center justify-evenly rounded-lg bg-background-alt shadow-csm"
>
	<div class="my-3">
		<SkeletonCircle class="h-14 w-14" />
		<SkeletonRectangle class="mt-2 !h-2 w-14" />
	</div>
	<div class="my-3">
		<SkeletonCircle class="h-14 w-14" />
		<SkeletonRectangle class="mt-2 !h-2 w-14" />
	</div>
	<div class="my-3">
		<SkeletonCircle class="h-14 w-14" />
		<SkeletonRectangle class="mt-2 !h-2 w-14" />
	</div>
	<div class="my-3">
		<SkeletonCircle class="h-14 w-14" />
		<SkeletonRectangle class="mt-2 !h-2 w-14" />
	</div>
</SkeletonWrapper>
