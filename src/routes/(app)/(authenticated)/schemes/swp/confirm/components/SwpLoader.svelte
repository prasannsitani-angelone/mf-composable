<script>
	import { SkeletonWrapper, SkeletonRectangle, SkeletonCircle } from 'svelte-components';
</script>

<section class="w-[415px]">
	<SkeletonWrapper class="w-full">
		<div class="mb-2 !h-full w-full rounded-lg bg-white">
			<div class="!h-16 w-full bg-white p-4">
				<SkeletonRectangle class=" !h-8 w-1/3 rounded-lg " />
			</div>
			<div class="mb-2 w-full rounded-b-lg border-t border-grey-line bg-white">
				<div class="flex justify-between border-b border-grey-line p-4">
					<SkeletonCircle class="!h-16 !w-16" />
					<SkeletonRectangle class="!h-16 w-[80%] rounded-lg" />
				</div>
				<div class="flex justify-between border-b border-grey-line p-4">
					<SkeletonRectangle class=" !h-8 w-1/3 rounded-lg " />
				</div>
				<div class="border-b border-grey-line p-4">
					{#each { length: 5 } as _, index (index)}
						<div class="flex justify-between">
							<SkeletonRectangle class="mb-2 mt-2 !h-8 w-[35%] rounded-lg" />
							<SkeletonRectangle class="mb-2 mt-2 !h-8 w-[25%] rounded-lg" />
						</div>
					{/each}
				</div>

				<div class="p-4">
					<SkeletonRectangle class="mb-4 !h-8 w-1/3 rounded-lg " />
					<div class="rounded-lg border border-grey-line p-4">
						<SkeletonRectangle class=" !h-10 w-full rounded-lg" />
					</div>
				</div>
				<div class="border-t border-grey-line p-4">
					<SkeletonRectangle class="!h-12 w-full rounded-lg" />
				</div>
			</div>
		</div>
	</SkeletonWrapper>
</section>
