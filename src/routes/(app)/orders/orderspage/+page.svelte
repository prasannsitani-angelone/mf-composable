<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Dashboard from './OrdersDashboard/Dashboard.svelte';
	import OrderDashboardLoader from './OrdersDashboard/OrderDashboardLoader.svelte';
	import { ordersDashboardScreenOpenAnalytics } from '$lib/analytics/orders/orders';
	import DateFns from '$lib/utils/asyncDateFns';
	export let data: PageData;

	onMount(async () => {
		ordersDashboardScreenOpenAnalytics();
		await DateFns.init();
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
