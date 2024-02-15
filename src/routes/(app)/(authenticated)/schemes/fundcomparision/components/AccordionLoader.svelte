<script>
	import { SkeletonWrapper, SkeletonRectangle } from 'svelte-components';
</script>

<section class="w-full">
	<SkeletonWrapper class="w-full">
		<div class="mb-2 !h-full w-full rounded-lg bg-background-alt">
			<div class="flex w-full flex-col items-stretch bg-background-alt py-4">
				<SkeletonRectangle class="mx-4 mb-2 !h-6 rounded-lg !bg-border" />
				<SkeletonRectangle class="mx-4 mb-2 !h-6 rounded-lg !bg-border" />
				<SkeletonRectangle class="mx-4 mb-1 !h-80 rounded-lg !bg-border" />
			</div>
		</div>
	</SkeletonWrapper>
</section>
