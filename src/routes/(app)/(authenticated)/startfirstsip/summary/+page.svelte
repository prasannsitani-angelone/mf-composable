<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte/internal';
	import Button from '$components/Button.svelte';
	import SummaryMan from './components/SummaryMan.svelte';
	import CelebrationMessage from './components/CelebrationMessage.svelte';
	import ConfirmationMessage from './components/ConfirmationMessage.svelte';
	import SchemeCard from '../../ordersummary/SchemeCard/SchemeCard.svelte';
	import HeaderComponent from '../../ordersummary/Header/HeaderComponent.svelte';
	import { format } from 'date-fns';
	import {
		onOrderSummaryScreenAnalytics,
		onGotoOrdersClickAnalytics
	} from '$lib/analytics/startFirstSip/payment';

	export let data;

	const navigateToOrders = async () => {
		const orderSummaryData = await data.api.ordersData;

		const eventMetaData = {
			FundISIN: orderSummaryData.schemeDetails?.isin,
			MontlyAmount: orderSummaryData.amount
		};

		onGotoOrdersClickAnalytics(eventMetaData);
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};

	const onRefresh = async () => {
		invalidate('app:firstsip:ordersummary');
	};

	onMount(async () => {
		const orderSummaryData = await data.api.ordersData;

		const eventMetaData = {
			status: orderSummaryData.headerContent?.status,
			FundISIN: orderSummaryData.schemeDetails?.isin,
			MontlyAmount: orderSummaryData.amount,
			SIPDate: format(new Date(orderSummaryData.nextSipDate), 'dd-MM-yyyy'),
			message: orderSummaryData.headerContent?.subHeadingArr[0]?.text || ''
		};
		onOrderSummaryScreenAnalytics(eventMetaData);
	});
</script>

<section class="ml-[calc(50%-50vw)] w-screen">
	{#await data.api.ordersData}
		<div>Loading....</div>
	{:then orderSummaryData}
		{#if orderSummaryData?.ok}
			{#if orderSummaryData.headerContent?.status === 'SUCCESS'}
				<section class=" m-auto">
					<section class=" bg-white py-3">
						<CelebrationMessage />
						<SummaryMan class=" m-auto" />
						<ConfirmationMessage details={orderSummaryData.headerContent} />
					</section>
					<section class="flex flex-1 flex-col overflow-auto px-2">
						<SchemeCard
							logoUrl={orderSummaryData.schemeDetails?.logoUrl}
							schemePlan={orderSummaryData.schemeDetails?.schemePlan}
							schemeName={orderSummaryData.schemeDetails?.schemeName}
							schemeCardItems={orderSummaryData.schemeCardItems}
							clazz="mt-2 shadow-csm"
						/>
					</section>
				</section>
			{:else}
				<div class="flex h-full flex-col overflow-hidden">
					<HeaderComponent
						heading={orderSummaryData.headerContent?.heading}
						subHeadingArr={orderSummaryData.headerContent?.subHeadingArr}
						subHeaderClass={orderSummaryData.headerContent?.subHeaderClass}
						status={orderSummaryData.headerContent?.status}
						clazz="sm:ml-2 sm:mr-2 border-b border-grey-line sm:border-b-0"
					/>
					<div class="flex flex-1 flex-col overflow-auto px-2">
						<SchemeCard
							logoUrl={orderSummaryData.schemeDetails?.logoUrl}
							schemePlan={orderSummaryData.schemeDetails?.schemePlan}
							schemeName={orderSummaryData.schemeDetails?.schemeName}
							schemeCardItems={orderSummaryData.schemeCardItems}
							clazz="mt-2 shadow-csm"
						/>
					</div>
				</div>
			{/if}
			<div class=" text-center">
				<Button onClick={navigateToOrders} variant="transparent">VIEW ORDER DETAILS</Button>
			</div>
		{:else}
			<div class="flex h-full flex-col items-center self-center px-4 py-4">
				<div class="mb-4 text-center text-base font-medium text-black-title">
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
			<div class="mb-4 text-center text-base font-medium text-black-title">
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
</section>
