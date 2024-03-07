<script lang="ts">
	import ChipOverview from '$components/ChipOverview.svelte';
	import Modal from '$components/Modal.svelte';
	import type {
		FundComparisons,
		OtherSchemeEntityOrSchemeInfoEntity
	} from '$components/Scheme/types';
	import SchemeCard from '$components/SchemeCard.svelte';
	import SearchComponent from '$components/Search/SearchComponent.svelte';
	import { PUBLIC_MF_CORE_BASE_URL, PUBLIC_MF_CORE_BASE_URL_V2 } from '$env/static/public';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import SearchIcon from '$lib/images/icons/SearchIcon.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { useFetch } from '$lib/utils/useFetch';
	import { createEventDispatcher, onMount } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	import {
		addFundsScreenImpressionEvent,
		addFundsSearchImpressionEvent,
		searchedFundnameSelectClickEvent,
		suggestedFundnameClickEvent
	} from '../analytics';
	import SuggestedFundsLoader from './SuggestedFundsLoader.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	const dispatch = createEventDispatcher();

	let showModal = false;
	let showAddFunds = true;
	let showSearch = false;
	let firstFund = false;
	let isin = '';
	let selectedSchemesList: SchemeDetails[] = [];
	let suggestedSchemes: OtherSchemeEntityOrSchemeInfoEntity[] = [];

	const toggleModal = () => {
		dispatch('close');
	};
	const toggleAddFunds = () => {
		showAddFunds = !showAddFunds;
		showSearch = !showSearch;
		if (showSearch) {
			addFundsSearchImpressionEvent();
		}
	};

	const schemeSelected = (scheme: WeeklyTopSchemesEntity | OtherSchemeEntityOrSchemeInfoEntity) => {
		dispatch('schemeSelect', {
			schemeCode: scheme?.schemeCode,
			isin: scheme?.isin
		});
		toggleModal();
	};

	const handleSchemeSelected = (
		scheme: WeeklyTopSchemesEntity | OtherSchemeEntityOrSchemeInfoEntity,
		index: number
	) => {
		if (showAddFunds) {
			const eventMetaData = {
				suggestedFund: scheme?.schemeName,
				suggestedFundRank: index + 1
			};
			suggestedFundnameClickEvent(eventMetaData);
		} else if (showSearch) {
			const eventMetaData = {
				searchSelectFundname: scheme?.schemeName,
				searchSelectFundnameIsin: scheme?.isin,
				searchSelectFundRank: index + 1
			};
			searchedFundnameSelectClickEvent(eventMetaData);
		}
		schemeSelected(scheme);
	};

	const getFundComparisonsData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/comparisons`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: FundComparisons = res.data;

		suggestedSchemes = holdingData?.otherScheme;
	};
	const getWeeklyTopSchemes = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL_V2}/schemes/dashboard?options=true`;
		const res = await useFetch(url, {}, fetch);

		suggestedSchemes = res?.data?.weeklyTopSchemes;
	};

	onMount(() => {
		if (isin) {
			getFundComparisonsData();
		} else {
			getWeeklyTopSchemes();
		}
		addFundsScreenImpressionEvent();
	});

	const checkSchemeAlreadySelected = (scheme: SchemeDetails) => {
		let isSchemeAlreadySelected = false;

		selectedSchemesList?.forEach((selectedScheme) => {
			if (
				selectedScheme?.isin === scheme?.isin &&
				selectedScheme?.schemeCode === scheme?.schemeCode
			) {
				isSchemeAlreadySelected = true;
			}
		});

		return isSchemeAlreadySelected;
	};

	export { showModal, firstFund, isin, selectedSchemesList };
</script>

