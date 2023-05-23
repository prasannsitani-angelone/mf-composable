<script lang="ts">
	import { page } from '$app/stores';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import type { IOrderDetails } from '$lib/types/IOrderDetails';
	import { WMSIcon } from 'wms-ui-component';
	import type { IStatusItem } from '../../../orders/[orderId]/type';
	import { createEventDispatcher } from 'svelte';
	import ORDER_DATA from '$lib/constants/orderDataItems';

	export let ordersData: IOrderDetails | undefined;
	export let statusItems: Array<IStatusItem> | undefined;
	export let amountTitle = '';
	export let displayAmountUnit = '';
	export let sectionTitle = 'Withdrawal Details';

	const dispatch = createEventDispatcher();

	let isMobile = $page?.data?.deviceType?.isMobile;

	const copyToClipboard = (value: string) => {
		navigator?.clipboard?.writeText(value);
	};

	const infoIconClick = () => {
		dispatch('infoIconClick');
	};
</script>

<section class="mx-2 mt-2 mb-2 rounded-lg bg-white p-4 shadow-csm md:mx-0 md:mt-4 md:p-6 md:pt-5">
	<div class="pb-2 text-lg font-medium text-black-title md:hidden">
		{sectionTitle}
	</div>

	<article
		class="flex flex-col items-center justify-between rounded rounded-b-none border px-0 py-0 md:flex-row md:px-4 md:py-6"
	>
		<div class="p-3 md:p-0">
			<ResultItem
				data={{
					schemeName: ordersData?.schemeName,
					logoUrl: ordersData?.logoUrl || '',
					arqRating: !isMobile ? ordersData?.arqRating : undefined,
					categoryName: !isMobile ? ordersData?.category : '',
					subcategoryName: !isMobile ? ordersData?.subCategory : '',
					reInvestmentPlan: !isMobile ? ordersData?.reInvestmentPlan : ''
				}}
				logoStyle="w-12 h-12 p-0.5 !mr-2"
				class="!border-b-0 !p-0"
			>
				<svelte:fragment slot="returns">
					<span />
				</svelte:fragment>
			</ResultItem>
		</div>

		<article
			class="flex w-full items-center justify-between border-t px-4 py-3 font-medium text-black-title md:w-fit md:flex-col md:items-end md:border-none md:p-0"
		>
			<div class="text-base md:text-sm md:text-grey-body">
				{amountTitle}
			</div>
			<div class="flex text-2xl">
				{#if ordersData?.amount}
					<span class="mt-0.5 text-base md:mt-0 md:text-2xl">₹</span>
				{/if}
				<span>{displayAmountUnit}</span>
			</div>
		</article>
	</article>
	<section
		class="flex flex-col items-center justify-between rounded-b border border-t-0 md:flex-row md:items-stretch md:bg-grey-light md:px-6 md:py-4"
	>
		{#each statusItems || [] as item, index (item?.title)}
			<article
				class="flex w-full items-center justify-between bg-grey-light px-4 py-2 md:flex-col md:justify-start {index
					? 'border-t md:border-t-0 md:border-l'
					: ''} {index === statusItems?.length - 1 ? 'rounded-b' : ''}"
			>
				<div class="flex items-center text-sm text-grey-body md:mb-1 md:text-xs md:font-medium">
					{item?.title}
					{#if item?.title === ORDER_DATA?.EXPECTED_NAV_DATE}
						<WMSIcon
							width={14}
							height={14}
							name="info-in-circle"
							class="ml-1 cursor-default md:cursor-pointer"
							on:click={infoIconClick}
						/>
					{/if}
				</div>
				{#if !item?.node}
					<div class="flex items-center text-base font-medium text-black-title md:text-sm">
						{#if item?.title === ORDER_DATA?.TRANSACTION_ID}
							<WMSIcon
								class="mr-2 cursor-pointer active:opacity-50"
								on:click={() => copyToClipboard(item?.value)}
								height={16}
								width={17}
								name="copy"
							/>
						{/if}
						{item?.value}
					</div>
				{:else}
					<div class="text-base font-medium text-black-title md:text-sm">
						{@html item?.value}
					</div>
				{/if}
			</article>
		{/each}
	</section>
</section>
