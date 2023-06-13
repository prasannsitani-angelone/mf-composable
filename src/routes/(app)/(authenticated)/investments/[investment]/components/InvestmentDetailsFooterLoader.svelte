<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';

	export let isSchemeDetailsPage = false;
</script>

{#if isSchemeDetailsPage}
	<SkeletonWrapper class="flex w-full items-center justify-around">
		<SkeletonRectangle class="!h-12 w-full rounded" />
	</SkeletonWrapper>
{:else}
	<SkeletonWrapper class="flex w-full items-center justify-around">
		<SkeletonRectangle class="!h-12 w-32 rounded" />
		<SkeletonRectangle class="!h-12 w-32 rounded" />
		<SkeletonRectangle class="!h-12 w-[52px] rounded" />
	</SkeletonWrapper>
{/if}
