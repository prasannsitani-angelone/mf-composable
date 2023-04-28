<script>
	import SkeletonRectangle from '$components/Skeleton/SkeletonRectangle.svelte';
	import SkeletonWrapper from '$components/Skeleton/SkeletonWrapper.svelte';
	// import {page} from "$app/store"
	let discoverPage = false;
	// const isMobile = $page.data.deviceType
	export { discoverPage };
</script>

<SkeletonWrapper>
	<SkeletonRectangle class={`mb-2 w-full rounded-lg ${discoverPage ? '!h-24' : '!h-64'}`} />
</SkeletonWrapper>
