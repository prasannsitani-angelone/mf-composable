<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import { SkeletonCircle } from 'svelte-components';

	export let numberOfSkeletons = 4;
</script>

<SkeletonWrapper
	class="flex w-full items-center {numberOfSkeletons > 1
		? 'justify-evenly bg-background-alt'
		: 'bg-transparent pl-3 shadow-csm'} rounded-lg"
>
	{#each Array(numberOfSkeletons) as _, i}
		<div class="my-3">
			<SkeletonCircle class="h-14 w-14" />
			<SkeletonRectangle class="mt-2 !h-2 w-14" />
		</div>
	{/each}
</SkeletonWrapper>
