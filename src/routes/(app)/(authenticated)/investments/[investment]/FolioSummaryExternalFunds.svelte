<script lang="ts">
	import { onMount } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import Card from '$components/Card.svelte';
	import FolioHeadExternalInvestments from './components/FolioHeadExternalInvestments.svelte';
	import FolioDistributionExternalFunds from './components/FolioDistributionExternalFunds.svelte';
	import type { FolioHoldingType, DistributorListEntity } from '$lib/types/IInvestments';
	import { investmentDetailsExternalFolioSection } from '../analytics';

	const dispatch = createEventDispatcher();

	export let folioDetails: FolioHoldingType;
	export let isPartialImport: boolean;

	let distributorsData = folioDetails?.distributors || [];

	const initialVisibleList = 3;

	let showAllDistributorList = false;

	let modifiedDistributorList: DistributorListEntity[];
	$: modifiedDistributorList = distributorsData?.slice(0, initialVisibleList) || [];

	const toggleDistributorList = () => {
		showAllDistributorList = !showAllDistributorList;

		if (showAllDistributorList) {
			modifiedDistributorList = distributorsData || [];
		} else {
			modifiedDistributorList = distributorsData?.slice(0, initialVisibleList) || [];
		}

		if (!showAllDistributorList) {
			dispatch('viewHideAllFolioClicked');
		}
	};

	onMount(() => {
		const metaData = {
			Units: folioDetails?.totalUnitsAllocated,
			'Current Nav': folioDetails?.currentNav
		};
		investmentDetailsExternalFolioSection(metaData);
	});
</script>

<Card class="mt-2 !p-0 lg:mt-4">
	<svelte:fragment slot="header">
		<FolioHeadExternalInvestments data={folioDetails} {isPartialImport} />
	</svelte:fragment>
	{#if folioDetails?.distributors?.length}
		<section>
			{#if distributorsData.length > 0}
				<FolioDistributionExternalFunds distributorList={modifiedDistributorList} />
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			{#if distributorsData.length > 3}
				<div
					class=" flex cursor-pointer items-center justify-center border-t py-5 text-sm font-medium text-primary"
					on:click={toggleDistributorList}
				>
					{#if !showAllDistributorList}
						<div>SHOW MORE FOLIOS</div>
						<div><WMSIcon width={14} height={7} name="arrow-expand" class="ml-2" /></div>
					{:else}
						<div>SHOW LESS FOLIOS</div>
						<div><WMSIcon width={14} height={7} name="arrow-collapse" class="ml-2" /></div>
					{/if}
				</div>
			{/if}
		</section>
	{/if}
</Card>
