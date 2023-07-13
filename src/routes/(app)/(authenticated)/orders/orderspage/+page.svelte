<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Dashboard from './OrdersDashboard/Dashboard.svelte';
	import OrderDashboardLoader from './OrdersDashboard/OrderDashboardLoader.svelte';
	import DateFns from '$lib/utils/asyncDateFns';
	import { SEO } from 'svelte-components';
	export let data: PageData;

	onMount(async () => {
		await DateFns.init();
	});
</script>

<SEO
	seoTitle="Your Mutual Funds Orders | Angel One"
	seoDescription="Get Access to your Mutual Funds orders here."
/>
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
