<script lang="ts">
	import type { PageData } from './$types';
	import { SEO } from 'svelte-components';
	import SkeletonLoader from '../components/SkeletonLoader.svelte';
	import PackDetails from './components/PackDetails.svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import PageTitle from '$components/PageTitle.svelte';

	export let data: PageData;

	const handleErrorNavigation = () => {
		history?.back();
	};
</script>

<SEO seoTitle="Select a Portfolio | Angelone" seoDescription="List of portfolio" />
<article>
	<header class="hidden sm:block">
		<PageTitle title="Portfolio Details" class="mb-0 sm:mb-4 sm:flex" />
	</header>
	<section class="ml-[calc(50%-50vw)] w-screen sm:ml-0 sm:w-full">
		{#await data.api.portfolioOption}
			<SkeletonLoader />
		{:then portfolioOption}
			{#if portfolioOption.packId !== ''}
				<PackDetails portfolioPack={portfolioOption} />
			{:else}
				<ErrorView
					heading="Something went wrong!"
					contentLine="Portfolio details not found"
					textForButton="GO BACK"
					on:errorCTAClicked={handleErrorNavigation}
				/>
			{/if}
		{/await}
	</section>
</article>
