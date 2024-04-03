<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	import { debounce } from '$lib/utils/helpers/debounce';
	import logger from '$lib/utils/logger';

	import type { VideoPlayerProps } from './interfaces';

	import { isHlsSupported, loadHlsPlayer } from './utils';
	import { VideoPlayerMode } from './enums';
	import { VIDEO_AUTOPLAY_THRESHOLD } from './constants';
	import type { VideoAnalyticsCallbacks } from '$lib/analytics/video';
	import { writable } from 'svelte/store';
	import { appStore } from '$lib/stores/SparkStore';
	import {
		addNativeLifeCycleCallback,
		removeNativeLifeCycleCallback
	} from '$lib/utils/nativeLifeCycleCallbacks';

	let isVisible = false;
	let intersectionObserver: IntersectionObserver | null = null;
	let videoElement: HTMLVideoElement | null = null;
	let progressBarPercentage = 0;
	let initialY = 0;
	let mouseButtonPressed = false;
	let initialHeight = 22;
	let maxHeight = 50;
	let isMuted = writable(true);
	let hls;
	let hlsContext;

	const dispatch = createEventDispatcher();

	export let props: VideoPlayerProps;
	export let analyticsCallbacks: VideoAnalyticsCallbacks;

	$: {
		isMuted.set(props.muted || true);
		handleToggleMute();
	}

	const onTimeUpdate = (e: Event) => {
		if (e.target instanceof HTMLVideoElement) {
			const video = e.target as HTMLVideoElement;
			if (video.duration) {
				progressBarPercentage = Math.round((e.target.currentTime / e.target.duration) * 100);
			}
		}
	};

	const onVideoEnded = () => {
		if (props?.playInLoop) {
			if (videoElement) {
				videoElement.currentTime = 0;
				videoElement.play();
			}
		} else {
			if (props?.onVideoEnd) {
				props.onVideoEnd();
			}
		}
	};

	const handleIntersectionError = (e: Error) => {
		logger.error({
			type: 'Video Error',
			params: {
				message: 'Unable to Play video in fallback mode',
				error: e?.toString()
			}
		});
	};

	const handleIntersection = debounce((entries: IntersectionObserverEntry[]) => {
		const entry = entries[0];

		if (
			entry.isIntersecting &&
			entry.intersectionRatio >= (props?.threshold ? props?.threshold : VIDEO_AUTOPLAY_THRESHOLD)
		) {
			if (!isVisible) {
				videoElement?.play();
				isVisible = true;
				dispatch('play');
				props?.onPlay?.();
				analyticsCallbacks?.videoImpression?.();
			}
		} else {
			if (isVisible) {
				videoElement?.pause();
				isVisible = false;
				dispatch('pause');
				props?.onPause?.();
			}
		}
	});

	const handleToggleMute = () => {
		if (videoElement) {
			isMuted.update((currentValue) => !currentValue);
			videoElement.muted = $isMuted;
			analyticsCallbacks?.muteUnmute?.({
				version: 'B',
				VideoTitle: props.header,
				mute: $isMuted ? 'Yes' : 'No'
			});
		}
	};

	const handleDragMove = (clientY: number) => {
		const deltaY = clientY - initialY;
		const element = document.getElementById(`footer-${props?.source}`);
		const parentElement = document.getElementById(`container-${props?.source}`);

		dispatch('drawer-max-height', false);

		if (element && parentElement) {
			// Set the height based on the drag distance
			const newHeight = element.clientHeight - deltaY;
			const bottomDrawerHeight = document.getElementById('bottom-drawer')?.clientHeight || 0;

			if (newHeight >= bottomDrawerHeight - 10) {
				dispatch('drawer-max-height', true);
				analyticsCallbacks?.bottomDrawerDrag?.({
					version: 'B',
					VideoTitle: props.header
				});
				return;
			}
			maxHeight = bottomDrawerHeight;
			const heightPercentage = (newHeight / parentElement.clientHeight) * 100;
			if (heightPercentage <= maxHeight && heightPercentage >= initialHeight) {
				element.style.height = heightPercentage + '%';
			}
		}
	};

	const handleDragEnd = () => {
		mouseButtonPressed = false;
		const parentElement = document.getElementById(`container-${props?.source}`);
		const element = document.getElementById(`footer-${props?.source}`);

		if (element && parentElement) {
			const heightPercentage = (element.clientHeight / parentElement.clientHeight) * 100;
			const bottomDrawerHeight = document.getElementById('bottom-drawer')?.clientHeight || 0;
			maxHeight = (bottomDrawerHeight / parentElement.clientHeight) * 100;
			if (heightPercentage >= (maxHeight + initialHeight) / 2) {
				return;
			} else {
				element.style.height = `${initialHeight}%`;
			}
		}
	};

	const handleTouchMove = (event: TouchEvent) => {
		handleDragMove(event.targetTouches[0].clientY);
		initialY = event.targetTouches[0].clientY;
	};

	const handleTouchStart = (event: TouchEvent) => {
		initialY = event.targetTouches[0].clientY;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!mouseButtonPressed || event.buttons !== 1) {
			return;
		}
		event.preventDefault();
		handleDragMove(event.clientY);
		initialY = event.clientY;
	};

	const handleMouseStart = (event: MouseEvent) => {
		mouseButtonPressed = true;
		initialY = event.clientY;
		const element = document.getElementById(`footer-${props?.source}`);
		if (element) {
			element.style.cursor = 'grabbing';
		}
	};

	const pauseInactiveVideos = () => {
		const videoNodes = document.querySelectorAll('video');
		Array.from(videoNodes).forEach((node) => {
			if (node.getAttribute('id') !== `video-${props?.source}`) {
				node.pause();
			}
		});
	};

	const loadFallbackVideo = () => {
		try {
			const source = document.createElement('source');

			source.src = props?.fallbackSrc;
			source.type = 'video/mp4';

			videoElement?.appendChild(source);
			videoElement?.play();
		} catch (e) {
			logger.error({
				type: 'Video Error',
				params: {
					message: 'Unable to play video in fallback mode. HLS is not supported.',
					error: e?.toString()
				}
			});
		}
	};

	const playVideoOnFocus = () => {
		if (intersectionObserver && videoElement) {
			intersectionObserver.observe(videoElement);
		}
		if (props.fullScreen || isVisible) {
			videoElement?.play();
		}
	};

	const pauseVideoOnBlur = () => {
		if (intersectionObserver && videoElement) {
			intersectionObserver.unobserve(videoElement);
		}
		videoElement?.pause();
	};

	const initiateVideoPlayback = (hls, hlsContext) => {
		if (!videoElement) return;

		if (props.src.endsWith('.m3u8')) {
			if (isHlsSupported(hlsContext)) {
				const source = document.createElement('source');
				source.src = props?.src || '';
				source.type = 'application/x-mpegURL';
				videoElement.appendChild(source);
				hls?.loadSource(props.src);
				hls?.attachMedia(videoElement);
			} else {
				loadFallbackVideo();
			}
		} else {
			videoElement.src = props.src;
		}
	};

	onMount(async () => {
		pauseInactiveVideos();
		videoElement = document.getElementById(`video-${props?.source}`) as HTMLVideoElement | null;
		const hlsResponse = await loadHlsPlayer();

		if (hlsResponse) {
			hls = hlsResponse.hls;
			hlsContext = hlsResponse.hlsContext;
			initiateVideoPlayback(hls, hlsContext);

			if (!props?.autoplay) {
				if (props?.type === VideoPlayerMode.Normal && props?.threshold) {
					try {
						const options = { threshold: props?.threshold };
						intersectionObserver = new IntersectionObserver(handleIntersection, options);
						if (videoElement) {
							intersectionObserver.observe(videoElement);
						}
					} catch (error) {
						handleIntersectionError(error);
					}
				}
			} else {
				videoElement?.play();
				handleToggleMute();
			}
		}

		if (appStore.isTabview()) {
			addNativeLifeCycleCallback('PAUSE', pauseVideoOnBlur);
			addNativeLifeCycleCallback('RESUME', playVideoOnFocus);
		} else {
			window.addEventListener('blur', pauseVideoOnBlur);
			window.addEventListener('focus', playVideoOnFocus);
		}

		dispatch('mounted');
	});

	onDestroy(() => {
		if (intersectionObserver) {
			intersectionObserver.disconnect();
		}

		hls?.detachMedia();

		videoElement = null;
		hls = null;
		hlsContext = null;

		window.removeEventListener('blur', pauseVideoOnBlur);
		window.removeEventListener('focus', playVideoOnFocus);

		removeNativeLifeCycleCallback('PAUSE', pauseVideoOnBlur);
		removeNativeLifeCycleCallback('RESUME', playVideoOnFocus);
	});
