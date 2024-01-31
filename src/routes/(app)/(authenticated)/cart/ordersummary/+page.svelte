<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import { onMount } from 'svelte';
	import OrderSummaryHeader from '$components/OrderSummary/OrderSummaryHeader.svelte';
	import OrdersTile from '../components/OrdersTile.svelte';
	import type { PageData } from './$types';
	import { goToOrders, mountAnalytics } from '../analytics/ordersummary';
	import OrderSummaryLoader from '../components/OrderSummaryLoader.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import PageTitle from '$components/PageTitle.svelte';
	import AutopayTimeLineCard from '../../ordersummary/AutopayTimeLine/AutopayTimeLineCard.svelte';

	export let data: PageData;

	onMount(async () => {
		const ordersData = await data.api.ordersData;
		mountAnalytics({
			NoOfunds: ordersData?.data?.data?.checkedOutItems?.length,
			TotalAmount: ordersData?.totalAmount
		});
	});

	const navigateToOrders = async () => {
		goToOrders();
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};

	const onRefresh = async () => {
		invalidate('app:cart:ordersummary');
	};

	const navigateToEmandate = (amount) => {
		const params = encodeObject({
			amount: amount
		});
		goto(`${base}/autopay/manage?params=${params}`);
	};
</script>

<article class="flex h-full flex-col sm:h-max">
	{#await data.api.ordersData}
		<OrderSummaryLoader />
	{:then ordersData}
		{#if ordersData.ok}
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
					heading={ordersData.headerContent?.heading}
					subHeadingArr={ordersData.headerContent?.subHeadingArr}
					subHeaderClass={ordersData.headerContent?.subHeaderClass}
					status={ordersData.headerContent?.status}
					class="sm:ml-2 sm:mr-2"
				/>
				<div
					class="my-2 ml-2 mr-2 flex flex-1 flex-col overflow-auto sm:m-0 sm:my-3 sm:flex-initial sm:overflow-visible"
				>
					<OrdersTile
						items={ordersData?.data?.data?.checkedOutItems?.length}
						totalAmount={ordersData.totalAmount}
						schemeLogoUrl={ordersData.schemeLogoUrl}
					/>
				</div>
				<section class="sticky bottom-0 flex flex-col bg-white shadow-top sm:shadow-none">
					{#if !ordersData.isMandateLinked && ordersData.investmentType === 'SIP'}
						<AutopayTimeLineCard
							autopayTimelineItems={ordersData.autopayTimelineItems}
							class="px-4 sm:px-0"
						/>
					{/if}
					<section class="px-4 py-3 shadow-top sm:self-end sm:px-0 sm:shadow-none md:pb-2 md:pt-4">
						{#if !ordersData.isMandateLinked && ordersData.investmentType === 'SIP'}
							<Button
								variant="contained"
								onClick={navigateToEmandate}
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
