<script lang="ts">
	import { ordersTab } from '$lib/constants/tab';
	import Tab from '$lib/components/Tab.svelte';
	import OrderFilter from '../OrdersDashboard/OrderFilter/OrderFilter.svelte';
	import { page } from '$app/stores';
	$: deviceType = $page?.data?.deviceType;
</script>

<Tab activeTab="Orders" tabs={ordersTab} />
{#if deviceType.isMobile}
	{#await $page?.data?.api?.getOrdersData}
		<span />
	{:then ordersData}
		{@const ordersSummary = ordersData?.ordersSummary}
		{#if ordersSummary?.totalProcessingOrders || ordersSummary?.totalFailedOrders || ordersSummary?.totalCompletedOrders}
			<OrderFilter ordersSummary={ordersData?.ordersSummary} />
		{/if}
	{/await}
{/if}
