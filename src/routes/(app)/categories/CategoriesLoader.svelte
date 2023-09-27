<script>
	import { SkeletonRectangle, SkeletonWrapper } from 'svelte-components';
</script>

<SkeletonWrapper>
	<div class="flex flex-col">
		<div class=" mb-5 bg-white p-3 sm:mx-3 sm:mb-0">
			<div class="mb-4 flex flex-row gap-x-2">
				<SkeletonRectangle class="!h-10 w-28" />
				<SkeletonRectangle class="!h-10 w-28" />
			</div>
			<SkeletonRectangle class="mb-2 !h-5 w-40" />
			<SkeletonRectangle class="mb-2 !h-5 w-full sm:w-1/2" />
			<SkeletonRectangle class="mb-2 block !h-5 w-full sm:hidden" />
		</div>
		<section class="flex flex-col flex-wrap items-center px-2 md:flex-row md:px-6 md:pb-1">
			{#each Array(5) as index}
				<SkeletonRectangle class="mb-2 h-48 w-full rounded-lg p-3 md:mb-4 md:mr-4 md:w-[336px]" />
			{/each}
		</section>
	</div>
</SkeletonWrapper>
