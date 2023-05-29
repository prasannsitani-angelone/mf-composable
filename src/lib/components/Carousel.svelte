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
	export { carouselClass, autoplay };
</script>

{#if browser}
	<Swiper
		spaceBetween={20}
		{autoplay}
		slidesPerView={1}
		centeredSlides={true}
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
