<script lang="ts">
	import { page } from '$app/stores';

	import {
		buildPortfolioCardClicked,
		handleCarouselImpressionAnalytics,
		handleCarouselItemClickAnalytics
	} from '$lib/analytics/buyPortfolio/buyPortfolio';
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';

	import RecommendedPortfolio from '../RecommendedPortfolio/RecommendedPortfolio.svelte';
	import type { PortfolioPack, Scheme } from '$lib/types/IBuyPortfolio';
	import { base } from '$app/paths';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { modifiedGoto } from '$lib/utils/goto';
	import LazyComponent from '$components/LazyComponent.svelte';
	import viewport from '$lib/utils/useViewPortAction';

	export let portfolios: PortfolioPack[];
	let carouselInActive = false;
	let showInputPopup = false;
	let selectedPortfolio: PortfolioPack;

	$: deviceType = $page.data.deviceType;
	$: isMobile = $page.data.deviceType.isMobile || false;

	const goToBuyPortfolio = (portfolio: PortfolioPack) => {
		buildPortfolioCardClicked();
		selectedPortfolio = portfolio;
		if (deviceType.isBrowser) {
			showInputPopup = true;
		} else {
			const params = { showInputPopup: true, fromHomePage: true, amount: portfolio?.minSipAmount };
			modifiedGoto(`${base}/buyPortfolio/${portfolio?.packId}?params=${encodeObject(params)}`);
		}
	};

	const getEventMetaData = (portfolio: PortfolioPack, index: number) => {
		const { packName, minSipAmount, threeYrReturnAvgPer, tags, schemes, totalUsersInvested } =
			portfolio;
		const eventMetaData = {
			portfolio_name: packName,
			min_sip_amount: minSipAmount.toString(),
			'3_yr_returns': threeYrReturnAvgPer.toFixed(2),
			people_invested_in_portfolio: totalUsersInvested.toString(),
			cardrank: (index + 1).toString(),
			tag1: tags?.[0],
			tag2: tags?.[1],
			fundnames: schemes.map((scheme: Scheme) => scheme.schemeName),
			all_isin: schemes.map((scheme: Scheme) => scheme.isin)
		};

		return eventMetaData;
	};

	const handleCardVisible = (event: CustomEvent) => {
		let index = event.detail?.index || 0;
		let portfolio = portfolios[index];

		handleCarouselImpressionAnalytics(getEventMetaData(portfolio, index));
	};

	function handleCardClick(portfolio: PortfolioPack, index: number) {
		handleCarouselItemClickAnalytics(getEventMetaData(portfolio, index));
		goToBuyPortfolio(portfolio);
	}
</script>

<section
	class="max-w-4xl rounded-lg bg-background-alt px-4 py-3 shadow-csm {$$props.class}"
	use:viewport
	on:enterViewport={handleCardVisible}
>
	<header class="mb-2 justify-between" data-testid="portfolios">
		<h2 class="text-base font-medium text-title">Ready made SIP Baskets</h2>
		<p class="mb-5 mt-1 text-[12px] font-normal text-body">
			Select a basket of SIPs based on your expected returns
		</p>
	</header>

	<section class={carouselInActive ? 'carousel-inactive' : 'carousel-active'}>
		<CarouselNative
			id="recommended"
			navigation={!isMobile && portfolios?.length > 0}
			totalElements={portfolios?.length}
			fixedWidth={true}
			slidesPerView={isMobile ? 1 : 2}
			on:onIndexChange={handleCardVisible}
			smoothCarousalLoop={portfolios?.length > 1 ? true : false}
		>
			{#each portfolios || [] as portfolio, index}
				<CarouselItem
					class="!w-[calc(100vw/1.3)] sm:!w-[calc(100vw/2.3)] lg:!w-[calc(100vw/3.6)]  xl:!w-[calc(100vw/4.8)] 2xl:!w-[calc(100vw/5.7)]"
					{index}
					id="recommended"
				>
					<RecommendedPortfolio
						{index}
						on:onCardClick={() => handleCardClick(portfolio, index)}
						{portfolio}
					/>
				</CarouselItem>
			{/each}
		</CarouselNative>
	</section>
</section>

<LazyComponent
	when={showInputPopup}
	component={async () => await import('./PortfolioInputModal.svelte')}
	{selectedPortfolio}
	{showInputPopup}
/>
