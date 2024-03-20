<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { Card, SkeletonCircle } from 'svelte-components';
</script>

<SkeletonWrapper>
	<Card class="bg-background-alt p-4">
		<div class="flex items-center">
			<SkeletonCircle class="mr-2 h-9 w-9" />
			<SkeletonRectangle class="!h-4 w-[220px] rounded-sm" />
		</div>
	</Card>
	<Card class="my-2 bg-background-alt px-4 py-5">
		<div class="flex flex-col gap-3">
			<SkeletonRectangle class="!h-6 w-24 rounded-sm" />
			<div class="rounded border px-3 py-4">
				<div class="flex justify-between">
					<SkeletonRectangle class="!h-3 w-[100px] rounded-sm" />
					<SkeletonRectangle class="!h-4 w-[60px] rounded-sm" />
				</div>
				<div class="mt-3 flex justify-between">
					<SkeletonRectangle class="!h-3 w-[100px] rounded-sm" />
					<SkeletonRectangle class="!h-4 w-[88px] rounded-sm" />
				</div>
			</div>
			<div class="flex justify-between pt-2">
				<div class="flex">
					<SkeletonCircle class="mr-1 h-5 w-5" />
					<div>
						<SkeletonRectangle class="!h-4 w-[71px] rounded-sm" />
						<SkeletonRectangle class="mt-1 !h-2 w-[57px] rounded-sm" />
					</div>
				</div>
				<div class="flex">
					<SkeletonCircle class="mr-1 h-3 w-3" />
					<SkeletonRectangle class="!h-3 w-[90px] rounded-sm" />
				</div>
			</div>
		</div>
	</Card>
	<Card class="bg-background-alt !p-0">
		<section class="px-4 pb-2 pt-5">
			<SkeletonRectangle class="mb-2 !h-6 w-[134px] rounded-sm" />
			<div class="flex items-center gap-1">
				<SkeletonRectangle class="!h-4 w-full rounded-sm" />
				<SkeletonCircle class="h-1 w-1" />
				<SkeletonRectangle class="!h-4 w-full rounded-sm" />
			</div>
		</section>
		<section class="border-b px-4 pb-3">
			<div class="flex items-center gap-3">
				<div class="flex items-center">
					<SkeletonCircle class="mr-1 h-5 w-5" />
					<SkeletonRectangle class="!h-[14px] w-[70px] rounded-sm" />
				</div>
				{#each { length: 2 } as _, index (index)}
					<div class="flex items-center">
						<SkeletonCircle class="mr-1 h-5 w-5" />
						<SkeletonRectangle class="!h-[14px] w-[51px] rounded-sm" />
					</div>
				{/each}
			</div>
		</section>
		<section class="border-b px-3 pt-2">
			{#each { length: 3 } as _, index (index)}
				<div class="flex">
					<div class="mr-2 flex flex-col items-center">
						<SkeletonCircle class="h-6 w-6" />
						{#if index !== 2}
							<div class="flex flex-1 border-l" />
						{/if}
					</div>
					<div class="pb-5">
						<SkeletonRectangle class="mt-[2px] !h-4 w-[140px] rounded-sm" />
						<SkeletonRectangle class="mt-2 !h-4 w-[130px] rounded-sm" />
					</div>
				</div>
			{/each}
		</section>
		<section class="pt- px-4 pb-4">
			<SkeletonRectangle class="m-auto !h-4 w-[76px] rounded-sm" />
		</section>
	</Card>
	<article class="mx-3 mt-4 block md:hidden">
		<section class="fixed inset-0 top-auto bg-background-alt px-4 py-3">
			<SkeletonRectangle class="!h-12" />
		</section>
	</article>
</SkeletonWrapper>
