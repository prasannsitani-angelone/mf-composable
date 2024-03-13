<script lang="ts">
	import Link from '$components/Link.svelte';
	import NoOrders from '$components/NoOrders.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import MostBought from '$components/MostBought/MostBought.svelte';
	import type { PageData } from '../../../../../$types';
	let data: PageData;
	const classes = {
		header: 'p-4',
		container: `!pb-0 ${$$props.class}`
	};
	export { data };
</script>

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
