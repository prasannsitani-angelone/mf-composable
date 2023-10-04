<script lang="ts">
	import ChipOverview from '$components/ChipOverview.svelte';
	import SchemeCard from '$components/SchemeCard.svelte';
	import SearchComponent from '$components/Search/SearchComponent.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import CrossIcon from '$lib/images/icons/CrossIcon.svelte';
	import type { WeeklyTopSchemesEntity } from '$lib/types/IDiscoverFunds';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { useFetch } from '$lib/utils/useFetch';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	/* eslint-disable @typescript-eslint/no-empty-function */
	let amccode: string;
	let isin: string;
	let toggleModal = () => {};
	/* eslint-enable @typescript-eslint/no-empty-function */
	const switchSchemeSelected = async (scheme: WeeklyTopSchemesEntity) => {
		const fundUrl = `${PUBLIC_MF_CORE_BASE_URL}/schemes/${scheme.isin}/${scheme.schemeCode}`;
		const res = await useFetch(fundUrl, {});
		let schemeData: SchemeDetails = {};
		if (res.ok) {
			schemeData = res?.data;
		}

		dispatch('optInSwitchScheme', schemeData);
		toggleModal();
	};

	export { toggleModal, amccode, isin };
</script>

<div class="h-screen w-full origin-top bg-white transition duration-100 lg:overflow-hidden">
	<header class="z-[70] flex-shrink-0 bg-white shadow-clg">
		<section
			class="flex items-center justify-start bg-white px-3 py-4 text-center shadow-csm md:hidden"
		>
			<CrossIcon onClick={toggleModal} />
			<h1 class="ml-4 text-lg font-normal text-black-title">
				<div class="w-80 truncate text-left">Select Switch in Fund</div>
			</h1>
		</section>
	</header>
	<div class="origin-top rounded-t-md bg-white transition duration-100">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<SearchComponent
			class="rounded-t-md bg-white"
			searchPageLoaded={true}
			shouldFetchSearchDashboard={false}
			initialSearchText="ALL"
			parentResultClass="lg:!w-full"
			searchInputClass="lg:!w-full"
			filter="amccode:{amccode},switchflag:Y,purchaseallowed:Y,NOT isin: {isin}"
			searchMode="switch"
		>
			<svelte:fragment slot="resultsData" let:resultsData>
				<section class="flex items-center justify-between px-3 py-2 pt-2 text-xs md:px-0 lg:pt-2">
					<article>
						<span class="font-normal text-grey-body"> Available mutual funds from AMC </span>
					</article>
					<article><span class="text-grey-body"> 3Y Returns </span></article>
				</section>
				<section class="absolute left-0 h-screen w-screen overflow-x-hidden md:w-full md:pb-20">
					{#each resultsData || [] as scheme}
						<article
							class="!m-3 flex cursor-pointer justify-between gap-2 !border-b border-grey-line p-0 pb-4 lg:!m-2 lg:!border-grey-line lg:p-2"
							on:click|preventDefault={() => {
								switchSchemeSelected(scheme);
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
