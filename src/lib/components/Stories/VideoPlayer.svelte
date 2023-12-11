<script lang="ts">
	import { base } from '$app/paths';
	import type { Story, Video } from '$lib/types/IStories';
	import logger from '$lib/utils/logger';
	import { onDestroy, onMount } from 'svelte';
	export let selectedVideo: Video | undefined;
	export let selectedStory: Story | undefined;

	export let hls;
	export let muted: boolean;
	let videoElm;

	onMount(() => {
		videoElm = document.getElementById('video');
		/* eslint-disable */
		if (window?.Hls?.isSupported()) {
			hls?.loadSource(`${base}${selectedVideo?.videoUrl}`);
			hls?.attachMedia(videoElm);
			videoElm?.play();

			/* eslint-enable */
		} else {
			try {
				var source = document.createElement('source');

				source.src = selectedVideo?.videoFallbackUrl;
				source.type = 'video/mp4';

				videoElm?.appendChild(source);
				videoElm?.play();
			} catch (e) {
				logger.error({
					type: 'Video Error',
					params: {
						message: 'Unable to Play video in fallback mode',
						error: e?.toString()
					}
				});
			}
		}
	});

	onDestroy(() => {
		hls?.detachMedia();
	});
</script>

<video
	id="video"
	poster={selectedStory?.imageThumbnailUrl}
	class="h-full w-full justify-center object-cover"
	autoplay
	playsinline
	height="auto"
	controlslist="nodownload"
	{muted}
	on:ended
	on:click
/>
