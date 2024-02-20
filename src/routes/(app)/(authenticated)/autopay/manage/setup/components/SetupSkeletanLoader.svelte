<script lang="ts">
	import { SkeletonCircle, SkeletonRectangle, SkeletonWrapper } from 'svelte-components';
	import Card from '$components/Card.svelte';
</script>

<SkeletonWrapper>
	<Card class="rounded-lg bg-background-alt px-2 pt-4 shadow-csm">
		<div class="mb-6 flex">
			<div class=" w-2/4 border-r">
				<SkeletonRectangle class="mb-2 !h-3 w-[75%] !bg-border" />
				<SkeletonRectangle class="h-6 w-20 !bg-border " />
			</div>
			<div class=" flex w-2/4 flex-col items-end">
				<SkeletonRectangle class="mb-2 !h-3 w-[75%] !bg-border" />
				<SkeletonRectangle class="h-6 w-20 !bg-border " />
			</div>
		</div>
		<div class=" border p-3">
			<SkeletonRectangle class="mb-4 h-4 w-20 !bg-border" />
			<div class=" w-full">
				<div class="mb-2 flex w-full">
					<SkeletonCircle class=" mr-2 h-2 w-2" />
					<div class=" flex-1">
						<SkeletonRectangle class="mb-2 !h-3 w-full !bg-border" />
						<SkeletonRectangle class="mb-2 !h-3 w-2/4 !bg-border" />
					</div>
				</div>
				<div class="mb-2 flex w-full">
					<SkeletonCircle class=" mr-2 h-2 w-2" />
					<div class=" flex-1">
						<SkeletonRectangle class="mb-2 !h-3 w-full !bg-border" />
						<SkeletonRectangle class="mb-2 !h-3 w-2/4 !bg-border" />
					</div>
				</div>
				<div class="flex w-full">
					<SkeletonCircle class=" mr-2 h-2 w-2" />
					<div class=" flex-1">
						<SkeletonRectangle class="mb-2 !h-3 w-full !bg-border" />
					</div>
				</div>
			</div>
			<div />
		</div></Card
	>

	<Card class="mt-2 rounded-lg bg-background-alt px-2 pt-4 shadow-csm">
		<SkeletonRectangle class="mb-4 h-4 w-2/4 !bg-border" />
		<div class=" w-full border px-4 py-3">
			<div class=" flex items-center">
				<SkeletonCircle class=" h-4 w-4 " />
				<SkeletonRectangle class="ml-2 h-8 w-12 !bg-border" />
				<SkeletonRectangle class="ml-4 h-4 w-52 !bg-border" />
			</div>

			<div class=" mb-2 mt-6 flex flex-1 pl-4">
				<SkeletonRectangle class="ml-2 mr-4 h-8 w-12 !bg-border" />
				<div class=" flex-1">
					<SkeletonRectangle class="mb-2 h-4 w-2/4 !bg-border" />
					<SkeletonRectangle class="mb-2 !h-2 w-full !bg-border" />
					<SkeletonRectangle class="mb-2 !h-2 w-full !bg-border" />
				</div>
			</div>
			<SkeletonRectangle class="h-8 w-full !bg-border" />
		</div>
	</Card>
</SkeletonWrapper>
