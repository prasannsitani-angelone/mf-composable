<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import SkeletonCircle from '$components/Skeleton/SkeletonCircle.svelte';
	import { Card } from 'svelte-components';
</script>

<SkeletonWrapper>
	<Card class="mb-3 bg-background-alt !px-0">
		<div class="mx-4 flex justify-between">
			<div>
				<SkeletonRectangle class="mb-2 !h-[14px] w-[94px] rounded-sm" />
				<SkeletonRectangle class="!h-6 w-[142px] rounded-sm" />
			</div>
			<SkeletonRectangle class="!h-4 w-4 rounded-sm" />
		</div>
		<div class="border-b px-4 pb-2">
			<div class="flex justify-between divide-x rounded bg-background px-2 py-3">
				<div class="w-1/2">
					<SkeletonRectangle class="mb-1 !h-3 w-[61px] rounded-sm" />
					<SkeletonRectangle class="!h-4 w-[119px] rounded-sm" />
				</div>
				<div class="flex w-1/2 flex-col items-end">
					<SkeletonRectangle class="mb-1 !h-3 w-[94px] rounded-sm" />
					<SkeletonRectangle class="!h-4 w-[123px] rounded-sm" />
				</div>
			</div>
		</div>
		<div class="mx-4 flex justify-center gap-2">
			<SkeletonRectangle class="!h-4 w-[112px] rounded-sm" />
			<SkeletonRectangle class="!h-4 w-4 rounded-sm" />
		</div>
	</Card>
	<section class="mb-3 flex items-center justify-between">
		<SkeletonRectangle class="!h-4 w-[184px] rounded-sm" />
		<div class="flex border">
			<SkeletonRectangle class="!h-6 w-[67px] rounded-sm" />
			<div class="!h-6 w-[67px] rounded-sm bg-background-alt" />
		</div>
	</section>
	{#each { length: 5 } as _, index (index)}
		<Card class="my-2 bg-background-alt pb-[14px] pt-2">
			<div class="flex">
				<SkeletonCircle class="mr-1 h-3 w-3" />
				<SkeletonRectangle class="!h-3 w-[51px] rounded-sm" />
			</div>
			<div class="flex justify-between">
				<div class="flex items-center">
					<SkeletonCircle class="mr-2 h-9 w-9" />
					<SkeletonRectangle class="!h-4 w-[184px] rounded-sm" />
				</div>
				<div class="flex flex-col items-end">
					<SkeletonRectangle class="mb-1 !h-[14px] w-[50px] rounded-sm" />
					<SkeletonRectangle class="!h-4 w-[70px] rounded-sm" />
				</div>
			</div>
			<div class="flex justify-between border-t pt-3">
				<div>
					<SkeletonRectangle class="mb-2 !h-3 w-[94px] rounded-sm" />
					<SkeletonRectangle class="!h-[14px] w-[77px] rounded-sm" />
				</div>
				<div class="flex flex-col items-end">
					<SkeletonRectangle class="mb-2 !h-3 w-[59px] rounded-sm" />
					<SkeletonRectangle class="!h-[14px] w-[100px] rounded-sm" />
				</div>
			</div>
		</Card>
	{/each}
</SkeletonWrapper>
