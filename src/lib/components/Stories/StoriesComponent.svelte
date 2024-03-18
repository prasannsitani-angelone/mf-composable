<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import Modal from '$components/Modal.svelte';
	import { deviceStore } from '$lib/stores/DeviceStore';
	import type { Story, Video, videoQuery } from '$lib/types/IStories';
	import { getQueryParamsObj } from '$lib/utils/helpers/params';
	import { afterUpdate, onDestroy } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import {
		startSipClickAnalytics,
		closeStoryAnalytics,
		storySliderAnalytics,
		storyImpressionAnalytics,
		clickOnStoryAnalytics
	} from '$lib/analytics/stories/stories';
	import { modifiedGoto } from '$lib/utils/goto';
	import { goto } from '$app/navigation';
	import { appStore } from '$lib/stores/SparkStore';
	import type { VideoPlayerProps } from '$components/Video/interfaces';
	import { VideoPlayerMode } from '$components/Video/enums';
	import VideoPlayer from '$components/Video/Video.svelte';

	export let stories: Array<Story>;
	export let version: string;

	let os: string = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os || '';
	let isMobile = $page?.data?.deviceType?.isMobile;

	let showVideoSection = false;
	let showVideoPlayer = false;
	let selectedStory: Story | undefined;
	let selectedVideo: Video | undefined;
	let selectedStoryIndex = 0;
	let selectedVideoIndex = 0;
	let mutedPlayback = false;
	let isSwipeNotEnough = false;
	let queryParamsObj: videoQuery;
	let playVideoInterval: number;
	let videoProps: VideoPlayerProps;
	let touchStartX = 0;
	let touchEndX = 0;
	let touchStartY = 0;
	let touchEndY = 0;
	const swipeThresholdValue = 50;

	// $: if (showVideoSection && queryParamsObj?.storyPlayer !== 'true') {
	// 	setTimeout(() => {
	// 		crossButtonClicked(false);
	// 	});
	// }

	const setVideoPlayerQuery = () => {
		const currentPath = window?.location?.pathname;
		const redirectPath = `${currentPath}?storyPlayer=true`;

		goto(redirectPath);
	};

	const playStoryVideo = (
		story?: Story,
		playClicked = false,
		clickedIndex = 0,
		userClicked = false
	) => {
		if (browser && isMobile) {
			document?.addEventListener('touchstart', setStartTouchPoints);
			document?.addEventListener('touchend', setEndTouchPoints);
		}

		if (userClicked) {
			clickOnStoryAnalyticsFunc();
		}

		storyImpressionAnalyticsFunc();

		showVideoPlayer = false;

		setVideoPlayerQuery();

		setTimeout(() => {
			if (playClicked) {
				selectedStory = story;
				selectedVideo = selectedStory?.videos[0];

				selectedStoryIndex = clickedIndex;
				selectedVideoIndex = 0;
				setVideoProps();
			}

			showVideoSection = true;
			showVideoPlayer = true;
			isSwipeNotEnough = false;

			if (playVideoInterval) {
				clearInterval(playVideoInterval);
			}
		});
	};

	const setStoryVideo = (playNow = true) => {
		selectedStory = stories[selectedStoryIndex];
		selectedVideo = selectedStory?.videos[selectedVideoIndex];

		setVideoProps();

		storySliderAnalyticsFunc();

		if (playNow) {
			playStoryVideo();
		}
	};

	const crossButtonClicked = (routerBack = true) => {
		if (browser) {
			document?.removeEventListener('touchstart', setStartTouchPoints);
			document?.removeEventListener('touchend', setEndTouchPoints);
		}

		closeStoryAnalyticsFunc();

		setTimeout(() => {
			mutedPlayback = false;
			showVideoSection = false;
			showVideoPlayer = false;

			if (playVideoInterval) {
				clearInterval(playVideoInterval);
			}
		});

		if (routerBack) {
			history?.back();
		}
	};

	const setPreviousStory = () => {
		if (selectedStoryIndex - 1 >= 0) {
			selectedStoryIndex--;
			selectedVideoIndex = 0;

			setStoryVideo();
		} else {
			crossButtonClicked();
		}
	};

	const setNextStory = () => {
		if (stories?.length > selectedStoryIndex + 1) {
			selectedStoryIndex++;
			selectedVideoIndex = 0;

			setStoryVideo();
		} else {
			crossButtonClicked();
		}
	};

	const setNextVideo = () => {
		if (isSwipeNotEnough) {
			isSwipeNotEnough = false;
			return;
		}

		if (selectedStory?.videos?.length > selectedVideoIndex + 1) {
			selectedVideoIndex++;

			setStoryVideo();
		} else {
			setNextStory();
		}
	};

	const handleCtaClick = () => {
		ctaClickAnalyticsFunc();

		if (selectedStory?.ctaUrl?.length) {
			if ($appStore.isTabView) {
				crossButtonClicked();
			}
			modifiedGoto(`${base}${selectedStory?.ctaUrl}`, {
				replaceState: true
			});
		}
	};

	const toggleMute = () => {
		videoProps.muted = !videoProps.muted;
	};

	// toggle pause gesture POC (working fine and can be implemented for "press and hold gesture" (mousedown and mouseup events) on video)
	// (but not implementing because in webview/chrome "press and hold gesture" shows more options popup)

	// const togglePause = (event, pauseNow = false) => {
	//   event?.stopPropagation();
	//   event?.preventDefault();

	//   const video = document?.getElementById('videoPlayer');

	//   if (pauseNow) {
	//     video.pause();
	//   } else {
	//     video.play();
	//   }
	// }

	const determineGesture = () => {
		if (Math.abs(touchEndX - touchStartX) >= Math.abs(touchEndY - touchStartY)) {
			if (os === 'iOS' && $deviceStore.userAgent?.toLowerCase().includes('safari')) {
				// disable x-axis swipe gestures (left and right) for iOS Safari Mobile browser
				return;
			} else if (
				Math.abs(touchEndX - touchStartX) > 0 &&
				Math.abs(touchEndX - touchStartX) < swipeThresholdValue
			) {
				isSwipeNotEnough = os === 'iOS';

				return;
			}

			if (touchEndX > touchStartX) {
				setPreviousStory();
			} else if (touchEndX < touchStartX) {
				setNextStory();
			}
		} else {
			if (
				Math.abs(touchEndY - touchStartY) > 0 &&
				Math.abs(touchEndY - touchStartY) < swipeThresholdValue
			) {
				isSwipeNotEnough = os === 'iOS';

				return;
			}

			if (touchEndY < touchStartY) {
				handleCtaClick();
			} else if (touchEndY > touchStartY) {
				crossButtonClicked();
			}
		}
	};

	const setStartTouchPoints = (e) => {
		touchStartX = e?.changedTouches[0]?.screenX;
		touchStartY = e?.changedTouches[0]?.screenY;
	};

	const setEndTouchPoints = (e) => {
		touchEndX = e?.changedTouches[0]?.screenX;
		touchEndY = e?.changedTouches[0]?.screenY;
		determineGesture();
	};

	const clickOnStoryAnalyticsFunc = () => {
		const eventMetadata = {
			StoryIndex: stories[selectedStoryIndex]?.storyId,
			StoryTitle: stories[selectedStoryIndex]?.title,
			version
		};

		clickOnStoryAnalytics(eventMetadata);
	};

	const ctaClickAnalyticsFunc = () => {
		const eventMetadata = {
			StoryIndex: stories[selectedStoryIndex]?.storyId,
			StoryTitle: stories[selectedStoryIndex]?.title
		};

		startSipClickAnalytics(eventMetadata);
	};

	const closeStoryAnalyticsFunc = () => {
		const eventMetadata = {
			StoryIndex: stories[selectedStoryIndex]?.storyId,
			StoryTitle: stories[selectedStoryIndex]?.title
		};

		closeStoryAnalytics(eventMetadata);
	};

	const storySliderAnalyticsFunc = () => {
		const eventMetadata = {
			StoryIndex: stories[selectedStoryIndex]?.storyId,
			StoryTitle: stories[selectedStoryIndex]?.title
		};

		storySliderAnalytics(eventMetadata);
	};

	const storyImpressionAnalyticsFunc = () => {
		const eventMetadata = {
			StoryIndex: stories[selectedStoryIndex]?.storyId,
			StoryTitle: stories[selectedStoryIndex]?.title
		};

		storyImpressionAnalytics(eventMetadata);
	};

	const setVideoProps = () => {
		videoProps = {
			id: `video-${selectedStory?.storyId}`,
			src: selectedVideo?.videoUrl || '',
			controls: false,
			poster: selectedStory?.imageThumbnailUrl || '',
			onClick: setNextVideo,
			onVideoEnd: setNextVideo,
			playInLoop: false,
			showBottomDrawer: false,
			muted: mutedPlayback,
			source: selectedStory?.storyId,
			type: VideoPlayerMode.Normal,
			autoplay: true,
			hideMute: true,
			fallbackSrc: selectedVideo?.videoFallbackUrl
		};
	};

	afterUpdate(() => {
		queryParamsObj = getQueryParamsObj();
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('touchstart', setStartTouchPoints);
			document.removeEventListener('touchend', setEndTouchPoints);
		}
	});