<Modal isModalOpen={showModal} on:backdropclicked={toggleModal}>
	{#if showAddFunds}
		<!-- Add Similar Funds -->
		<div
			class="w-full origin-top rounded-lg bg-background-alt transition duration-100 md:w-[460px] lg:overflow-hidden"
		>
			<header class="z-[70] flex-shrink-0 bg-background-alt shadow-clg">
				<section
					class="flex items-center justify-start bg-background-alt px-3 py-4 text-center shadow-csm"
				>
					{#if firstFund}
						<h1 class="text-lg font-medium text-title">Add Fund</h1>
					{:else}
						<h1 class="text-lg font-medium text-title">Add Fund to Compare</h1>
					{/if}
				</section>
			</header>
			<div class="origin-top rounded-t-md bg-background-alt px-4 text-body transition duration-100">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="flex rounded-lg border py-4 md:cursor-pointer" on:click={toggleAddFunds}>
					<SearchIcon class="mx-4 text-title" />
					<span class="">Search by fund name, type or AMC</span>
				</div>
				<p class="my-4 text-center">or</p>
				{#if firstFund}
					<p class="mb-4 text-sm font-normal">Suggested Funds</p>
				{:else}
					<p class="mb-4 text-sm font-normal">Similar to your current fund(s)</p>
				{/if}

				<div>
					{#if !suggestedSchemes?.length}
						<SuggestedFundsLoader />
					{:else}
						{#each suggestedSchemes as scheme, idx (idx)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							{#if !checkSchemeAlreadySelected(scheme)}
								<div
									on:click|preventDefault={() => {
										handleSchemeSelected(scheme, idx);
									}}
								>
									<SchemeCard
										preloadData="off"
										schemes={scheme}
										titleClass="lg:flex-wrap"
										class="my-4 w-full pr-2"
									>
										<div slot="chip-overview" />
										<div slot="rating" />
									</SchemeCard>
								</div>
							{/if}
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{:else if showSearch}
		<!-- Search Funds -->
		<div
			class="h-full w-full origin-top rounded-lg bg-background-alt transition duration-100 md:h-[530px] md:w-[460px] lg:overflow-hidden"
		>
			<header class="z-[70] flex-shrink-0 bg-background-alt shadow-clg">
				<section
					class="flex items-center justify-start bg-background-alt px-3 py-4 text-center shadow-csm"
				>
					<LeftArrowIcon class="mr-4 cursor-pointer" onClick={toggleAddFunds} />
					<h1 class="text-lg font-medium text-title">Search Fund</h1>
					<WMSIcon
						name="cross-circle"
						class="ml-auto hidden cursor-default md:block lg:cursor-pointer"
						on:click={toggleModal}
					/>
				</section>
			</header>
			<div class="origin-top rounded-t-md bg-background-alt transition duration-100">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<SearchComponent
					class="rounded-t-md bg-background-alt"
					searchPageLoaded={true}
					shouldFetchSearchDashboard={false}
					initialSearchText="ALL"
					parentResultClass="lg:!w-full"
					searchInputClass="lg:!w-full"
					searchMode="switch"
				>
					<svelte:fragment slot="resultsData" let:resultsData>
						<section
							class="flex items-center justify-between px-3 py-2 pt-2 text-xs md:px-0 lg:pt-2"
						>
							<div class="font-normal text-body">Fund Name</div>
							<div class="text-primary">3Y Returns</div>
						</section>
						<section class="absolute left-0 h-screen w-screen overflow-x-hidden md:w-full md:pb-20">
							{#each resultsData || [] as scheme, idx (idx)}
								{#if !checkSchemeAlreadySelected(scheme)}
									<article
										class="!m-3 flex cursor-pointer justify-between gap-2 !border-b border-border p-0 pb-4 lg:!m-2 lg:!border-border lg:p-2"
										on:click|preventDefault={() => {
											handleSchemeSelected(scheme, idx);
										}}
									>
										<SchemeCard
											preloadData="off"
											schemes={scheme}
											titleClass="lg:flex-wrap"
											class="w-9/12 pr-2"
										>
											<svelte:fragment slot="chip-overview">
												<ChipOverview
													headingPrimary={scheme?.categoryName}
													headingSecondary={scheme?.subcategoryName}
													class="lg:flex-wrap"
												/>
											</svelte:fragment>
											<div slot="rating" />
										</SchemeCard>
										<div class="flex w-3/12 items-center justify-end text-center text-title">
											{scheme?.returns3yr ? `${scheme?.returns3yr.toFixed(1)}%` : '-'}
										</div>
									</article>
								{/if}
							{/each}
						</section>
					</svelte:fragment>
				</SearchComponent>
			</div>
		</div>
	{/if}
</Modal>
