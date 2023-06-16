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
			Cardrank: (index + 1).toString()
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
		spaceBetween={-20}
		slidesPerView={isMobile ? 1.1 : 2}
	>
		{#each tableData || [] as schemes, index}
			<CarouselItem {index}>
				<TrendingCarouselItems
					on:onCartClick={(e) => handleCartClick(e, index)}
					on:onCardClick={(e) => handleCardClick(e, index)}
					clazz="mx-5 rounded-lg border p-3"
					{schemes}
				/>
			</CarouselItem>
		{/each}
	</CarouselNative>
</section>
