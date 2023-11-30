<script lang="ts">
	import type { PageData } from './$types';
	import { SEO } from 'svelte-components';
	import SkeletonLoader from './components/SkeletonLoader.svelte';
	import Intro from './components/Intro.svelte';
	import PortfolioList from './components/PortfolioList.svelte';

	export let data: PageData;
</script>

<SEO seoTitle="Select a Portfolio | Angelone" seoDescription="List of portfolio" />
<article>
	<section class="ml-[calc(50%-50vw)] w-screen sm:ml-0 sm:w-full">
		{#await data.api.portfolioOptions}
			<SkeletonLoader />
		{:then portfolioOptions}
			<Intro />
			<PortfolioList portfolioData={portfolioOptions} />
		{/await}
	</section>
</article>
