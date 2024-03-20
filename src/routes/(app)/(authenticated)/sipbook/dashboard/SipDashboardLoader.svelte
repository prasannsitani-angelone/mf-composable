<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { Card } from 'svelte-components';
	import SipCardLoader from '../inactivesips/SipCardLoader.svelte';
	import SipHealthLoader from '$components/SipHealth/Nudge/SipHealthLoader.svelte';
</script>

<SkeletonWrapper>
	<Card class="bg-background-alt !p-0">
		<div class="flex h-[87px] justify-between divide-x border-b py-5">
			<div class="flex w-1/2 flex-col items-center justify-center">
				<SkeletonRectangle class="mb-1 !h-[14px] w-[61px] rounded-sm" />
				<SkeletonRectangle class="!h-5 w-[21px] rounded-sm" />
			</div>
			<div class="flex w-1/2 flex-col items-center justify-center">
				<SkeletonRectangle class="mb-1 !h-[14px] w-[94px] rounded-sm" />
				<SkeletonRectangle class="!h-5 w-[66px] rounded-sm" />
			</div>
		</div>
		<div class="mx-4 flex items-center justify-between pb-[14px]">
			<div>
				<SkeletonRectangle class=" !h-[14px] w-[107px] rounded-sm" />
			</div>
			<div class="flex gap-[6px]">
				<SkeletonRectangle class="!h-4 w-[122px] rounded-sm" />
				<SkeletonRectangle class="!h-4 w-4 rounded-sm" />
			</div>
		</div>
	</Card>
	<SipHealthLoader class="my-3" />
	{#each { length: 5 } as _, index (index)}
		<SipCardLoader />
	{/each}
</SkeletonWrapper>
