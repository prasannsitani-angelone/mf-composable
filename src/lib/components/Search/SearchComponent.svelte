<script lang="ts">
	import { page } from '$app/stores';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import SearchHeader from '$components/Autocomplete/SearchHeader.svelte';
	import Link from '$components/Link.svelte';
	import { PUBLIC_MF_CORE_BASE_URL, PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
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
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	import SomethingWentWrongSmall from '$components/Error/SomethingWentWrongSmall.svelte';
	import { appStore } from '$lib/stores/SparkStore';
	const queryLengthThreshold = 2;
	const dispatch = createEventDispatcher();
	$: deviceType = $page?.data?.deviceType;
	let filter = '';

	let searchPageLoaded = false;
	let dashboardData: IDashBoardData | null;
	let resultsData: Array<WeeklyTopSchemesEntity>;
	let initialSearchResult: Array<WeeklyTopSchemesEntity>;

	let resultItemClicked: boolean;
	let shouldFetchSearchDashboard = true;
	let initialSearchText = '';
	let searchMode: string;
	let parentResultClass = '';
	let searchInputClass = '';
	let searchDashboardDataFetchFailed = false;
	let searchResultDataFetchFailed = false;

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
		const encodedQuery = encodeURIComponent(query || 'ALL');

		const url = `${PUBLIC_MF_CORE_BASE_URL_V2}/search?value=${encodedQuery}${
			filter ? `&filters=${filter}` : ''
		}`;
		const res = await useFetch(url);
		if (res?.ok) {
			const response = res.data;
			if (response?.status === 'success') {
				resultsData = response?.data?.schemes;
				if (encodedQuery === 'ALL') {
					initialSearchResult = response?.data?.schemes;
				}
			}
			searchResultDataFetchFailed = false;
		} else if (res?.status < 500) {
			searchResultDataFetchFailed = false;
		} else {
			resultsData = [];
			searchResultDataFetchFailed = true;
		}

		keywordSearchAnalytics({
			FundNameSearched: query,
			FundNameResultStatus: resultsData?.length
				? `Showing ${resultsData?.length} results`
				: 'No Result'
		});
	};
	const getSearchDashboardData = async (isClearAll = false) => {
		if (!shouldFetchSearchDashboard || (!isClearAll && dashboardData)) return;
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/searchDashboard`;
		const res = await useFetch(url);
		if (res?.ok) {
			try {
				dashboardData = JSON.parse(JSON.stringify(res.data));
			} catch (e) {
				dashboardData = {
					recentlyViewed: [],
					topInvestSchemes: [],
					searchOptions: []
				};
			}
			searchDashboardDataFetchFailed = false;
		} else if (res?.status < 500) {
			dashboardData = {
				recentlyViewed: [],
				topInvestSchemes: [],
				searchOptions: []
			};
			searchDashboardDataFetchFailed = false;
		} else {
			searchDashboardDataFetchFailed = true;
		}
	};

	const handleRecentClearAllClick = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/recentSearch`;
		await useFetch(url, {
			method: 'DELETE'
		}).then(() => getSearchDashboardData(true));
	};

	const handleSearchInput = (e: unknown) => {
		const val = e.detail;
		if (val) {
			if (val?.length > queryLengthThreshold) {
				getSearchResultsData(val);
			} else if (searchMode === 'switch') {
				getSearchResultsData('ALL');
			}
		} else {
			getSearchDashboardData();
		}
	};

	onMount(() => {
		screenOpenAnalytics();
		if (initialSearchText) {
			getSearchResultsData(initialSearchText);
		}
	});

	const searchAnalyticsEvent = (item: WeeklyTopSchemesEntity, type: string) => {
		const eventMetaData = {
			FundName: item?.schemeName,
			FundType: item?.reInvestmentPlan,
			AssetType: item?.categoryName,
			SubAssetType: item?.subcategoryName,
			Rating: item?.arqRating,
			ReturnYear: 3,
			ReturnsValue: item?.returns3yr,
			SearchType: $appStore.isTabView ? 'SearchBar' : 'SearchIcon'
		};

		const eventProperty = type;

		searchFundSelectionAnalytics(eventMetaData, eventProperty);
	};

	$: if (searchPageLoaded && deviceType?.isMobile) {
		getSearchDashboardData();
	}

	const refreshPageOnRetry = () => {
		if (navigator?.onLine) {
			window?.location?.reload();
		}
	};

	export {
		searchPageLoaded,
		shouldFetchSearchDashboard,
		initialSearchText,
		filter,
		searchMode,
		parentResultClass,
		searchInputClass
	};
