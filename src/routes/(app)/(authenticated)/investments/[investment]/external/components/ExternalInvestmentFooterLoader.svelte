<script>
	import { SkeletonRectangle, SkeletonWrapper } from 'svelte-components';
</script>

<SkeletonWrapper>
	<div class="mb-2 flex flex-1 flex-col rounded-lg bg-white p-3">
		<SkeletonRectangle class="mb-2 !h-12 w-full" />
		<div class=" rounded-lg bg-white">
			<SkeletonRectangle class="!h-3 " />
		</div>
	</div>
</SkeletonWrapper>
