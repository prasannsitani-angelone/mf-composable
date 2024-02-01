<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import OrderSummaryHeader from '$components/OrderSummary/OrderSummaryHeader.svelte';
	import type { PageData } from './$types';
	import { encodeObject } from '$lib/utils/helpers/params';
	import PageTitle from '$components/PageTitle.svelte';
	import AutopayTimeLineCard from '../../ordersummary/AutopayTimeLine/AutopayTimeLineCard.svelte';
	import OrderSummaryLoader from '../../cart/components/OrderSummaryLoader.svelte';
	import OrdersTile from '../components/OrdersTile.svelte';

	export let data: PageData;

	const navigateToOrders = async () => {
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};
	const navigateToEmandate = (amount) => {
		const params = encodeObject({
			amount: amount
		});
		goto(`${base}/autopay/manage?params=${params}`);
	};
	const onRefresh = async () => {
		invalidate('app:buyportfolio:ordersummary');
	};
</script>

<article class="flex h-full flex-col sm:h-max">
	{#await data.api.ordersData}
		<OrderSummaryLoader />
	{:then ordersData}
		{#if ordersData.ok}
			{@const bulkData = ordersData?.data?.data}
			{@const autopayTimelineItems = ordersData?.autopayTimelineItems}
			{@const headerContent = ordersData?.headerContent}
			<div
				class="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-white sm:h-full sm:overflow-auto md:rounded-lg md:p-2"
			>
				<header class="hidden sm:block">
					<PageTitle title="Order Summary" class="-mx-2 !mt-2 mb-3">
						<svelte:fragment slot="leftTitle">
							<div class="text-lg font-medium text-black-key">Order Summary</div>
						</svelte:fragment>
					</PageTitle>
				</header>
				<OrderSummaryHeader
					heading={headerContent?.heading}
					subHeadingArr={headerContent?.subHeadingArr}
					subHeaderClass={headerContent?.subHeaderClass}
					status={headerContent?.status}
					class="sm:ml-2 sm:mr-2"
				/>
				<div
					class="my-2 ml-2 mr-2 flex flex-1 flex-col overflow-auto sm:m-0 sm:my-3 sm:flex-initial sm:overflow-visible"
				>
					<OrdersTile
						schemeLogoUrl={bulkData?.logoUrl}
						title={bulkData?.packName}
						totalAmount={bulkData?.totalAmount}
					/>
				</div>
				<section class="sticky bottom-0 flex flex-col bg-white shadow-top sm:shadow-none">
					{#if !bulkData?.isMandateLinked}
						<AutopayTimeLineCard {autopayTimelineItems} class="px-4 sm:px-0" />
					{/if}
					<section class="px-4 py-3 shadow-top sm:self-end sm:px-0 sm:shadow-none md:pb-2 md:pt-4">
						{#if !bulkData?.isMandateLinked}
							<Button
								variant="contained"
								onClick={() => navigateToEmandate(bulkData?.totalAmount)}
								class="w-full self-end sm:w-[328px]">SET UP AUTOPAY</Button
							>
						{:else}
							<Button
								variant="outlined"
								class="w-full self-end sm:w-[328px]"
								onClick={navigateToOrders}
							>
								GO TO ORDERS
							</Button>
						{/if}
					</section>
				</section>
			</div>
		{:else}
			<div class="flex h-full flex-col items-center self-center px-4 py-4">
				<div class="mb-4 text-center text-base font-normal text-black-title">
					We are facing some issue at our end. Please try again or contact field support
				</div>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
					REFRESH
				</Button>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={navigateToOrders}>
					GO TO ORDERS
				</Button>
			</div>
		{/if}
	{:catch}
		<div class="flex h-full flex-col items-center self-center px-4 py-4">
			<div class="mb-4 text-center text-base font-normal text-black-title">
				We are facing some issue at our end. Please try again or contact field support
			</div>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
				REFRESH
			</Button>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={navigateToOrders}>
				GO TO ORDERS
			</Button>
		</div>
	{/await}
</article>
