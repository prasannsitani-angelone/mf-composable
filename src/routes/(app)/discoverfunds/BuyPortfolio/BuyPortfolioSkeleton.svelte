<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { page } from '$app/stores';

	$: deviceType = $page.data.deviceType;
</script>

<SkeletonWrapper class="w-full rounded-lg bg-background-alt p-3 pb-1 shadow-csm">
	<div class="my-3 ml-4">
		<SkeletonRectangle class="mt-2 !h-4 w-72" />
		<SkeletonRectangle class="mt-2 !h-2 w-48" />
	</div>
	<div class="mx-4 my-4 flex gap-3">
		<SkeletonRectangle class="mt-2 !h-32 w-72" />
		<SkeletonRectangle class="mt-2 !h-32 w-72" />
		{#if !deviceType?.isMobile}
			<SkeletonRectangle class="mt-2 !h-32 w-72" />
		{/if}
	</div>
</SkeletonWrapper>
