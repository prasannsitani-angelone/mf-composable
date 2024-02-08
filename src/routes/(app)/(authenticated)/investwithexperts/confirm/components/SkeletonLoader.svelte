<script>
	import { SkeletonRectangle, SkeletonWrapper } from 'svelte-components';
</script>

<SkeletonWrapper>
	<div class="mx-2 mb-2 mt-3 flex flex-col">
		<!-- Section 1 -->
		<div class="mb-2 rounded-lg bg-background-alt p-3">
			<!-- Heading  -->
			<SkeletonRectangle class="mb-4 w-40" />
			<!-- Investment Info  -->
			<div class="flex flex-row justify-between rounded bg-background p-2">
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
		<!-- Section 2 -->
		<div class="flex flex-1 flex-col rounded-lg bg-background-alt p-3">
			<SkeletonRectangle class="h-60 w-full" />
		</div>
	</div>
</SkeletonWrapper>
