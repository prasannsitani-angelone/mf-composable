<script>
	import { SkeletonCircle, SkeletonRectangle, SkeletonWrapper } from 'svelte-components';
	import Card from '$components/Card.svelte';
</script>

<SkeletonWrapper>
	<Card class="rounded-lg bg-background-alt px-2 pt-4 shadow-csm">
		<SkeletonRectangle class=" mx-5 my-4 !h-8 rounded-full" />

		<SkeletonRectangle class=" mx-auto mb-20 mt-10 !h-48 w-64" />
		<SkeletonRectangle class="mx-auto mb-2 !h-6 w-40" />
		<SkeletonRectangle class="mx-auto mb-10 !h-6 w-60" />
		<div class=" w-full px-2">
			<div class="mb-6 flex w-full">
				<SkeletonCircle class=" mr-4 h-4 w-4" />
				<div class=" flex-1">
					<SkeletonRectangle class=" mb-2 h-4 w-full" />
					<SkeletonRectangle class=" mb-2 h-4 w-full" />
				</div>
			</div>
			<div class="mb-6 flex w-full">
				<SkeletonCircle class=" mr-4 h-4 w-4" />
				<div class=" flex-1">
					<SkeletonRectangle class=" mb-2 h-4 w-full" />
					<SkeletonRectangle class=" mb-2 h-4 w-full" />
				</div>
			</div>
			<div class="mb-6 flex w-full">
				<SkeletonCircle class=" mr-4 h-4 w-4" />
				<div class=" flex-1">
					<SkeletonRectangle class=" mb-2 h-4 w-full" />
					<SkeletonRectangle class=" mb-2 h-4 w-full" />
				</div>
			</div>
		</div>
	</Card>
</SkeletonWrapper>
