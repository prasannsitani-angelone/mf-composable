<script lang="ts">
	import { page } from '$app/stores';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import SearchHeader from '$components/Autocomplete/SearchHeader.svelte';
	import Link from '$components/Link.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import {
		keywordSearchAnalytics,
		screenOpenAnalytics,
		searchFundSelectionAnalytics
	} from '$lib/analytics/search/search';
	import SearchResultImage from '$lib/images/SearchResultImage.svelte';
	import ClockInCircleIcon from '$lib/images/icons/ClockInCircleIcon.svelte';
	import RupeeInCircleSmallIcon from '$lib/images/icons/RupeeInCircleSmallIcon.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import type { IDashBoardData } from '$lib/types/ISearch';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { useFetch } from '$lib/utils/useFetch';
	import AutocompleteComponent from '../Autocomplete/AutoCompleteComponent.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import SearchCard from './SearchCard.svelte';
	const queryLengthThreshold = 2;
	const dispatch = createEventDispatcher();
	$: deviceType = $page?.data?.deviceType;

	let searchPageLoaded = false;
	let dashboardData: IDashBoardData | null;
	let resultsData: Array<WeeklyTopSchemesEntity>;
	let resultItemClicked: boolean;

	const getSearchResults = (val: string) =>
		val?.length > queryLengthThreshold ? resultsData || [] : null;

	const handleSearchFocus = (e: { detail: boolean }) => {
		if (!e?.detail) {
			dashboardData = null;
			resultsData = [];
		}
		dispatch('searchFocus', e.detail);
	};

	const getSearchResultsData = async (query: string) => {
		const encodedQuery = encodeURIComponent(query);
		const url = `${PUBLIC_MF_CORE_BASE_URL}/search?value=${encodedQuery}`;
		const res = await useFetch(url);
		if (res.ok) {
			const response = res.data;
			if (response?.status === 'success') {
				resultsData = response?.data?.schemes;
			}
		}

		keywordSearchAnalytics({
			FundNameSearched: query,
			FundNameResultStatus: resultsData?.length
				? `Showing ${resultsData?.length} results`
				: 'No Result'
		});
	};
	const getSearchDashboardData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard`;
		const res = await useFetch(url);
		if (res.ok) {
			dashboardData = JSON.parse(JSON.stringify(res.data));
		}
	};

	const handleRecentClearAllClick = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/recentSearch`;
		await useFetch(url, {
			method: 'DELETE'
		}).then(() => getSearchDashboardData());
	};

	const handleSearchInput = (e: any) => {
		const val = e.detail;
		if (val) {
			if (val?.length > queryLengthThreshold) {
				getSearchResultsData(val);
			}
		} else {
			getSearchDashboardData();
		}
	};

	onMount(() => {
		screenOpenAnalytics();
	});

	const searchAnalyticsEvent = (item: WeeklyTopSchemesEntity, type: string) => {
		const eventMetaData = {
			FundName: item?.schemeName,
			FundType: item?.reInvestmentPlan,
			AssetType: item?.categoryName,
			SubAssetType: item?.subcategoryName,
			Rating: item?.arqRating,
			ReturnYear: 3,
			ReturnsValue: item?.returns3yr
		};

		const eventProperty = type;

		searchFundSelectionAnalytics(eventMetaData, eventProperty);
	};

	$: if (searchPageLoaded && deviceType?.isMobile) {
		getSearchDashboardData();
	}

	export { searchPageLoaded };
</script>

