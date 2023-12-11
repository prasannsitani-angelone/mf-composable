<script lang="ts">
	import Icon1 from '$components/Tutorial/icons/WhatIsMFBbIcon.svelte';
	import { HEIGHT_OFFSET } from '$components/Tutorial/pages/const';

	let options = [
		'Mutual funds are one of the safest and most effective way for most investors to grow their wealth',
		'With mutual funds, expert money managers research the market and invest your money'
	];

	let youtubeLink = `https://www.youtube.com/embed/25pXb6WDlF4?enablejsapi=1&version=3&playerapiid=ytplayer`;
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
</script>

<div bind:clientHeight class="h-screen bg-[#a4afed] px-8 py-5 {$$props.class}">
	<p class="mb-5 mt-10 text-2xl font-medium text-black-key">What are Mutual Funds?</p>
	{#if clientHeight > HEIGHT_OFFSET}
		<Icon1 class="mx-auto mb-5" />
	{/if}
	<ul class="mb-10 ml-3">
		{#each options as option}
			<li class="mb-2 list-disc text-sm font-normal leading-6 text-black-key">
				{option}
			</li>
		{/each}
	</ul>

	<p class="mb-5 text-sm font-normal text-black-key">
		Watch this <span class="font-medium">2-minute video</span> to learn more
	</p>

	<iframe
		allowfullscreen={true}
		title="What are Mutual Funds?"
		class="youtube-video mb-5 h-48 w-full rounded-lg"
		src={youtubeLink}
	/>

	<p class="mx-auto w-fit text-sm font-normal text-black-key">
		Zero Commissions &#x25CF; Zero Fees
	</p>
</div>
