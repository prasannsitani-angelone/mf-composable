<script lang="ts">
	import type { PageData } from './$types';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import SearchOptionHeader from './SearchOptionHeader/SearchOptionHeader.svelte';
	import { onMount } from 'svelte';
	import { fundCardClick, sExploreMutualFunds, taxSavingInfo } from './analytics';
	import ExploreFundModal from './ExploreFundModal/ExploreFundModal.svelte';
	import { page } from '$app/stores';
	import { SEO } from 'svelte-components';
	import SchemeCardExt from '$components/SchemeCardExt.svelte';
	import ExploreFundsLoader from './ExploreFundsLoader.svelte';

	let data: PageData;
	$: pageID = data?.pageID;
	$: modalList = searchDashboardData?.searchOptions?.filter(({ id }) => id === pageID) || [];
	$: isModalOpen = false;
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

	const toggleTaxSavingModal = () => {
		if (!isModalOpen) {
			taxSavingInfo({ Info: 'Learn more about Tax Saving Mutual Funds' });
		}
		isModalOpen = isModalOpen ? false : true;
	};

	const handleFundCardClick = (event) => {
		const { schemes } = event.detail;
		const { isin } = schemes;

		const order = schemes?.sortBy2;
		const recommended = order > 0 && order < 3;
		const filter = modalList[0]?.name;
		fundCardClick({
			'Fund Name': `${schemes?.schemeName}(${schemes?.categoryName})`,
			isin,
			recommended,
			filter,
			order
		});
	};
	const searchDashboardData = $page.data.searchDashboardData;

	onMount(() => {
		const filter = modalList[0]?.name;
		sExploreMutualFunds({ filter });
	});

	export { data };
</script>

<article class="flex min-h-screen flex-col">
	<SEO
		seoTitle="Mutual Funds Screener: Explore All Types of Mutual Funds | Angel One"
		seoDescription="MF Screener: Explore and filter various types of mutual funds by category, risk, fund size and start investing in Mutual Funds online with Angel One."
	/>
	<Breadcrumbs items={breadCrumbs} class="mb-4 hidden items-center justify-start md:flex" />

	<h1 class="hidden pb-6 text-lg font-medium text-black-title sm:mt-3 md:block">
		Explore Mutual Funds
	</h1>

	<section class="md:rounded-b-lg md:shadow-csm">
		<SearchOptionHeader {toggleTaxSavingModal} modalList={modalList[0]} {pageID} />

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
								on:onCardClick={handleFundCardClick}
							/>
						{/each}
					</section>
				{/await}
			</section>
		</section>
	</section>
	<ExploreFundModal {isModalOpen} {toggleTaxSavingModal} modalList={modalList[0]} />
</article>
