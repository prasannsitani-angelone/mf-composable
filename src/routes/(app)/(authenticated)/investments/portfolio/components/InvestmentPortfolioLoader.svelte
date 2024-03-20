<script>
	import SipHealthLoader from '$components/SipHealth/Nudge/SipHealthLoader.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { Card, SkeletonCircle } from 'svelte-components';
</script>

<SkeletonWrapper>
	<!-- Portfolio Overview -->
	<Card class="mb-2 bg-background-alt !px-4">
		<div class="flex justify-between divide-x">
			<div class="w-1/2">
				<SkeletonRectangle class="mb-1 !h-[14px] w-[74px] rounded-sm" />
				<SkeletonRectangle class="!h-6 w-[106px] rounded-sm" />
			</div>
			<div class="flex w-1/2 flex-col items-end">
				<SkeletonRectangle class="mb-1 !h-[14px] w-[74px] rounded-sm" />
				<SkeletonRectangle class="!h-6 w-[106px] rounded-sm" />
			</div>
		</div>
		<SkeletonRectangle class="!h-[50px] w-full rounded" />
	</Card>
	<!-- Portfolio Graph -->
	<Card class="my-2 bg-background-alt !px-4 !pt-4">
		<SkeletonRectangle class="!h-[42px] w-full rounded" />
		<div class="flex items-center">
			<div class="mr-1 w-2">
				<SkeletonCircle class="!h-2 w-2" />
			</div>
			<SkeletonRectangle class="mr-2 !h-[11px] w-[100px] rounded-sm" />
			<div class="mr-1 w-2">
				<SkeletonCircle class="mr-1 h-2 w-2" />
			</div>
			<SkeletonRectangle class="mr-2 !h-[11px] w-full rounded-sm" />
			<div class="w-3">
				<SkeletonCircle class="!h-3 !w-3" />
			</div>
		</div>
		<SkeletonRectangle class="mt-3 !h-[132px] w-full rounded" />
		<div class="mb-3 mt-6 flex justify-between">
			{#each { length: 7 } as _, index (index)}
				<SkeletonRectangle class="!h-5 w-9 rounded" />
			{/each}
		</div>
	</Card>
	<SipHealthLoader class="my-3" />
	<!-- LTSG & STCG Tax Overview -->
	<Card class="my-3 bg-background-alt !px-4">
		<div class="mb-1 flex">
			<SkeletonCircle class="mr-2 !h-9 w-9" />
			<div>
				<SkeletonRectangle class="mb-1 !h-5 w-[112px] rounded-sm" />
				<SkeletonRectangle class="!h-[14px] w-[212px] rounded-sm" />
			</div>
		</div>
		<SkeletonRectangle class="!h-5 w-[174px] rounded-sm" />
		<div class="flex">
			<SkeletonRectangle class="mr-1 !h-4 w-full rounded-sm" />
			<SkeletonRectangle class="!h-4 w-[53px] rounded-sm" />
		</div>
		<!-- #1 -->
		<div class="flex items-center justify-between pt-1">
			<div class="flex">
				<SkeletonRectangle class="mr-2 !h-4 w-4 rounded-sm" />
				<SkeletonRectangle class="!h-5 w-[107px] rounded-sm" />
			</div>
			<div class="flex items-center">
				<div>
					<SkeletonRectangle class="mb-1 !h-4 w-[44px] rounded-sm" />
					<SkeletonRectangle class="!h-3 w-[44px] rounded-sm" />
				</div>
				<SkeletonRectangle class="ml-2 !h-4 w-4 rounded-sm" />
			</div>
		</div>
		<!-- #2 -->
		<div class="flex items-center justify-between border-t pt-3">
			<div class="flex">
				<SkeletonRectangle class="mr-2 !h-4 w-4 rounded-sm" />
				<SkeletonRectangle class="!h-5 w-[107px] rounded-sm" />
			</div>
			<div class="flex items-center">
				<div>
					<SkeletonRectangle class="mb-1 !h-4 w-[44px] rounded-sm" />
					<SkeletonRectangle class="!h-3 w-[44px] rounded-sm" />
				</div>
				<SkeletonRectangle class="ml-2 !h-4 w-4 rounded-sm" />
			</div>
		</div>
	</Card>
	<!-- Asset Class Analysis -->
	<Card class="my-3 bg-background-alt !px-0 !pb-3">
		<div class="flex px-4">
			<SkeletonCircle class="mr-2 !h-9 w-9" />
			<div>
				<SkeletonRectangle class="mb-1 !h-5 w-[166px] rounded-sm" />
				<SkeletonRectangle class="!h-[14px] w-[228px] rounded-sm" />
			</div>
		</div>
		<div class="mt-[10px] flex">
			<div class="flex w-1/2 items-center justify-center border-b-2 pb-[19px]">
				<SkeletonRectangle class="mr-2 !h-5 w-20 rounded-sm" />
			</div>
			<div class="m-auto pb-[19px]">
				<SkeletonRectangle class="mr-2 !h-5 w-20 rounded-sm" />
			</div>
		</div>
		<div class="mt-5 flex items-center justify-center">
			<SkeletonRectangle class="mr-4 !h-8 w-[95px] rounded-sm" />
			<SkeletonRectangle class="!h-3 w-[52px] rounded-sm" />
		</div>
		<div class="relative mx-auto my-6">
			<SkeletonCircle class="!h-[188px] w-[188px]" />
			<div class="absolute left-[18%] top-[34px] rounded-full bg-background-alt px-4 py-[44px]">
				<SkeletonRectangle class="!h-8 w-[87px] rounded-sm" />
			</div>
		</div>
		<div class="flex justify-between px-4">
			<SkeletonRectangle class=" !h-[11px] w-[70px] rounded-sm" />
			<SkeletonRectangle class=" !h-[11px] w-[70px] rounded-sm" />
			<SkeletonRectangle class=" !h-[11px] w-[70px] rounded-sm" />
		</div>
		{#each { length: 3 } as _, index (index)}
			<div class="flex justify-between px-4 pb-2">
				<div class="flex">
					<div class="mr-2 flex w-[6px] items-center">
						<SkeletonCircle class="!h-[6px] w-[6px]" />
					</div>
					<SkeletonRectangle class="!h-5 w-[56px] rounded-sm" />
				</div>
				<SkeletonRectangle class="!h-5 w-[70px] rounded-sm" />
				<SkeletonRectangle class="!h-5 w-[70px] rounded-sm" />
			</div>
		{/each}
		<div class="mx-auto">
			<SkeletonRectangle class="!h-5 w-[124px] rounded-sm" />
		</div>
	</Card>
</SkeletonWrapper>
