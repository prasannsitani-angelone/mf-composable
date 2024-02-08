<script lang="ts">
	import type { PageData } from '../$types';
	import { SEO } from 'svelte-components';
	import { page } from '$app/stores';
	import {
		startFirstSipSchemeClickAnalytics,
		startFirstSipScreenImpressionAnalytics
	} from '$lib/analytics/startFirstSip/startFirstSip';
	import TrendingCarouselItems from '$components/TrendingFunds/TrendingCarouselItems.svelte';
	import StartFirstSipSkeleton from './StartFirstSipSkeleton.svelte';
	import StartFirstSipStatic from './StartFirstSipStatic.svelte';
	import { onMount } from 'svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

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
			<StartFirstSipStatic class="mb-6" />

			<p class="mb-2 text-sm font-medium text-title">
				Select a fund based on your goals and start an SIP
			</p>

			{#each schemePack as scheme, index}
				<TrendingCarouselItems
					clazz="rounded-lg border p-3 bg-background-alt mb-2"
					schemes={scheme}
					index="1"
					on:onCardClick={() => schemeCardClicked(scheme, index + 1)}
				>
					<div slot="topRightSection" />
					<div slot="cardFooter">
						{#if scheme.riskoMeterValue}
							<div class="mt-2 text-xs font-medium text-body">
								{scheme.riskoMeterValue}
							</div>
						{/if}
					</div>
				</TrendingCarouselItems>
			{/each}
		</section>
	</article>
{/await}
