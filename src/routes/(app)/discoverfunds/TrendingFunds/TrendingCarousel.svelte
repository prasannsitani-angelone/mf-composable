<script lang="ts">
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import TrendingCarouselItems from './TrendingCarouselItems.svelte';
	import { page } from '$app/stores';
	import {
		trendingCardImpressionEvent,
		trendingCardClickEvent,
		trendingCartClickEvent
	} from './analytics';
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';

	let tableData: Array<WeeklyTopSchemesEntity>;

	let carouselInActive = false;

	export { tableData };
	export let version: string;

	$: isMobile = $page.data.deviceType.isMobile || false;

	function handleCardVisible(event: CustomEvent) {
		let index = event.detail.index;
		let scheme = tableData[index];
		const eventMetaData = {
			Fundname: scheme.schemeName,
			Cardrank: (index + 1).toString()
		};
		trendingCardImpressionEvent(eventMetaData);
	}

	function handleCardClick(event: CustomEvent, index: number) {
		let schemes = tableData[index];
		const eventMetaData = {
			Fundname: schemes.schemeName,
			Cardrank: (index + 1).toString(),
			version
		};
		trendingCardClickEvent(eventMetaData);
	}

	function handleCartClick(event: CustomEvent, index: number) {
		let schemes = tableData[index];
		const eventMetaData = {
			Fundname: schemes.schemeName,
			Cardrank: (index + 1).toString()
		};
		trendingCartClickEvent(eventMetaData);
	}
</script>

<section class={carouselInActive ? 'carousel-inactive' : 'carousel-active'}>
	<CarouselNative
		navigation={!isMobile && tableData?.length > 0}
		totalElements={tableData?.length}
		on:onIndexChange={handleCardVisible}
		fixedWidth={true}
		slidesPerView={isMobile ? 1.1 : 2}
	>
		{#each tableData || [] as schemes, index}
			<CarouselItem
				class="!w-[calc(100vw/1.2)] sm:!w-[calc(100vw/2.3)] lg:!w-[calc(100vw/3.6)]  xl:!w-[calc(100vw/4.8)] 2xl:!w-[calc(100vw/5.4)]"
				{index}
			>
				<TrendingCarouselItems
					on:onCartClick={(e) => handleCartClick(e, index)}
					on:onCardClick={(e) => handleCardClick(e, index)}
					clazz="ml-5 rounded-lg border p-3"
					{schemes}
					{index}
				/>
			</CarouselItem>
		{/each}
	</CarouselNative>
</section>
