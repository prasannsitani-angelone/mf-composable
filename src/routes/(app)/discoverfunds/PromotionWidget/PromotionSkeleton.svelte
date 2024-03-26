<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { SkeletonCircle } from 'svelte-components';
</script>

<SkeletonWrapper
	class="mt-2 flex w-full items-center justify-evenly rounded-lg bg-background-alt shadow-csm"
>
	<div class="my-3 flex flex-col items-center">
		<SkeletonCircle class="h-14 w-14" />
		<div class="mt-2 flex w-full gap-8">
			<SkeletonRectangle class="mt-2 !h-24 !w-72" />
		</div>
	</div>
</SkeletonWrapper>