<section class={`${$$props.class}`}>
	<AutocompleteComponent
		class="relative"
		getResults={getSearchResults}
		placeholderText="Search by fund name, type or AMC"
		{searchPageLoaded}
		on:searchFocus={handleSearchFocus}
		on:searchInput={handleSearchInput}
		{resultItemClicked}
	>
		<svelte:fragment slot="defaultResult">
			<section
				class="absolute z-60 w-full overflow-auto rounded-md rounded-t-none border border-t-0 border-gray-200 bg-white lg:w-[440px]"
				style={`${deviceType.isBrowser ? 'max-height: 80vh' : 'max-height: 75vh'}`}
			>
				<!-- header 1 -->
				{#if dashboardData?.recentlyViewed?.length}
					<article class="border-b border-gray-200">
						<SearchHeader
							data={{
								defaultTitle: 'You Recently Viewed',
								ctaTitle: 'CLEAR ALL',
								subtitle: 'Fund Name',
								subtitleRight: '3Y Returns'
							}}
							on:clearAll={handleRecentClearAllClick}
						>
							<svelte:fragment slot="searchHeaderIconSlot">
								<ClockInCircleIcon class="mr-1.5" />
							</svelte:fragment>
						</SearchHeader>
					</article>
				{/if}

				<!-- recently viewed list -->
				{#if dashboardData?.recentlyViewed?.length}
					<section>
						{#each dashboardData.recentlyViewed as item (`${item?.isin}-${item?.schemeCode}`)}
							<div class="group cursor-pointer text-left hover:bg-gray-100">
								<Link
									to={`/schemes/${normalizeFundName(
										item?.schemeName,
										item?.isin,
										item?.schemeCode
									)}`}
									on:linkClicked={() => searchAnalyticsEvent(item, 'recentSearch')}
								>
									<SearchCard data={item} on:click={() => (resultItemClicked = true)} />
								</Link>
							</div>
						{/each}
					</section>
				{/if}

				<!-- header 2 -->
				{#if dashboardData?.topInvestSchemes?.length}
					<article class="border-b border-gray-200">
						<SearchHeader
							data={{
								defaultTitle: 'Popular With Other Investors',
								subtitle: 'Fund Name',
								subtitleRight: '3Y Returns'
							}}
						>
							<svelte:fragment slot="searchHeaderIconSlot">
								<RupeeInCircleSmallIcon class="mr-[5px]" />
							</svelte:fragment>
							<svelte:fragment slot="searchCtaTitle" />
						</SearchHeader>
					</article>
				{/if}

				<!-- Popular With Other Investors list -->
				{#if dashboardData?.topInvestSchemes?.length}
					<section>
						{#each dashboardData.topInvestSchemes as item (`${item?.isin}-${item?.schemeCode}`)}
							<div class="group cursor-pointer text-left hover:bg-gray-100">
								<Link
									to={`/schemes/${normalizeFundName(
										item?.schemeName,
										item?.isin,
										item?.schemeCode
									)}`}
									on:linkClicked={() =>
										searchAnalyticsEvent(item, 'popularWithOtherInvestorsSearch')}
								>
									<SearchCard data={item} on:click={() => (resultItemClicked = true)} />
								</Link>
							</div>
						{/each}
					</section>
				{/if}
			</section>
		</svelte:fragment>

		<svelte:fragment slot="resultsData">
			<section
				class="absolute z-60 w-full overflow-auto rounded-md rounded-t-none border border-t-0 border-gray-200 bg-white lg:w-[440px]"
				style={`${deviceType.isBrowser ? 'max-height: 80vh' : 'max-height: 75vh'}`}
			>
				{#if resultsData?.length}
					<section>
						<!-- header 1 -->
						<article class="border-b border-gray-200">
							<SearchHeader
								data={{
									defaultTitle: `Showing ${resultsData?.length} Results`,
									subtitle: 'Fund Name',
									subtitleRight: '3Y Returns'
								}}
							>
								<svelte:fragment slot="searchHeaderIconSlot" />
								<svelte:fragment slot="searchCtaTitle" />
							</SearchHeader>
						</article>

						<!-- results data list -->
						<section>
							{#each resultsData as item (`${item?.isin}-${item?.schemeCode}`)}
								<div class="group cursor-pointer text-left hover:bg-gray-100">
									<Link
										to={`/schemes/${normalizeFundName(
											item?.schemeName,
											item?.isin,
											item?.schemeCode
										)}`}
										on:linkClicked={() => searchAnalyticsEvent(item, 'afterSearch')}
									>
										<ResultItem data={item} on:click={() => (resultItemClicked = true)} />
									</Link>
								</div>
							{/each}
						</section>
					</section>
				{:else}
					<section>
						<!-- No results found -->
						<section>
							<article class="border-b border-gray-200">
								<section
									class="m-4 flex items-center justify-center rounded-lg bg-gray-100 px-10 md:px-16"
								>
									<SearchResultImage />
									<p class="pl-4 text-sm text-grey-body">
										No results found. Please try using different keywords
									</p>
								</section>
							</article>
						</section>

						<section>
							<!-- header 2 -->
							{#if dashboardData?.topInvestSchemes?.length}
								<article class="border-b border-gray-200">
									<SearchHeader
										data={{
											defaultTitle: 'Popular With Other Investors',
											subtitle: 'Fund Name',
											subtitleRight: '3Y Returns'
										}}
									>
										<svelte:fragment slot="searchHeaderIconSlot">
											<RupeeInCircleSmallIcon class="mr-[5px]" />
										</svelte:fragment>
										<svelte:fragment slot="searchCtaTitle" />
									</SearchHeader>
								</article>
							{/if}

							<!-- Popular With Other Investors list -->
							{#if dashboardData?.topInvestSchemes?.length}
								<section>
									{#each dashboardData.topInvestSchemes as item (`${item?.isin}-${item?.schemeCode}`)}
										<div class="group cursor-pointer text-left hover:bg-gray-100">
											<Link
												to={`/schemes/${normalizeFundName(
													item?.schemeName,
													item?.isin,
													item?.schemeCode
												)}`}
												on:linkClicked={() =>
													searchAnalyticsEvent(item, 'popularWithOtherInvestorsSearch')}
											>
												<ResultItem data={item} on:click={() => (resultItemClicked = true)} />
											</Link>
										</div>
									{/each}
								</section>
							{/if}
						</section>
					</section>
				{/if}
			</section>
		</svelte:fragment>
	</AutocompleteComponent>
</section>
