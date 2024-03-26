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

	$: isMobile = $page.data.deviceType.isMobile || false;

	const backgroundUrl = !isMobile ? data?.header?.webBgBannerUrl : data?.header?.mobileBgBannerUrl;
	const carouselItemClass = isMobile
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
	class="my-2 max-w-4xl rounded-lg bg-background-alt bg-cover bg-center px-2 py-3 shadow-csm {$$props.class}"
	style="background-image: url({backgroundUrl})"
	data-testid="promotion-banner-{id}"
>
	<div class="mx-3 flex flex-col items-center">
		<img class="h-16 w-16" src={data?.header?.logoUrl} alt="" />
		<h3 class="text-white">{data?.header?.title}</h3>

		<section class="{carouselInActive ? 'carousel-inactive' : 'carousel-active'} w-full">
			<CarouselNative
				id="promotion"
				navigation={!isMobile && data?.schemes?.length > 0}
				totalElements={data?.schemes?.length}
				fixedWidth={true}
				slidesPerView={isMobile ? 1 : 2}
				indicatorClass="!m-0"
				chevronClass="mt-4"
				on:onIndexChange={handleCardVisible}
			>
				{#each data?.schemes || [] as scheme, index}
					<CarouselItem id="promotion" class="!my-3 {carouselItemClass}" {index}>
						<PromotionCarouselItem {scheme} {index} />
					</CarouselItem>
				{/each}
			</CarouselNative>
		</section>
	</div>
</section>
