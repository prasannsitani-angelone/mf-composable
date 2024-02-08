<script>
	import { onMount } from 'svelte';

	export let bannerText = '';
	export let AnimatedLottie = '';

	let LottiePlayer;

	onMount(async () => {
		const module = await import('@lottiefiles/svelte-lottie-player');
		LottiePlayer = module.LottiePlayer;
	});

	let controlsLayout = [
		'previousFrame',
		'playpause',
		'stop',
		'nextFrame',
		'progress',
		'frame',
		'spacer',
		'background',
		'snapshot',
		'zoom',
		'info'
	];
</script>

{#if LottiePlayer}
	<section
		class="flex h-screen w-full flex-col items-center justify-center bg-background-alt md:h-[calc(100vh-148px)] {$$props?.class}"
	>
		<LottiePlayer
			src={AnimatedLottie}
			autoplay={true}
			loop={false}
			controls={false}
			renderer="svg"
			background="transparent"
			height={100}
			width={100}
			{controlsLayout}
		/>
		<div id="banner" class="fade-in-text mt-3 text-lg font-medium text-title">{bannerText}</div>
	</section>
{/if}

<style>
	.fade-in-text {
		animation: fadeIn 5s;
		-webkit-animation: fadeIn 5s;
		-moz-animation: fadeIn 5s;
		-o-animation: fadeIn 5s;
		-ms-animation: fadeIn 5s;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@-moz-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@-o-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@-ms-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
