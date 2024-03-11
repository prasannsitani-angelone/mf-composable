<script lang="ts">
	import Link from '$components/Link.svelte';
	import NoOrders from '$components/NoOrders.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import MostBought from '$components/MostBought/MostBought.svelte';
	import type { PageData } from '../../../../../$types';
	import OrderFilter from './OrderFilter/OrderFilter.svelte';
	import type { OrdersSummary } from '$lib/types/IInvestments';
	import { onMount } from 'svelte';
	import { filterStore } from '$lib/stores/FilterStore';
	let data: PageData;
	const classes = {
		header: 'p-4',
		container: `!pb-0 ${$$props.class}`
	};
	export { data };
	const ordersSummary: OrdersSummary = {
		totalFailedOrders: 0,
		totalProcessingOrders: 0,
		totalScheduledOrders: 0,
		totalCompletedOrders: 0
	};

	onMount(() => {
		const filters = { failed: true, completed: true, inprogress: true };
		filterStore.updateStore(filters);
	});
</script>

<article class="block md:hidden">
	<OrderFilter {ordersSummary} />
</article>
<article class="hidden md:block">
	<NoOrders title="You do not have any orders currently. Explore funds and place an order" />
</article>
<article class="mt-2 {$$props.class}">
	<NoOrders
		class="block md:hidden"
		title="You do not have any orders currently. Explore funds and place an order"
	/>
	{#if data?.searchDashboardData?.weeklyTopSchemes}
		<MostBought
			tableData={data.searchDashboardData.weeklyTopSchemes}
			{classes}
			title="Popular Funds"
		>
			<footer class="mt-3 border-t py-5" slot="footer">
				<div
					class=" flex cursor-pointer items-center justify-center text-sm font-medium uppercase text-primary"
				>
					<Link to={`/categories?id=19`} class="flex items-center">
						<span class="uppercase">explore funds</span>
						<RightIcon class="ml-2" stroke="#3F5BD9" />
					</Link>
				</div>
			</footer>
		</MostBought>
	{/if}
</article>
