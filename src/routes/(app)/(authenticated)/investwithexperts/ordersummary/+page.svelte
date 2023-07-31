<script lang="ts">
	import OrderSummaryComponent from './components/OrderSummaryComponent.svelte';
	import { OrderSummaryStatus } from './components/OrderSummaryStatus';
	import AutopaySetupTile from '$components/AutopaySetupTile/AutopaySetupTile.svelte';
	import Mandate from '$components/mandate/Mandate.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { decodeToObject } from '$lib/utils/helpers/params';
	import { page } from '$app/stores';
	import { Button } from 'svelte-components';
	import { base } from '$app/paths';
	import SkeletonLoader from './components/SkeletonLoader.svelte';

	let mandateInstance = null;

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
		<div class="h-[130px]" />

		<AutopaySetupTile
			clazz="fixed inset-0 top-auto bg-white px-4 pb-5 pt-3"
			onSubmit={() => {
				mandateInstance?.startProcess();
			}}
		/>

		<Mandate
			bind:this={mandateInstance}
			{sipID}
			amount={totalAmount}
			date={nextSipDueDate}
			successButtonTitle="GO TO ORDERS"
			onSuccess={navigateToOrders}
		/>
	{:else}
		<div class="flex justify-center bg-white pb-4">
			<Button variant="transparent" class="w-max" onClick={navigateToOrders}>GO TO ORDERS</Button>
		</div>
	{/if}
{/await}
