<script lang="ts">
	import { base } from '$app/paths';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';

	const carouselItems = [
		{
			imageSrc: `${base}/images/clock.png`,
			heading: 'Start trading in one hour',
			subHeading: 'Trade hassle-free in Stocks, Futures & Options and Currencies of NSE, BSE & MCX'
		},
		{
			imageSrc: `${base}/images/thumbsup.png`,
			heading: 'Expert in stock recommendation',
			subHeading: 'Trade hassle-free in Stocks, Futures & Options and Currencies of NSE, BSE & MCX'
		},
		{
			imageSrc: `${base}/images/percentage.png`,
			heading: 'Start trading in one hour',
			subHeading: 'Trade hassle-free in Stocks, Futures & Options and Currencies of NSE, BSE & MCX'
		}
	];
</script>

<div class="flex flex-col items-center px-4 pt-8 pb-2 md:w-1/2 md:justify-center md:py-14">
	<img src={`${base}/images/AngelOneLogo.webp`} class="mb-6 w-36 md:mb-14" alt="Angelone logo" />
	<CarouselNative autoplay={true} carouselClass="w-full">
		{#each carouselItems as item, index (index)}
			<CarouselItem {index} class="mb-2 flex flex-col items-center">
				<img
					src={item.imageSrc}
					class="m-auto mb-12 flex flex-row justify-center md:mb-36"
					alt={item.heading}
				/>
				<div class="flex w-11/12 flex-col text-center">
					<div class="mb-2 text-xl font-semibold text-black-title">
						{item.heading}
					</div>
					<div class="text-sm text-grey-body">
						{item.subHeading}
					</div>
				</div>
			</CarouselItem>
		{/each}
	</CarouselNative>
</div>
