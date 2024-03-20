<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import { Card, SkeletonCircle } from 'svelte-components';
</script>

<Card class="my-2 bg-background-alt p-3">
	<div class="flex items-center">
		<SkeletonCircle class="mr-2 h-6 w-6" />
		<SkeletonRectangle class="!h-4 w-[214px] rounded-sm" />
	</div>
	<SkeletonRectangle class="mb-2 mt-3 !h-[52px] w-full rounded" />
	<div class="flex items-center">
		<SkeletonCircle class="mr-1 h-3 w-3" />
		<SkeletonRectangle class="!h-3 w-[83px] rounded-sm" />
	</div>
</Card>
