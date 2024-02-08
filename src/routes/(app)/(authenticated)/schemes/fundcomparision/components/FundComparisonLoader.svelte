<script>
	import { SkeletonWrapper, SkeletonRectangle } from 'svelte-components';
</script>

<section class="w-full">
	<SkeletonWrapper class="w-full">
		<div class="mb-2 !h-full w-full rounded-lg bg-background-alt">
			<div class="flex !h-36 w-full bg-background-alt py-4">
				<div class="mx-4 !h-28 w-1/4 rounded-lg" />
				<SkeletonRectangle class=" mx-4 !h-28 w-1/4 rounded-lg" />
				<SkeletonRectangle class=" mx-4 !h-28 w-1/4 rounded-lg" />
				<SkeletonRectangle class=" mx-4 !h-28 w-1/4 rounded-lg" />
			</div>
			<div class="mb-2 w-full rounded-b-lg border-t bg-background-alt p-4">
				{#each { length: 3 } as _, index (index)}
					<div class="flex justify-between">
						<SkeletonRectangle class="mb-2 mr-4 mt-2 !h-6 w-1/4 rounded-lg" />
						<SkeletonRectangle class="mb-2 ml-4 mt-2 !h-6 w-3/4 rounded-lg" />
					</div>
				{/each}
			</div>
		</div>
		{#each { length: 6 } as _, index (index)}
			<div class="my-4 w-full rounded-b-lg bg-background-alt p-4">
				<SkeletonRectangle class=" !h-8 w-full rounded-lg" />
			</div>
		{/each}
	</SkeletonWrapper>
</section>
