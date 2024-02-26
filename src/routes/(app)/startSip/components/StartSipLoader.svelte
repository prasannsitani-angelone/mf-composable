<script>
	import { page } from '$app/stores';
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';

	$: isMobile = $page?.data?.deviceType?.isMobile;
</script>

<SkeletonWrapper>
	<div>
		{#if !isMobile}
			<SkeletonRectangle class="mb-2 !h-12 w-40 rounded-lg" />
		{/if}
		<section class="grid grid-cols-1 gap-3 md:grid-cols-2">
			{#each { length: 5 } as _}
				<SkeletonRectangle class="!h-32 w-full rounded-lg p-3" />
			{/each}
		</section>
	</div>
</SkeletonWrapper>
