<script lang="ts">
	import type { PageData } from '../$types';
	import { SEO } from 'svelte-components';
	import { page } from '$app/stores';
	import {
		startFirstSipSchemeClickAnalytics,
		startFirstSipScreenImpressionAnalytics
	} from '$lib/analytics/startFirstSip/startFirstSip';
	import StartFirstSipSkeleton from './StartFirstSipSkeleton.svelte';
	import { onMount } from 'svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import OldTrendingCarouselItems from '$components/MostBought/Old/OldTrendingCarouselItems.svelte';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	onMount(() => {
		startFirstSipScreenImpressionAnalytics();
	});

	const schemeCardClicked = (scheme: SchemeDetails, position: number) => {
		startFirstSipSchemeClickAnalytics({
			MinSIPAmount: `${scheme.minSipAmount}`,
			ISIN: `${scheme.isin}`,
			rank: `${position}`
		});
	};
</script>

{#await data?.api?.schemePack}
	<StartFirstSipSkeleton />
{:then schemePack}
	<SEO
		seoTitle="Start Your First Investment | Angel One"
		seoDescription="Step-by-Step guide to make your first investment"
	/>

	<article class="-m-2" data-testid="startFirstSipPage">
		<section class=" h-full p-3">
			<p class="mb-2 text-sm font-medium text-title">
				Select a fund based on your goals and start an SIP
			</p>

			{#each schemePack as scheme, index}
				<OldTrendingCarouselItems
					clazz="rounded-lg border p-3 bg-background-alt mb-2"
					footerClass="bg-tint24-primary"
					topSectionClass="mb-3"
					detailsClass="divide-x p-2"
					schemes={scheme}
					index="1"
					on:onCardClick={() => schemeCardClicked(scheme, index + 1)}
				>
					<div slot="topRightSection" />
				</OldTrendingCarouselItems>
			{/each}
		</section>
	</article>
{/await}
