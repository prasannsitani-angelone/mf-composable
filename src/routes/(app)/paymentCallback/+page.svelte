<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';

	const params = $page.url.searchParams;
	if (browser) {
		window.opener?.postMessage(
			{
				source: 'paymentCallback',
				...params
			},
			location.origin
		);
	}
</script>

<div class="flex h-screen flex-col items-center justify-center text-center text-lg">
	<LoadingIndicator svgClass="!w-16 !h-16" />
</div>
