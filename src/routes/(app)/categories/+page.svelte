<script lang="ts">
	import type { PageData } from './$types';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import SearchOptionHeader from './SearchOptionHeader/SearchOptionHeader.svelte';
	import { SEO } from 'svelte-components';
	import SchemeCardExt from '$components/SchemeCardExt.svelte';
	import type { ExploreFundsOptions } from '$lib/types/IExploreFunds';
	import { fundCardClick, sExploreMutualFunds } from '../explorefunds/[slug]/analytics';
	import { getCategoriesFundsNavigationPath } from '$lib/utils';
	import type { CategoryNavItem } from './types';
	import CategoriesLoader from './CategoriesLoader.svelte';

	export let data: PageData;
	$: pageID = data?.pageID;
	$: breadCrumbs = [
		{
			text: 'Home',
			href: '/discoverfunds'
		},
		{
			text: 'Explore Mutual Fund',
			href: `/categories${data?.api?.url?.search || ''}`
		}
	];

	let allFilterOptions: CategoryNavItem[] = [];
	let currentFilter: CategoryNavItem;

	const handleFundCardClick = (scheme: ExploreFundsOptions) => {
		const { isin } = scheme;
		const order = scheme?.sortBy2;
		const filter = currentFilter?.title;
		fundCardClick({
			type: 'click',
			category: filter,
			fundisin: isin,
			fundrank: order
		});
	};

	function sendImpressionAnalyticEvent() {
		const filter = currentFilter?.title;
		sExploreMutualFunds({ Category: filter, type: 'click' });
	}

	async function getFilterAndSchemes(searchOption: Promise) {
		const response = await searchOption;
		const { filterCategories, schemes } = response;
		allFilterOptions = filterCategories.map((options) => {
			return {
				href: getCategoriesFundsNavigationPath(options.id),
				title: options.name,
				id: options.id,
				shortDescription: options.shortDescription,
				detailedDescription: options.detailedDescription
			};
		});
		currentFilter = allFilterOptions.find(({ id }) => id === pageID) || {};
		sendImpressionAnalyticEvent();
		return { filterOptions: allFilterOptions, schemes };
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, follow" />
</svelte:head>
<article class="flex min-h-screen flex-col">
	<SEO
		seoTitle="Mutual Funds Screener: Explore All Types of Mutual Funds | Angel One"
		seoDescription="MF Screener: Explore and filter various types of mutual funds by category, risk, fund size and start investing in Mutual Funds online with Angel One."
	/>
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />

	<h1 class="hidden pb-6 text-lg font-normal text-title sm:mt-3 md:block">Explore Mutual Funds</h1>

	<section class="md:rounded-b-lg md:shadow-csm">
		<section
			class="ml-[calc(50%-50vw)] w-screen rounded-b-lg sm:ml-0 sm:w-full md:bg-background-alt md:pt-3"
		>
			<section>
				{#await getFilterAndSchemes(data?.api?.searchOption)}
					<CategoriesLoader />
				{:then { filterOptions, schemes }}
					<SearchOptionHeader
						categoryDetails={currentFilter}
						categoryFilterOptions={filterOptions}
						{pageID}
					/>

					<section class="flex flex-col flex-wrap items-center px-2 md:flex-row md:px-6 md:pb-1">
						{#each schemes || [] as scheme}
							<SchemeCardExt
								class="mb-2 w-full rounded-lg bg-background-alt p-3 md:mb-4 md:mr-4 md:w-[336px]"
								schemes={scheme}
								on:onCardClick={() => handleFundCardClick(scheme)}
							/>
						{/each}
					</section>
				{/await}
			</section>
		</section>
	</section>
</article>
