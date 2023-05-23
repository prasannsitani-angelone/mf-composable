<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import SchemeTable from '$components/SchemeTable.svelte';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import ErrorLoadingComponent from '$components/ErrorLoadingComponent.svelte';
	import ErrorView from '$components/ErrorView.svelte';
	import PortfolioEmptyIcon from '$lib/images/icons/PortfolioEmptyIcon.svelte';

	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	const invalidateFavourites = (event) => {
		const { isFavourite } = event.detail;
		if (!isFavourite) {
			invalidate('favourites');
		}
	};

	const handleErrorNavigation = () => goto(`${base}/discoverfunds`);

	export let data: PageData;
</script>

<article>
	<header class="hidden sm:block">
		<PageTitle title={data.layoutConfig?.title || 'Start SIP'} class="mb-0 sm:mb-4 sm:flex" />
	</header>
	<section class="ml-[calc(50%-50vw)] w-screen shadow-csm sm:ml-0 sm:w-full sm:shadow-none">
		{#await data.api.promotions}
			<TableSkeleton />
		{:then promotions}
			{#if promotions.length}
				<SchemeTable searchOption={promotions} toggleFavourites={invalidateFavourites} />
			{:else}
				<ErrorView
					Icon={PortfolioEmptyIcon}
					heading="No Funds suggestion found"
					contentLine="We could not find any fund suggestions"
					textForButton="DISCOVER FUNDS"
					handleCTAClick={handleErrorNavigation}
				/>
			{/if}
		{:catch}
			<ErrorLoadingComponent
				title="Error Fetching Funds"
				message="We could not fetch fund suggestions due to a technical error. Please try again."
			/>
		{/await}
	</section>
</article>
