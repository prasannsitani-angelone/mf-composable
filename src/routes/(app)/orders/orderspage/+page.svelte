<script lang="ts">
	import type { PageData } from './$types';
	import Dashboard from './OrdersDashboard/Dashboard.svelte';
	export let data: PageData;
</script>

<article>
	<section class="mt-0">
		{#await data?.api?.getOrdersData}
			Loading..........
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
