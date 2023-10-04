<script lang="ts">
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonCircle from '$components/Skeleton/SkeletonCircle.svelte';
</script>

<SkeletonWrapper>
	<div class="hidden bg-white sm:flex">
		<div
			class="w-full grid-cols-[55%_45%] items-center gap-y-2 rounded-t border-b border-t border-grey-line bg-white px-6 py-4 text-sm font-normal text-grey-dark sm:grid sm:grid-cols-[46%_18%_18%_18%] sm:items-center sm:px-6 sm:py-4"
		>
			<div class="mx-2 flex items-center">
				<SkeletonRectangle class="!h-4 w-80" />
			</div>
			<div class="mx-2 flex items-center">
				<SkeletonRectangle class="!h-4 w-40" />
			</div>
			<div class="mx-2 flex items-center">
				<SkeletonRectangle class="!h-4 w-40" />
			</div>
			<div class="mx-2 flex items-center">
				<SkeletonRectangle class="!h-4 w-40" />
			</div>
		</div>
		<div class="border-b sm:flex sm:items-center sm:pl-4 sm:pr-12">
			<SkeletonRectangle class="!h-4 w-8" />
		</div>
	</div>
	{#each [1, 2, 3, 4, 5] as _}
		<div class="flex !h-20 items-center border-b border-t border-grey-line bg-white">
			<div
				class="grid w-[90%] grid-cols-[55%_45%] items-center gap-y-2 rounded-t bg-white py-2 pl-0 text-sm font-normal text-grey-dark sm:w-full sm:grid-cols-[46%_18%_18%_18%] sm:items-center sm:px-6 sm:py-3"
			>
				<div class="col-span-1 col-start-1 row-span-1 row-start-1 mx-2 flex items-center">
					<SkeletonCircle class="mr-4 !h-6 !w-6 sm:!h-12 sm:!w-12" />
					<SkeletonRectangle class="!h-4 w-20 sm:w-80" />
				</div>
				<div
					class="col-span-1 col-start-1 row-span-1 row-start-2 mx-2 flex items-center sm:col-start-2 sm:row-start-1"
				>
					<SkeletonRectangle class="!h-4 w-40" />
				</div>
				<div
					class="col-span-1 col-start-2 row-span-1 row-start-2 mx-2 flex items-center sm:col-start-3 sm:row-start-1"
				>
					<SkeletonRectangle class="!h-4 w-40" />
				</div>
				<div
					class="col-span-1 col-start-2 row-span-1 row-start-1 mx-2 flex items-center sm:col-start-4 sm:row-start-1"
				>
					<SkeletonRectangle class="!h-4 w-40" />
				</div>
			</div>
			<div class="flex sm:h-full sm:items-center sm:pl-4 sm:pr-12">
				<SkeletonRectangle class="!h-4 w-8" />
			</div>
		</div>
	{/each}
</SkeletonWrapper>
