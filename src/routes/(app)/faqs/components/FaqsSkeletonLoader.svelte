<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
</script>

<section class="mt-2 flex flex-col-reverse justify-between md:flex-row">
	<SkeletonRectangle class="mt-2 h-96 w-full rounded-lg md:mt-0 md:w-[66%]" />
	<SkeletonRectangle class="h-80 w-full rounded-lg md:ml-6 md:w-[34%]" />
</section>
