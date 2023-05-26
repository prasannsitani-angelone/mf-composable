<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { SEO } from 'wms-ui-component';

	if (browser) {
		const params = $page.url.searchParams;
		window.opener?.postMessage(
			{
				...Object.fromEntries(params),
				source: 'emandateCallback'
			},
			location.origin
		);
		window.opener?.focus();
	}
</script>

<div class="flex h-screen flex-col items-center justify-center text-center text-lg">
	<SEO seoTitle="Loading... | Angel One" seoDescription="Loading Page" />
	<LoadingIndicator svgClass="!w-16 !h-16" />
</div>
