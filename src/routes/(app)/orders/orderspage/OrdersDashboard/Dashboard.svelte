<script lang="ts">
	import type { OrdersSummary } from '$lib/types/IInvestments';
	import type { orderItem } from '$lib/types/IOrderItem';
	import InProgress from './InProgress.svelte';
	import FailedOrders from './FailedOrders.svelte';
	import type { PageData } from '../../../../$types';
	import NoOrdersPage from './NoOrdersPage.svelte';
	let ordersSummary: OrdersSummary;
	let ordersDataFetched = false;
	let inProgressOrders: orderItem[];
	let failedOrders: orderItem[];
	let data: PageData;
	export { ordersSummary, ordersDataFetched, inProgressOrders, failedOrders, data };
</script>

{#if ordersSummary?.totalProcessingOrders || ordersSummary?.totalFailedOrders}
	<article>
		<InProgress {ordersSummary} {inProgressOrders} />
		<FailedOrders {ordersSummary} {failedOrders} />
	</article>
{:else if ordersDataFetched}
	<NoOrdersPage {data} />
{/if}
