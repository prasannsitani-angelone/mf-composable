<script>
	import { SkeletonWrapper, SkeletonRectangle } from 'svelte-components';
</script>

<section class="w-full">
	<SkeletonWrapper class="w-full">
		<div class="mb-4 !h-full w-full rounded-lg bg-background-alt">
			<div class="flex w-full flex-col items-stretch bg-background-alt">
				<SkeletonRectangle class="mb-1 !h-14 rounded-lg" />
				<SkeletonRectangle class="mb-1 !h-14 rounded-lg" />
				<SkeletonRectangle class="!h-14 rounded-lg" />
			</div>
		</div>
	</SkeletonWrapper>
</section>
