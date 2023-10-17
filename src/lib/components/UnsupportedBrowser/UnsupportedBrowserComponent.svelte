<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import type { BrowserSupport } from '$lib/utils/helpers/browserSupport.js';
	import { Button } from 'svelte-components';
	import Overlay from '$components/Overlay.svelte';
	import { onMount } from 'svelte';
	import Logger from '$lib/utils/logger';

	export let browserDetails: BrowserSupport;

	export function openBrowserDownloadUrl() {
		let os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;

		const browserDownloadUrl = {
			chrome: 'https://www.google.com/intl/en_in/chrome/',
			firefox: 'https://www.mozilla.org/en-US/firefox/new/'
		};

		if (os === 'Android') {
			window.open('https://play.google.com/store/apps', '_blank');
		} else if (os === 'iOS') {
			window.open('https://www.apple.com/in/app-store/', '_blank');
		} else {
			window.open(
				browserDownloadUrl[browserDetails.browser] || browserDownloadUrl.chrome,
				'_blank'
			);
		}
	}

	onMount(() => {
		Logger.info({
			type: 'UnsupportedBrowser',
			params: { ...browserDetails, userAgent: navigator.userAgent }
		});
	});
</script>

<Overlay containerClass="justify-end sm:!justify-center">
	<article
		class="flex flex-col items-center justify-center rounded-t-lg bg-white p-4 sm:w-160 sm:rounded-lg sm:p-16"
	>
		<img
			src={`${base}/images/unsupported-browser.png`}
			title="Browser not supported"
			width="173"
			height="107"
			class="mb-11 sm:h-40 sm:w-64"
			alt="browser not supported"
		/>
		<h4 class="mb-3 text-xl font-normal text-black-title">
			Update <span class="capitalize">{browserDetails.alias || browserDetails.browser}</span>
		</h4>
		<div class="mb-3 text-sm text-grey-body">
			{#if browserDetails.fallback}
				<div class="text-center">
					This version of <span class="capitalize"
						>{browserDetails.alias || browserDetails.browser}</span
					>
					is not supported. Update your browser & refresh the page to continue with Mutual Funds.
				</div>
			{:else}
				<div>
					<span class="capitalize">{browserDetails.alias || browserDetails.browser}</span> is not supported.
					Please download Chrome browser to continue with Mutual Funds.
				</div>
			{/if}
		</div>
		<Button class="h-12 w-full uppercase" on:click={() => openBrowserDownloadUrl()}>
			{#if browserDetails.fallback}
				<span> Update Browser</span>
			{:else}
				<span>Download Chrome</span>
			{/if}
		</Button>
	</article>
</Overlay>
