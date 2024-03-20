<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { Card, SkeletonCircle } from 'svelte-components';
</script>

<SkeletonWrapper class="flex w-full flex-col gap-3">
	{#each { length: 10 } as _, index (index)}
		<Card class="bg-background-alt px-2 py-4">
			<SkeletonRectangle class="mb-2 !h-3 w-[60px] rounded-sm" />
			<div class="flex justify-between">
				<div class="flex gap-3">
					<SkeletonCircle class="h-9 w-9" />
					<div>
						<SkeletonRectangle class="mb-1 !h-4 w-[168px] rounded-sm" />
						<SkeletonRectangle class="!h-5 w-[60px] rounded-sm p-1" />
					</div>
				</div>
				<div class="flex flex-col items-end">
					<SkeletonRectangle class="mb-1 !h-[14px] w-9 rounded-sm p-1" />
					<SkeletonRectangle class="!h-5 w-[60px] rounded-sm p-1" />
				</div>
			</div>
		</Card>
	{/each}
</SkeletonWrapper>
