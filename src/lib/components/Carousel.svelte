<script>
	import { Swiper } from 'swiper/svelte';
	import { browser } from '$app/environment';
	import { Pagination, Autoplay } from 'swiper';
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	let carouselClass = '';
	let autoplay = false;
	const modules = [Pagination, Autoplay];
	const pagination = {
		clickable: true,
		bulletClass: 'swiper-pagination-bullet swiper-bullet',
		bulletActiveClass: 'swiper-active'
	};
	let slidesPerView = 1;
	let centeredSlides = true;
	let spaceBetween = 20;
	let navigation = false;
	export { carouselClass, autoplay, slidesPerView, centeredSlides, spaceBetween, navigation };
</script>

{#if browser}
	<Swiper
		{navigation}
		{spaceBetween}
		{autoplay}
		{slidesPerView}
		{centeredSlides}
		loop={true}
		{modules}
		{pagination}
		class={carouselClass}
	>
		<slot />
	</Swiper>
{:else}
	<slot />
{/if}
