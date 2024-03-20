<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { Checkbox } from 'svelte-components';
</script>

<SkeletonWrapper class="flex w-full flex-col gap-3">
	<div class="bg-background-alt p-3">
		<SkeletonRectangle class="mb-2 !h-4 w-[60px] rounded-sm" />
		<div class="flex justify-between">
			{#each { length: 2 } as _, index (index)}
				<div class="flex items-center">
					<Checkbox />
					<SkeletonRectangle class="mb-2 mt-2 !h-3 w-[85px] rounded-sm" />
				</div>
			{/each}
			<div class="flex items-center">
				<Checkbox />
				<SkeletonRectangle class="mb-2 mt-2 !h-3 w-[70px] rounded-sm" />
			</div>
		</div>
	</div>
</SkeletonWrapper>
