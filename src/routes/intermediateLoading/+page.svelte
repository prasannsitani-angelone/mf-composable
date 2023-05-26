<script>
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { SEO } from 'wms-ui-component';
</script>

<div class="flex h-screen flex-col items-center justify-center text-center text-lg">
	<SEO seoTitle="Loading... | Angel One" seoDescription="Loading Page" />
	<LoadingIndicator svgClass="!w-16 !h-16" />
</div>
