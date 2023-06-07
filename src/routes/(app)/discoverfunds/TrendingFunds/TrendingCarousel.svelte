<script lang="ts">
	import Carousel from '$components/Carousel.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { SwiperSlide } from 'swiper/svelte';
	import TrendingCarouselItems from './TrendingCarouselItems.svelte';
	import { page } from '$app/stores';

	let tableData: Array<WeeklyTopSchemesEntity>;

	let carouselInActive = false;

	export { tableData };

	$: isMobile = $page.data.deviceType.isMobile;
</script>

<section class={carouselInActive ? 'carousel-inactive' : 'carousel-active'}>
	<Carousel
		slidesPerView={isMobile ? 1.15 : 2}
		centeredSlides={false}
		spaceBetween={isMobile ? 0 : -15}
		navigation={false}
	>
		{#each tableData || [] as schemes}
			<SwiperSlide>
				<TrendingCarouselItems
					clazz="{isMobile ? 'ml-5' : 'mx-5'} rounded-lg border p-5"
					{schemes}
				/>
			</SwiperSlide>
		{/each}
	</Carousel>
</section>