</script>

<section
	class="scrollbar-hide mb-2 flex justify-start overflow-auto rounded-lg bg-background-alt px-4 py-3 shadow-csm md:mb-4 md:justify-center {$$props.class}"
>
	{#each stories as story, index (story?.storyId)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<article
			class="{index === stories.length - 1
				? ''
				: 'mr-8'} w-16 text-[10px] font-normal md:cursor-pointer"
			on:click={() => playStoryVideo(story, true, index, true)}
		>
			<img
				src={story?.smallThumbnailUrl}
				class="h-14 w-14 rounded-full border-[1.5px] border-primary object-cover p-[3.5px]"
				alt="story thumbnail"
				width="56"
				height="56"
			/>
			<p class="mt-1 w-14 truncate text-center text-body">
				{story?.title}
			</p>
		</article>
	{/each}

	{#if showVideoSection}
		<section class="light">
			<Modal
				isModalOpen={showVideoSection}
				closeModal={crossButtonClicked}
				on:backdropclicked={() => crossButtonClicked()}
			>
				<div class="top-0 flex h-full w-screen flex-col bg-title shadow-csm md:h-5/6 md:w-[360px]">
					<div class="relative h-full w-full">
						{#if showVideoPlayer}
							<!-- svelte-ignore a11y-media-has-caption -->
							<VideoPlayer props={videoProps} on:click={setNextVideo}>
								<div slot="header">
									<img
										src={selectedStory?.imageThumbnailUrl}
										class="absolute left-4 top-4 h-12 w-12 rounded-full object-cover text-lg font-normal text-background-alt shadow-csm"
										alt="video thumbnail"
										width="48"
										height="48"
									/>
									<button
										class="absolute right-0 top-5 pb-2 pl-2 pr-4 pt-3 md:cursor-pointer"
										style="z-index: 72"
										on:click={() => crossButtonClicked()}
									>
										<WMSIcon width={14} height={14} name="cross-close" />
									</button>
								</div>

								<div slot="footer">
									<section
										class="absolute bottom-0 flex h-1/6 w-full flex-col items-center justify-center bg-title"
										style="z-index: 72"
									>
										<button
											class="absolute right-0 top-[-50px] p-2 pr-3 md:cursor-pointer"
											on:click={toggleMute}
										>
											{#if !videoProps.muted}
												<WMSIcon width={24} height={24} name="audio-on" />
											{:else}
												<WMSIcon width={24} height={24} name="audio-off" />
											{/if}
										</button>
										{#if isMobile}
											<WMSIcon width={14} height={8} name="swipe-up" class="mb-3" />
										{/if}

										<Button
											class="h-auto !w-48 cursor-default rounded border !border-background-alt !bg-transparent !text-background-alt md:cursor-pointer"
											variant="outlined"
											onClick={handleCtaClick}
										>
											START SIP NOW
										</Button>
									</section>
								</div>
							</VideoPlayer>
						{/if}
					</div>
				</div>
			</Modal>
		</section>
	{/if}
</section>
