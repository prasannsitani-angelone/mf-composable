<script lang="ts">
	import OrderSummaryComponent from './components/OrderSummaryComponent.svelte';
	import { OrderSummaryStatus } from './components/OrderSummaryStatus';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { decodeToObject, encodeObject } from '$lib/utils/helpers/params';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import SkeletonLoader from './components/SkeletonLoader.svelte';
	import OrdersAutoPayComponent from '$components/AutopaySetupTile/OrdersAutoPayComponent.svelte';

	export let data: PageData;

	const params = $page.url.searchParams.get('params') || '';
	const decodedParams = decodeToObject(params);
	const { sipID } = decodedParams;

	function getStatusEnum(paymentStatus: string) {
		return OrderSummaryStatus[paymentStatus.toUpperCase()] ?? OrderSummaryStatus.PENDING;
	}

	const navigateToOrders = async () => {
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};

	const navigateToEmandate = (amount, date) => {
		const params = encodeObject({
			amount: amount,
			date: date,
			sipID: sipID
		});
		goto(`${base}/autopay/manage?params=${params}`);
	};
</script>

{#await data?.api.orderStatus}
	<SkeletonLoader />
{:then orderStatus}
	{@const { totalAmount, nextSipDueDate, isMandateLinked } = orderStatus}
	<OrderSummaryComponent
		status={getStatusEnum(orderStatus.paymentStatus)}
		sipAmount={totalAmount}
		class="mt-3"
		sipNextDate={nextSipDueDate}
	/>

	{#if !isMandateLinked}
		<div class="mx-2">
			<OrdersAutoPayComponent
				{sipID}
				class="mb-2 mt-2"
				amount={totalAmount}
				on:autoPayClick={() => navigateToEmandate(totalAmount, nextSipDueDate)}
			/>
		</div>
	{:else}
		<div class="flex justify-center bg-background-alt pb-4">
			<ButtonMedium variant="transparent" class="w-max" onClick={navigateToOrders}>
				GO TO ORDERS
			</ButtonMedium>
		</div>
	{/if}
{/await}
