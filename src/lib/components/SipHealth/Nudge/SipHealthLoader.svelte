<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import { Card, SkeletonCircle } from 'svelte-components';
</script>

<Card class="bg-background-alt px-4 py-3 {$$props.class}">
	<div class="flex justify-between">
		<div>
			<SkeletonRectangle class="mb-1 !h-6 w-[112px] rounded-sm" />
			<SkeletonRectangle class="!h-[14px] w-[212px] rounded-sm" />
			<SkeletonRectangle class="mt-3 !h-[14px] w-[78px] rounded-sm" />
		</div>
		<div class="mr-4">
			<SkeletonCircle class="h-[65px] w-[65px]" />
		</div>
	</div>
</Card>
