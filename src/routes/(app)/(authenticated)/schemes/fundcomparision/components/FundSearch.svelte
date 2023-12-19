<script lang="ts">
	import ChipOverview from '$components/ChipOverview.svelte';
	import Modal from '$components/Modal.svelte';
	import type {
		FundComparisons,
		OtherSchemeEntityOrSchemeInfoEntity
	} from '$components/Scheme/types';
	import SchemeCard from '$components/SchemeCard.svelte';
	import SearchComponent from '$components/Search/SearchComponent.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import SearchIcon from '$lib/images/icons/SearchIcon.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import { useFetch } from '$lib/utils/useFetch';
	import { createEventDispatcher, onMount } from 'svelte';
	import { WMSIcon } from 'svelte-components';

	const dispatch = createEventDispatcher();

	let showModal = false;
	let showAddFunds = true;
	let showSearch = false;
	let firstFund = false;
	let isin = 'INF200KA1DB2'; //update default value
	let comparisons: OtherSchemeEntityOrSchemeInfoEntity[] = [];

	const toggleModal = () => {
		dispatch('close');
	};
	const toggleAddFunds = () => {
		showAddFunds = !showAddFunds;
		showSearch = !showSearch;
	};

	const schemeSelected = (scheme: WeeklyTopSchemesEntity) => {
		dispatch('schemeSelect', { schemeCode: scheme?.schemeCode, isin: scheme?.isin });
		toggleModal();
	};

	const getFundComparisonsData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${isin}/comparisons`;
		const res = await useFetch(url, {}, fetch);
		const holdingData: FundComparisons = res.data;

		comparisons = holdingData?.otherScheme;
	};

	onMount(() => {
		getFundComparisonsData();
	});

	export { showModal, firstFund, isin };
</script>

<Modal isModalOpen={showModal} on:backdropclicked={toggleModal}>
	{#if showAddFunds}
		<!-- Add Similar Funds -->
		<div
			class="w-full origin-top rounded-lg bg-white transition duration-100 md:w-[460px] lg:overflow-hidden"
		>
			<header class="z-[70] flex-shrink-0 bg-white shadow-clg">
				<section class="flex items-center justify-start bg-white px-3 py-4 text-center shadow-csm">
					{#if firstFund}
						<h1 class="text-lg font-medium text-black-key">Add Fund</h1>
					{:else}
						<h1 class="text-lg font-medium text-black-key">Add Fund to Compare</h1>
					{/if}
				</section>
			</header>
			<div class="origin-top rounded-t-md bg-white px-4 transition duration-100">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="flex rounded-lg border border-grey-line py-4 md:cursor-pointer"
					on:click={toggleAddFunds}
				>
					<SearchIcon class="mx-4" />
					<span class="">Search by fund name, type or AMC</span>
				</div>
				<p class="my-4 text-center">or</p>
				{#if firstFund}
					<p class="mb-4 text-sm font-normal">Suggested Funds</p>
				{:else}
					<p class="mb-4 text-sm font-normal">Similar to your current fund(s)</p>
				{/if}

				<div>
					{#each comparisons as scheme, idx (idx)}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							on:click|preventDefault={() => {
								schemeSelected(scheme);
							}}
						>
							<SchemeCard schemes={scheme} titleClass="lg:flex-wrap" class="my-4 w-full pr-2">
								<div slot="chip-overview" />
								<div slot="rating" />
							</SchemeCard>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else if showSearch}
		<!-- Search Funds -->
		<div
			class="h-full w-full origin-top rounded-lg bg-white transition duration-100 md:h-[530px] md:w-[460px] lg:overflow-hidden"
		>
			<header class="z-[70] flex-shrink-0 bg-white shadow-clg">
				<section class="flex items-center justify-start bg-white px-3 py-4 text-center shadow-csm">
					<LeftArrowIcon class="mr-4 cursor-pointer" onClick={toggleAddFunds} />
					<h1 class="text-lg font-medium text-black-key">Search Fund</h1>
					<WMSIcon
						name="cross-circle"
						class="ml-auto hidden cursor-default md:block lg:cursor-pointer"
						on:click={toggleModal}
					/>
				</section>
			</header>
			<div class="origin-top rounded-t-md bg-white transition duration-100">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<SearchComponent
					class="rounded-t-md bg-white"
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
							<div class="font-normal text-grey-body">Fund Name</div>
							<div class="text-primary">3Y Returns</div>
						</section>
						<section class="absolute left-0 h-screen w-screen overflow-x-hidden md:w-full md:pb-20">
							{#each resultsData || [] as scheme}
								<article
									class="!m-3 flex cursor-pointer justify-between gap-2 !border-b border-grey-line p-0 pb-4 lg:!m-2 lg:!border-grey-line lg:p-2"
									on:click|preventDefault={() => {
										schemeSelected(scheme);
									}}
								>
									<SchemeCard schemes={scheme} titleClass="lg:flex-wrap" class="w-9/12 pr-2">
										<svelte:fragment slot="chip-overview">
											<ChipOverview
												headingPrimary={scheme?.categoryName}
												headingSecondary={scheme?.subcategoryName}
												class="lg:flex-wrap"
											/>
										</svelte:fragment>
										<div slot="rating" />
									</SchemeCard>
									<div class="flex w-3/12 items-center justify-end text-center">
										{scheme?.returns3yr?.toFixed(2)} %
									</div>
								</article>
							{/each}
						</section>
					</svelte:fragment>
				</SearchComponent>
			</div>
		</div>
	{/if}
</Modal>
