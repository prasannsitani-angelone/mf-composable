<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	import SipCardLoader from './SipCardLoader.svelte';
</script>

<SkeletonWrapper>
	<SkeletonRectangle class="mb-2 mt-2 !h-[5.5rem] w-full rounded-lg" />
	<SipCardLoader />
</SkeletonWrapper>
