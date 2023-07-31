<script>
	import { SkeletonRectangle, SkeletonWrapper } from 'svelte-components';
</script>

<SkeletonWrapper>
	<div class="mx-2 mb-2 mt-3 flex flex-col">
		<div class="mb-2 rounded-lg bg-white p-3">
			<SkeletonRectangle class="h-24" />
		</div>
		<div class="mb-2 flex flex-1 flex-col rounded-lg bg-white p-3">
			<SkeletonRectangle class="h-[450px] w-full" />
		</div>
		<div class="mb-2 rounded-lg bg-white p-3">
			<SkeletonRectangle class="!h-16 h-16" />
		</div>
		<div class="mb-2 rounded-lg bg-white p-3">
			<div class="flex flex-row justify-between rounded bg-grey p-2">
				<div class="flex flex-col">
					<SkeletonRectangle class="mb-1 w-20" />
					<SkeletonRectangle class="w-10" />
				</div>
				<div class="flex flex-col">
					<SkeletonRectangle class="mb-1 w-20" />
					<SkeletonRectangle class="w-10" />
				</div>
			</div>
		</div>
	</div>
</SkeletonWrapper>
