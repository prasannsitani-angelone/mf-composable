<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from '$components/Button.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import Mandate from '$components/mandate/Mandate.svelte';
	import { onMount } from 'svelte';
	import AutopaySetupTile from '../../ordersummary/AutopaySetupTile/AutopaySetupTile.svelte';
	import HeaderComponent from '../../ordersummary/Header/HeaderComponent.svelte';
	import OrdersTile from '../components/OrdersTile.svelte';
	import type { PageData } from './$types';
	import {
		goToOrders,
		mountAnalytics,
		setUpAutoPayClickAnalytics
	} from '../analytics/ordersummary';

	export let data: PageData;

	onMount(async () => {
		const ordersData = await data.api.ordersData;
		mountAnalytics({
			NoOfunds: ordersData?.data?.data?.checkedOutItems?.length,
			TotalAmount: ordersData?.totalAmount
		});
	});

	let mandateInstance = null;

	const navigateToOrders = async () => {
		goToOrders();
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};

	const onRefresh = async () => {
		invalidate('app:cart:ordersummary');
	};

	const navigateToEmandate = () => {
		setUpAutoPayClickAnalytics();
		mandateInstance.startProcess();
	};
</script>

<article class="flex h-full flex-col sm:h-max">
	{#await data.api.ordersData}
		<LoadingIndicator svgClass="!w-12 !h-12" class="self-center" />
	{:then ordersData}
		{#if ordersData.ok}
			<div class="flex h-full flex-col overflow-hidden sm:h-max sm:overflow-auto">
				<HeaderComponent
					heading={ordersData.headerContent?.heading}
					subHeadingArr={ordersData.headerContent?.subHeadingArr}
					subHeaderClass={ordersData.headerContent?.subHeaderClass}
					status={ordersData.headerContent?.status}
					clazz="border-b border-grey-line sm:border-b-0"
				/>
				<div
					class="my-2 ml-2 mr-2 flex flex-1 flex-col overflow-auto sm:m-0 sm:my-3 sm:flex-initial sm:overflow-visible"
				>
					<OrdersTile
						items={ordersData?.data?.data?.checkedOutItems?.length}
						totalAmount={ordersData.totalAmount}
						onClick={navigateToOrders}
						schemeLogoUrl={ordersData.schemeLogoUrl}
					/>
				</div>
				{#if !ordersData.isMandateLinked && ordersData.investmentType === 'SIP'}
					<AutopaySetupTile onSubmit={navigateToEmandate} />
				{/if}
			</div>
			<Mandate
				bind:this={mandateInstance}
				amount={ordersData.totalAmount?.toString()}
				successButtonTitle="GO TO ORDERS"
				onSuccess={navigateToOrders}
			/>
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
</article>
