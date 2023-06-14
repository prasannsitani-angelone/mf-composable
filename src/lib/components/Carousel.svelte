<script>
	import { Swiper } from 'swiper/svelte';
	import { browser } from '$app/environment';
	import { Pagination, Autoplay, Navigation } from 'swiper';
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import { WMSIcon } from 'wms-ui-component';
	import { createEventDispatcher } from 'svelte';
	let carouselClass = '';
	let autoplay = false;
	let loop = true;
	const modules = [Pagination, Autoplay, Navigation];
	const pagination = {
		clickable: true,
		bulletClass: 'swiper-pagination-bullet swiper-bullet',
		bulletActiveClass: 'swiper-active'
	};
	let slidesPerView = 1;
	let centeredSlides = true;
	let spaceBetween = 20;
	let navigation = false;
	const navigationProps = {
		nextEl: '.swiper-next-button',
		prevEl: '.swiper-prev-button',
		disabledClass: 'swiper-button-disabled'
	};
	const dispatch = createEventDispatcher();

	function onSlideChange(event) {
		let index = event.detail[0].realIndex;
		dispatch('onIndexChange', { index });
	}

	export { carouselClass, autoplay, slidesPerView, centeredSlides, spaceBetween, navigation, loop };
</script>

{#if browser}
	<div class="flex w-full flex-row items-center">
		{#if navigation}
			<WMSIcon
				width={40}
				name="arrow-expand"
				class="swiper-prev-button mb-10 ml-4 mr-1 rotate-90 cursor-pointer"
			/>
		{/if}
		<Swiper
			navigation={navigation ? navigationProps : false}
			on:slideChangeTransitionEnd={onSlideChange}
			{spaceBetween}
			{autoplay}
			{slidesPerView}
			{centeredSlides}
			{loop}
			{modules}
			{pagination}
			class={carouselClass}
		>
			<slot />
		</Swiper>
		{#if navigation}
			<WMSIcon
				width={40}
				name="arrow-collapse"
				class="swiper-next-button mb-10 mr-4 ml-1 rotate-90 cursor-pointer"
			/>
		{/if}
	</div>
{:else if $$slots.hydrating}
	<slot name="hydrating" />
{:else}
	<slot />
{/if}
