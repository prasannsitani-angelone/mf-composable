<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Dashboard from './OrdersDashboard/Dashboard.svelte';
	import OrderDashboardLoader from './OrdersDashboard/OrderDashboardLoader.svelte';
	import { ordersDashboardScreenOpenAnalytics } from '$lib/analytics/orders/orders';
	export let data: PageData;
	onMount(() => {
		ordersDashboardScreenOpenAnalytics();
	});
</script>

<article>
	<section class="mt-0">
		{#await data?.api?.getOrdersData}
			<OrderDashboardLoader />
		{:then ordersData}
			<Dashboard
				ordersSummary={ordersData?.ordersSummary}
				inProgressOrders={ordersData?.inProgressOrders}
				failedOrders={ordersData?.failedOrders}
				{data}
			/>
		{/await}
	</section>
</article>
