<script lang="ts">
	import type { PageData } from './$types';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { onMount } from 'svelte';
	import { fundCardClick, sExploreMutualFunds } from './analytics';
	import { SEO } from 'svelte-components';
	import SchemeCardExt from '$components/SchemeCardExt.svelte';
	import ExploreFundsLoader from './ExploreFundsLoader.svelte';
	import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';

	let data: PageData;
	$: pageID = data?.pageID;
	$: modalList = data.filter;
	$: breadCrumbs = [
		{
			text: 'Home',
			href: '/discoverfunds'
		},
		{
			text: 'Explore Mutual Fund',
			href: '/explorefunds/sip-with-100'
		}
	];
	const handleFundCardClick = (scheme: ExploreFundsOptions) => {
		const { isin } = scheme;
		const order = scheme?.sortBy2;
		const filter = modalList?.name;
		fundCardClick({
			type: 'null',
			category: filter,
			fundisin: isin,
			fundrank: order
		});
	};

	onMount(() => {
		const filter = modalList?.name;
		sExploreMutualFunds({ Category: filter, type: 'null' });
	});

	export { data };
</script>

<article class="flex min-h-screen flex-col">
	<SEO
		seoTitle="Mutual Funds Screener: Explore All Types of Mutual Funds | Angel One"
		seoDescription="MF Screener: Explore and filter various types of mutual funds by category, risk, fund size and start investing in Mutual Funds online with Angel One."
	/>
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />

	<h1 class="hidden pb-6 text-lg font-normal text-black-title sm:mt-3 md:block">
		{modalList?.name}
	</h1>

	<section class="md:rounded-b-lg md:shadow-csm">
		<section
			class="ml-[calc(50%-50vw)] w-screen rounded-b-lg sm:ml-0 sm:w-full md:bg-white md:pt-3"
		>
			<section>
				{#await data?.api?.searchOption}
					<ExploreFundsLoader />
				{:then searchOption}
					<section class="flex flex-col flex-wrap items-center px-2 md:flex-row md:px-6 md:pb-1">
						{#each searchOption || [] as schemes}
							<SchemeCardExt
								class="mb-2 w-full rounded-lg bg-white p-3 md:mb-4 md:mr-4 md:w-[336px]"
								{schemes}
								on:onCardClick={() => handleFundCardClick(schemes)}
								enableVariant={true}
							/>
						{/each}
					</section>
				{/await}
			</section>
		</section>
	</section>
</article>
