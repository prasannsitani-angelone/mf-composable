<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Dashboard from './OrdersDashboard/Dashboard.svelte';
	import OrderDashboardLoader from './OrdersDashboard/OrderDashboardLoader.svelte';
	import DateFns from '$lib/utils/asyncDateFns';
	export let data: PageData;

	onMount(async () => {
		await DateFns.init();
	});
</script>

{#await data?.api?.getOrdersData}
	<OrderDashboardLoader />
{:then ordersData}
	<Dashboard
		ordersSummary={ordersData?.ordersSummary}
		inProgressOrders={ordersData?.inProgressOrders}
		failedOrders={ordersData?.failedOrders}
		compeletedOrders={ordersData?.completedOrders}
		{data}
	/>
{/await}
