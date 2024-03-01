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
	import {
		sipBookTrendingCardClickEvent,
		sipBookTrendingCardImpressionEvent,
		sipBookTrendingCartClickEvent
	} from '$lib/analytics/sipbook/sipbook';

	let tableData: Array<WeeklyTopSchemesEntity>;

	let carouselInActive = false;

	export { tableData };
	export let version: string;

	$: isMobile = $page.data.deviceType.isMobile || false;
	$: isSipBookPage = $page?.url?.pathname === '/mutual-funds/sipbook/dashboard' ? true : false;

	function handleCardVisible(event: CustomEvent) {
		let index = event.detail.index;
		let scheme = tableData[index];
		const eventMetaData = {
			Fundname: scheme.schemeName,
			Cardrank: (index + 1).toString()
		};
		const analyticsFunc = isSipBookPage
			? sipBookTrendingCardImpressionEvent
			: trendingCardImpressionEvent;
		analyticsFunc(eventMetaData);
	}

	function handleCardClick(event: CustomEvent, index: number) {
		let schemes = tableData[index];
		const eventMetaData = {
			Fundname: schemes.schemeName,
			Cardrank: (index + 1).toString(),
			version
		};
		const analyticsFunc = isSipBookPage ? sipBookTrendingCardClickEvent : trendingCardClickEvent;
		analyticsFunc(eventMetaData);
	}

	function handleCartClick(event: CustomEvent, index: number) {
		let schemes = tableData[index];
		const eventMetaData = {
			Fundname: schemes.schemeName,
			Cardrank: (index + 1).toString()
		};
		const analyticsFunc = isSipBookPage ? sipBookTrendingCartClickEvent : trendingCartClickEvent;
		analyticsFunc(eventMetaData);
	}
</script>

<section class={carouselInActive ? 'carousel-inactive' : 'carousel-active'}>
	<CarouselNative
		navigation={!isMobile && tableData?.length > 0}
		totalElements={tableData?.length}
		on:onIndexChange={handleCardVisible}
		fixedWidth={true}
		slidesPerView={isMobile ? 1.3 : 2}
	>
		{#each tableData || [] as schemes, index}
			<CarouselItem
				class="!w-[calc(100vw/1.3)] sm:!w-[calc(100vw/2.3)] lg:!w-[calc(100vw/3.6)]  xl:!w-[calc(100vw/4.8)] 2xl:!w-[calc(100vw/5.4)]"
				{index}
			>
				<TrendingCarouselItems
					on:onCartClick={(e) => handleCartClick(e, index)}
					on:onCardClick={(e) => handleCardClick(e, index)}
					clazz="ml-3 rounded-lg border pt-2 {$$props?.class}"
					{schemes}
					{index}
					schemeLogoSize="xs"
					schemeLogoClass="border-none"
				>
					<div slot="topRightSection" />
				</TrendingCarouselItems>
			</CarouselItem>
		{/each}
	</CarouselNative>
</section>
