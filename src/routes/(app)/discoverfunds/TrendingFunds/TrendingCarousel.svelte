<script lang="ts">
	import AddToFavourites from '$components/AddToFavourites.svelte';
	import Carousel from '$components/Carousel.svelte';
	import SchemeCard from '$components/SchemeCard.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { SwiperSlide } from 'swiper/svelte';

	let tableData: Array<WeeklyTopSchemesEntity>;

	let carouselInActive = false;

	const favoriteToggled = (e: {
		detail: {
			enabled: boolean;
		};
	}) => {
		carouselInActive = e.detail.enabled;
	};

	export { tableData };
</script>

<section class="sm:hidden {carouselInActive ? 'carousel-inactive' : 'carousel-active'}">
	<Carousel>
		{#each tableData || [] as schemes}
			<SwiperSlide class="pt-10 pb-1">
				<div class="flex flex-col items-center px-6 lg:flex-row">
					<article class="relative ml-3 flex h-full items-center rounded-lg border p-5">
						<SchemeLogo
							src={schemes?.logoUrl}
							alt={schemes?.schemeName}
							class=" border-line-grey  absolute top-0  left-0 translate-x-1/2 -translate-y-1/2 justify-center bg-white"
						/>
						<AddToFavourites
							class="absolute right-0 top-2"
							isin={schemes?.isin}
							schemeCode={schemes?.schemeCode}
							isFavourite={schemes?.isFavourite}
							on:toggle-initiated={favoriteToggled}
						/>
						<div class="w-2/3 pt-5">
							<SchemeCard {schemes} showLogo={false} />
						</div>
						<div class="flex w-1/3 flex-col items-end">
							<div class="text-xs font-medium text-grey-body">3Y Return</div>
							<div class="text-lg font-medium text-black-title">{schemes?.returns3yr}%</div>
						</div>
					</article>
				</div>
			</SwiperSlide>
		{/each}
	</Carousel>
</section>

<style>
	.carousel-inactive :global(.swiper-wrapper) {
		transform: none !important;
	}
	.carousel-inactive :global(.swiper-slide.swiper-slide-active) {
		transform: none !important;
	}
	.carousel-inactive {
		position: relative;
		z-index: 70;
	}
</style>