</script>

<section class={`${$$props.class}`}>
	{#if searchDashboardDataFetchFailed}
		<SomethingWentWrong class="cardHeightNoBottomNav" />
	{:else}
		<AutocompleteComponent
			class="relative md:px-3"
			getResults={getSearchResults}
			placeholderText="Search by fund name, type or AMC"
			{searchPageLoaded}
			{parentResultClass}
			{searchInputClass}
			{searchMode}
			on:searchFocus={handleSearchFocus}
			on:searchInput={handleSearchInput}
			{resultItemClicked}
			{initialSearchResult}
		>
			<svelte:fragment slot="defaultResult">
				<slot name="defaultResult">
					<section
						class="absolute z-60 w-full overflow-auto rounded-md rounded-t-none border border-t-0 border-border bg-background-alt lg:w-[440px]"
						style={`${deviceType.isBrowser ? 'max-height: 80vh' : 'max-height: 75vh'}`}
					>
						<!-- header 1 -->
						{#if dashboardData?.recentlyViewed?.length}
							<article class="border-b border-border">
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
									<div class="group cursor-pointer text-left hover:bg-border">
										<Link
											to={`/schemes/${normalizeFundName(
												item?.schemeName,
												item?.isin,
												item?.schemeCode
											)}`}
											preloadData="off"
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
							<article class="border-b border-border">
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
									<div class="group cursor-pointer text-left hover:bg-border">
										<Link
											to={`/schemes/${normalizeFundName(
												item?.schemeName,
												item?.isin,
												item?.schemeCode
											)}`}
											preloadData="off"
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
				</slot>
			</svelte:fragment>

			<svelte:fragment slot="resultsData">
				<slot name="resultsData" {resultsData}>
					<section
						class="absolute z-60 w-full overflow-auto rounded-md rounded-t-none border border-t-0 border-border bg-background-alt lg:w-[440px]"
						style={`${deviceType.isBrowser ? 'max-height: 80vh' : 'max-height: 75vh'}`}
					>
						{#if searchResultDataFetchFailed && !resultsData?.length}
							<SomethingWentWrongSmall on:retryButtonClick={refreshPageOnRetry} />
						{:else if resultsData?.length}
							<section>
								<!-- header 1 -->
								<article class="border-b border-border">
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
										<div class="group cursor-pointer text-left hover:bg-border">
											<Link
												to={`/schemes/${normalizeFundName(
													item?.schemeName,
													item?.isin,
													item?.schemeCode
												)}`}
												preloadData="off"
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
									<article class="border-b border-border">
										<section
											class="m-4 flex items-center justify-center rounded-lg bg-background px-10 md:px-16"
										>
											<SearchResultImage />
											<p class="pl-4 text-sm text-body">
												No results found. Please try using different keywords
											</p>
										</section>
									</article>
								</section>

								<section>
									<!-- header 2 -->
									{#if dashboardData?.topInvestSchemes?.length}
										<article class="border-b border-border">
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
												<div class="group cursor-pointer text-left hover:bg-border">
													<Link
														to={`/schemes/${normalizeFundName(
															item?.schemeName,
															item?.isin,
															item?.schemeCode
														)}`}
														preloadData="off"
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
				</slot>
			</svelte:fragment>
		</AutocompleteComponent>
	{/if}
</section>
