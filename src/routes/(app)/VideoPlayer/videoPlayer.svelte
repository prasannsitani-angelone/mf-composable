<script lang="ts">
	import Video from '$components/Video/Video.svelte';
	import { VIDEO_AUTOPLAY_THRESHOLD } from '$components/Video/constants';
	import { VideoPlayerMode, VideoPlayerRenderView } from '$components/Video/enums';
	import type { VideoPlayerProps } from '$components/Video/interfaces';
	import { createEventDispatcher, onMount } from 'svelte';
	import BottomDrawer from './bottomDrawer.svelte';
	import { WMSIcon } from 'svelte-components';
	import { page } from '$app/stores';
	import {
		handleCrossButtonAnalytics,
		handleFundSelectAnalytics,
		handleMuteUnMuteAnalytics,
		handleVideoCardClickAnalytics,
		handleVideoImpressionEvent,
		handleFundSliderAnalytics,
		type VideoAnalyticsCallbacks
	} from '$lib/analytics/video';
	import { slide } from 'svelte/transition';
	import { notifyPopupWindowChange } from '$lib/utils/callNativeMethod';
	import { registerNativeClosePopUpWindowCallback } from '$lib/utils/nativeCallbacks';

	export let videoData;
	export let source: VideoPlayerRenderView;

	let props: VideoPlayerProps;
	let isDrawerMaxHeight: boolean;

	let analyticsCallbacks: VideoAnalyticsCallbacks = {
		videoImpression: handleVideoImpressionEvent,
		muteUnmute: handleMuteUnMuteAnalytics,
		bottomDrawerItemClick: handleFundSelectAnalytics,
		bottomDrawerDrag: handleFundSliderAnalytics
	};

	$: deviceType = $page.data.deviceType;

	const dispatch = createEventDispatcher();

	const handleVideoClick = () => {
		if (deviceType.isBrowser) {
			dispatch('reel-click', true);
			if (props.source === VideoPlayerRenderView.Modal) {
				props.autoplay = true;
			}
		} else {
			notifyPopupWindowChange({ isOpen: true, showAsFullScreen: true });
			handleDeviceBackClick();
			props.fullScreen = true;
			props.showBottomDrawer = true;
			props.type = VideoPlayerMode.ProgressBarOverlay;
		}
		analyticsCallbacks?.videoImpression?.(false, {
			version: 'B',
			VideoTitle: props.header
		});
		handleVideoCardClickAnalytics({
			version: 'B',
			VideoTitle: props.header
		});
	};

	const handleVideoClose = () => {
		notifyPopupWindowChange({ isOpen: false });
		if (deviceType.isBrowser) {
			dispatch('reel-click', false);
			playAllVideos();
		} else {
			props.type = VideoPlayerMode.Normal;
			props.fullScreen = false;
			props.showBottomDrawer = false;
		}
		handleCrossButtonAnalytics({
			version: 'B',
			VideoTitle: props.header
		});
	};

	const playAllVideos = () => {
		const videoNodes = document.querySelectorAll('video');
		Array.from(videoNodes).forEach((node) => node.play());
	};

	const { packVideoUrl, packLogoUrl, packName, schemes, description } = videoData;

	const setVideoProps = () => {
		props = {
			id: `video-${source}`,
			src: packVideoUrl,
			controls: false,
			poster: packLogoUrl,
			type:
				source === VideoPlayerRenderView.Modal
					? VideoPlayerMode.ProgressBarOverlay
					: VideoPlayerMode.Normal,
			threshold: VIDEO_AUTOPLAY_THRESHOLD,
			fullScreen: false,
			onClose: handleVideoClose,
			onClick: handleVideoClick,
			header: packName,
			footer: description,
			playInLoop: true,
			autoplay: source === VideoPlayerRenderView.Modal,
			showBottomDrawer: source === VideoPlayerRenderView.Modal,
			muted: true,
			source
		};
	};

	const handleDrawerMaxHeight = (e) => {
		isDrawerMaxHeight = e.detail;
	};

	onMount(() => {
		setVideoProps();
	});

	let videoContainerHeight = source === VideoPlayerRenderView.Modal ? 760 : 440;

	const handleDeviceBackClick = () => {
		registerNativeClosePopUpWindowCallback(() => {
			if (props?.type === VideoPlayerMode.ProgressBarOverlay) {
				handleVideoClose();
			}
		});
	};
</script>

{#if props}
	<div
		class="slide-down md:w-[360px]"
		style="height: {videoContainerHeight}px"
		in:slide={{ duration: 300 }}
	>
		<Video
			on:mounted={handleDeviceBackClick}
			{props}
			{analyticsCallbacks}
			on:drawer-max-height={handleDrawerMaxHeight}
			classes={props?.type === VideoPlayerMode.Normal ? 'rounded-md' : ''}
		>
			<div slot="header">
				<div class="z-1 absolute top-0 !h-24 h-24 w-full rounded-lg p-3">
					<div
						class="z-1 absolute left-0 top-0 !h-24 h-24 w-full rounded-[6px] bg-gradient-to-b from-gray-900 to-transparent p-3"
					>
						<h1 class="text-white">{props?.header}</h1>
					</div>
				</div>
			</div>

			<div slot="bottom-drawer-content">
				<div class="h-full overflow-hidden rounded-t-xl bg-background-alt p-4">
					<BottomDrawer
						{schemes}
						{analyticsCallbacks}
						videoTitle={props?.header || ''}
						videoDescription={props.footer || ''}
						{isDrawerMaxHeight}
					/>
				</div>
			</div>

			<div slot="footer">
				<div class="z-1 video-footer-container absolute bottom-0 w-full rounded-[6px] p-4">
					<div class="flex flex-row justify-between">
						<h2 class="text-[14px] text-white">{props?.footer}</h2>
						<div class="flex gap-1">
							{#each schemes as scheme}
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div
									class="flex h-6 w-6 cursor-pointer rounded-full bg-white"
									on:click={handleVideoClick}
									on:keypress={handleVideoClick}
								>
									<img class="h-full w-full p-0.5" src={scheme.logoUrl} alt={scheme.isin} />
								</div>
							{/each}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<WMSIcon
								on:click={handleVideoClick}
								on:keypress={handleVideoClick}
								name="arrow-collapse"
								width={24}
								height={24}
								stroke="white"
								class="rotate-90 cursor-pointer p-1 text-white"
							/>
						</div>
					</div>
				</div>
			</div>
		</Video>
	</div>
{/if}

<style>
	.video-footer-container {
		background: linear-gradient(180deg, rgba(84, 68, 68, 0) 8.09%, #1d1313 100%);
	}
</style>
