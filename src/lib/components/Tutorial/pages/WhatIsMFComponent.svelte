<script lang="ts">
	import Icon1 from '$components/Tutorial/icons/WhatIsMFBbIcon.svelte';
	import { HEIGHT_OFFSET } from '$components/Tutorial/pages/const';
	import { appStore } from '$lib/stores/SparkStore';

	let options = [
		'Mutual funds are one of the safest and most effective way for most investors to grow their wealth',
		'With mutual funds, expert money managers research the market and invest your money'
	];

	let clientHeight = 0;

	const pauseVideo = () => {
		var youtubeVideo = document.querySelector('.youtube-video');
		if (youtubeVideo && youtubeVideo.contentWindow) {
			youtubeVideo.contentWindow.postMessage(
				'{"event":"command","func":"pauseVideo","args":""}',
				'*'
			);
		}
	};

	export const onRemoved = () => {
		pauseVideo();
	};

	export const onSelected = () => {
		// no-op
	};

	const getYoutubeUrl = () => {
		let url =
			'https://www.youtube.com/embed/25pXb6WDlF4?enablejsapi=1&version=3&playerapiid=ytplayer';
		if (
			(appStore.isSparkAndroidUser() || appStore.isAngelBeeAndroidUser()) &&
			appStore.isWebView()
		) {
			url += '&fs=0';
		}
		return url;
	};

	let youtubeLink = getYoutubeUrl();
</script>

<div bind:clientHeight class="h-screen bg-[#a4afed] p-5 {$$props.class}">
	<p class="mb-3 mt-10 text-2xl font-medium text-black-key">What are Mutual Funds?</p>
	{#if clientHeight > HEIGHT_OFFSET}
		<Icon1 class="mx-auto mb-3" />
	{/if}
	<ul class="mb-4 ml-3">
		{#each options as option}
			<li class="mb-2 list-disc text-sm font-normal leading-6 text-black-key">
				{option}
			</li>
		{/each}
	</ul>

	<p class="mb-3 text-sm font-normal text-black-key">
		Watch this <span class="font-medium">2-minute video</span> to learn more
	</p>

	<iframe
		allowfullscreen={true}
		title="What are Mutual Funds?"
		class="youtube-video mb-3 h-48 w-full rounded-lg"
		src={youtubeLink}
	/>

	<p class="mx-auto w-fit text-sm font-normal text-black-key">
		Zero Commissions &#x25CF; Zero Fees
	</p>
</div>
