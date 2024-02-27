<script lang="ts">
	import type { PageData } from '../$types';
	import { SEO } from 'svelte-components';
	import FundOverviewTile from './components/FundOverviewTile.svelte';
	import StartSipLoader from './components/StartSipLoader.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import { onMount } from 'svelte';
	import {
		startSipFundSelectAnalytics,
		startSipPageOpenAnalytics
	} from '$lib/analytics/startSip/startSip';
	import type { SchemePack } from '$lib/types/IStartSip';

	export let data: PageData;

	onMount(() => {
		startSipPageOpenAnalytics();
	});

	const handleFundClick = (scheme: SchemePack, index: number) => {
		const eventMetaData = {
			Fundname: scheme.schemeName,
			Isin: scheme.isin,
			FundRank: index + 1,
			Category: scheme?.subCategory
		};
		startSipFundSelectAnalytics(eventMetaData);
	};
</script>

{#await data?.api?.schemePack}
	<StartSipLoader />
{:then schemePack}
	<SEO seoTitle="Start SIP | Angel One" seoDescription="Start SIP" />
	<article class="bg-background-alt" data-testid="startSipPage">
		<header class="hidden sm:block">
			<PageTitle title="Start SIP" class="mb-0 sm:mb-4 sm:flex" />
		</header>
		<section class="grid h-full grid-cols-1 gap-4 bg-background-alt md:grid-cols-2">
			{#each schemePack as scheme, index}
				<FundOverviewTile
					clazz="rounded-lg border bg-background-alt"
					{index}
					schemes={scheme}
					schemeLogoSize="xs"
					schemeLogoClass="border-none !mr-2"
					showBadge={index === 0}
					on:onCardClick={() => handleFundClick(scheme, index)}
				/>
			{/each}
		</section>
	</article>
{/await}
