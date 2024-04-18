<script lang="ts">
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';
	import { page } from '$app/stores';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';
	import PromotionCarouselItem from './PromotionCarouselItem.svelte';
	import type { IPromotion } from './interfaces/promotion';
	import { handleBannerImpressionAnalytics, handleCarouselSliderAnalytics } from './analytics';
	import { onMount } from 'svelte';
	import { getEventMetaData } from './utils';

	let carouselInActive = false;

	export let data: IPromotion;
	export let id = '';

	$: deviceType = $page.data.deviceType;

	const carouselItemClass = deviceType?.isMobile
		? 'max-full'
		: 'sm:!w-[calc(100vw/2.3)] lg:!w-[calc(100vw/3.6)]  xl:!w-[calc(100vw)] 2xl:!w-[calc(100vw/5.7)]';

	const handleCardVisible = (event: CustomEvent) => {
		const index = event.detail.index;
		const currentScheme = data.schemes?.[index];
		const metaData = getEventMetaData(index, data.header.title, currentScheme);
		handleCarouselSliderAnalytics(metaData);
	};

	onMount(() => {
		handleBannerImpressionAnalytics();
	});
</script>

<section
	class="relative mt-2 max-w-4xl rounded-lg bg-background-alt px-2 py-3 shadow-csm {$$props.class}"
	data-testid="promotion-banner-{id}"
>
	<img
		src={!deviceType?.isMobile ? data?.header?.webBgBannerUrl : data?.header?.mobileBgBannerUrl}
		class="absolute left-0 top-0 h-full w-full rounded-lg"
		alt=""
	/>
	<div class="relative mx-3 flex flex-col items-center">
		<img class="h-16 w-16" src={data?.header?.logoUrl} alt="" />
		<h3 class="text-white">{data?.header?.title}</h3>

		<section class="{carouselInActive ? 'carousel-inactive' : 'carousel-active'} w-full">
			<CarouselNative
				id="promotion"
				navigation={!deviceType?.isMobile && data?.schemes?.length > 0}
				totalElements={data?.schemes?.length}
				fixedWidth={true}
				slidesPerView={deviceType?.isMobile ? 1 : 2}
				indicatorClass="!m-0"
				chevronClass="mt-4"
				activeIndicatorColor="#fff"
				on:onIndexChange={handleCardVisible}
				smoothCarousalLoop={data?.schemes?.length > 1 ? true : false}
			>
				{#each data?.schemes || [] as scheme, index}
					<CarouselItem id="promotion" class="!my-3 {carouselItemClass}" {index}>
						<PromotionCarouselItem title={data?.header?.title} {scheme} {index} />
					</CarouselItem>
				{/each}
			</CarouselNative>
		</section>
	</div>
</section>
