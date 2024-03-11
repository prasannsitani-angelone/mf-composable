<script lang="ts">
	import { page } from '$app/stores';

	import { buildPortfolioCardClicked } from '$lib/analytics/buyPortfolio/buyPortfolio';
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';

	import RecommendedPortfolio from './RecommendedPortfolio/RecommendedPortfolio.svelte';
	import Modal from '$components/Modal.svelte';
	import PortfolioInput from '../(authenticated)/buyPortfolio/[portfolioId]/components/PortfolioInput.svelte';
	import type { PortfolioPack } from '$lib/types/IBuyPortfolio';

	export let portfolios: PortfolioPack[];
	let carouselInActive = false;
	let showInputPopup = false;
	let selectedPortfolio: PortfolioPack;

	$: isMobile = $page.data.deviceType.isMobile || false;

	const goToBuyPortfolio = (portfolio: PortfolioPack) => {
		buildPortfolioCardClicked();
		selectedPortfolio = portfolio;
		showInputPopup = true;
	};
</script>

<section class="my-2 max-w-4xl rounded-lg bg-background-alt px-4 py-3 shadow-csm {$$props.class}">
	<header class="mb-2 justify-between" data-testid="portfolios">
		<h2 class="text-base font-medium text-title">Ready Made Portfolios</h2>
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
		>
			{#each portfolios || [] as portfolio, index}
				<CarouselItem
					class="!w-[calc(100vw/1.3)] sm:!w-[calc(100vw/2.3)] lg:!w-[calc(100vw/3.6)]  xl:!w-[calc(100vw/4.8)] 2xl:!w-[calc(100vw/5.7)]"
					{index}
					id="recommended"
				>
					<RecommendedPortfolio
						{index}
						on:onCardClick={() => goToBuyPortfolio(portfolio)}
						{portfolio}
					/>
				</CarouselItem>
			{/each}
		</CarouselNative>
	</section>
	<Modal isModalOpen={showInputPopup} on:backdropclicked={() => (showInputPopup = !showInputPopup)}>
		<PortfolioInput
			portfolioPack={selectedPortfolio}
			on:backButtonClicked={() => (showInputPopup = !showInputPopup)}
		/>
	</Modal>
</section>
