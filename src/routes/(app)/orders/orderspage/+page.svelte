<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Dashboard from './OrdersDashboard/Dashboard.svelte';
	import TabSelection from './TabSelection/TabSelection.svelte';

	export let data: PageData;

	const handleTabSelection = () => {
		goto(`${base}/orders/orderspage/sipbook`, { replaceState: true });
	};
</script>

<article>
	<TabSelection activeTab="ORDERS" {handleTabSelection} />
	<section class="mt-0 pt-12 pb-8">
		{#await data?.api?.getOrdersData}
			Loading/./.........
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
