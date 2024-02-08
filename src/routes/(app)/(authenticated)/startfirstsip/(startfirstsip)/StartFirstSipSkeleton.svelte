<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
</script>

<SkeletonWrapper>
	<div class="flex flex-col">
		<div class=" mb-2 bg-background-alt p-3 sm:mx-3 sm:mb-0">
			<SkeletonRectangle class="mb-4 !h-5 w-full" />
			<div class="mb-4 flex flex-row gap-x-2">
				{#each Array(3) as _}
					<SkeletonRectangle class="!h-28 w-28" />
				{/each}
			</div>
		</div>
		<SkeletonRectangle class="m-2 !h-5 " />
		<section class="flex flex-col flex-wrap items-center px-2">
			{#each Array(3) as _}
				<SkeletonRectangle class="mb-2 h-48 w-full rounded-lg p-3" />
			{/each}
		</section>
	</div>
</SkeletonWrapper>
