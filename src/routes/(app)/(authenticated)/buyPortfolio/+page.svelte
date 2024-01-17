<script lang="ts">
	import type { PageData } from './$types';
	import { SEO } from 'svelte-components';
	import SkeletonLoader from './components/SkeletonLoader.svelte';
	import Intro from './components/Intro.svelte';
	import PortfolioList from './components/PortfolioList.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import { onMount } from 'svelte';
	import { buildPortfolioScreenImpression } from '$lib/analytics/buyPortfolio/buyPortfolio';

	export let data: PageData;

	const scrollToTop = () => {
		document?.getElementsByTagName?.('main')?.[0]?.scrollTo(0, 0);
	};

	onMount(() => {
		scrollToTop();
		buildPortfolioScreenImpression();
	});
</script>

<SEO seoTitle="Select a Portfolio | Angelone" seoDescription="List of portfolio" />
<article>
	<header class="hidden sm:block">
		<PageTitle title="Select a Portfolio" class="mb-0 sm:mb-4 sm:flex" />
	</header>
	<section class="ml-[calc(50%-50vw)] w-screen sm:ml-0 sm:w-full">
		{#await data.api.portfolioOptions}
			<SkeletonLoader />
		{:then portfolioOptions}
			<div class="md:hidden"><Intro /></div>
			<PortfolioList portfolioData={portfolioOptions} />
		{/await}
	</section>
</article>
<article class="mt-12">
	<div class="hidden md:block"><Intro /></div>
</article>
