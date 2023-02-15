<script lang="ts">
	import NoOrders from '$lib/components/NoOrders.svelte';
	import StatusCard from '$lib/components/Orders/StatusCard.svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import { onMount } from 'svelte';
	let orders: string | any[] = [];
	onMount(() => {
		useFetch(`/orders?clientCode=A101010`).then((res: any) => {
			orders = res?.orders || [];
		});
	});
</script>

{#if orders.length > 0}
	{#each orders as order (order.id)}
		<StatusCard {order} />
	{/each}
{:else}
	<NoOrders title="You currently don't have any transactions" />
{/if}
