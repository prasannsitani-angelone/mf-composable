<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Dashboard from './OrdersDashboard/Dashboard.svelte';
	import OrderDashboardLoader from './OrdersDashboard/OrderDashboardLoader.svelte';
	import DateFns from '$lib/utils/asyncDateFns';
	import { SEO } from 'svelte-components';
	import SomethingWentWrong from '$components/Error/SomethingWentWrong.svelte';
	import { appStore } from '$lib/stores/SparkStore';
	export let data: PageData;

	const resetSelectedLinkedFamilyMembers = () => {
		appStore?.updateStore({ linkedmembers: { selected: [] } });
	};

	onMount(async () => {
		await DateFns.init();

		resetSelectedLinkedFamilyMembers();
	});
</script>

<SEO
	seoTitle="Your Mutual Funds Orders | Angel One"
	seoDescription="Get Access to your Mutual Funds orders here."
/>
{#await data?.api?.getOrdersData}
	<OrderDashboardLoader />
{:then ordersData}
	{#if ordersData instanceof Error}
		<div />
		<SomethingWentWrong />
	{:else}
		<Dashboard
			ordersSummary={ordersData?.ordersSummary}
			inProgressOrders={ordersData?.inProgressOrders}
			failedOrders={ordersData?.failedOrders}
			compeletedOrders={ordersData?.completedOrders}
			{data}
		/>
	{/if}
{/await}