</script>

<div
	id={`container-${props?.source}`}
	class="relative h-full overflow-hidden {props?.fullScreen ? 'fullScreen-mode' : ''}"
>
	{#if props?.type === VideoPlayerMode.Normal}
		<slot name="header" />
	{/if}
	{#if props?.type === VideoPlayerMode.ProgressBarOverlay}
		<div
			class="absolute left-0 right-0 top-0 bg-gradient-to-b from-gray-900 to-transparent px-4 py-3"
		>
			<div class="h-1 rounded-lg bg-grey-body">
				<div
					id="progressBar"
					class="transition-width h-full rounded-lg bg-white ease-linear"
					style={`width: ${progressBarPercentage}%;`}
				/>
			</div>
			<div class="mt-3 flex flex-row items-center">
				<button class="z-60 pb-2 pl-2 pr-2 pt-2 md:cursor-pointer" on:click={props?.onClose}>
					<WMSIcon width={14} height={14} name="cross-close" stroke="#fff" />
				</button>
				<div class="ml-4 text-sm text-white">{props?.header}</div>
			</div>
		</div>
	{/if}
	{#if !props?.controls}
		{#if !props?.hideMute}
			<div
				class="absolute top-{props?.type === VideoPlayerMode.Normal ? 0 : 4} right-0 mr-4 mt-4"
				style="z-index: 2"
				on:click={handleToggleMute}
				role="button"
				aria-label="mute"
				tabindex="-1"
				on:keypress={handleToggleMute}
			>
				{#if $isMuted}
					<WMSIcon name="mute" width={16} height={16} />
				{:else}
					<WMSIcon name="unmute" width={16} height={16} />
				{/if}
			</div>
		{/if}
	{/if}
	{#if props?.showBottomDrawer}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<section
			id={`footer-${props?.source}`}
			style={`height: ${initialHeight}%;`}
			class={`absolute bottom-0 left-0 right-0 z-60 overflow-visible`}
			on:mousedown|capture|stopPropagation={handleMouseStart}
			on:mousemove|capture|stopPropagation={handleMouseMove}
			on:mouseup|capture|stopPropagation={handleDragEnd}
			on:touchstart|capture|stopPropagation={handleTouchStart}
			on:touchmove|capture|stopPropagation={handleTouchMove}
			on:touchend|capture|stopPropagation={handleDragEnd}
		>
			<div id="bottom-drawer">
				<slot name="bottom-drawer-content" />
			</div>
		</section>
	{/if}
	<video
		id={`video-${props?.source}`}
		class="h-full w-full cursor-pointer justify-center object-cover {$$props.classes || ''}"
		playsinline
		controlslist="nodownload"
		poster={props?.poster}
		muted={props?.muted}
		controls={props?.controls}
		on:ended={onVideoEnded}
		on:click={props?.onClick}
		on:timeupdate={onTimeUpdate}
	/>
	{#if props?.type === VideoPlayerMode.Normal}
		<slot name="footer" />
	{/if}
</div>

<style>
	.video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.fullScreen-mode {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		z-index: 71;
		border-radius: 0;
	}
</style>
