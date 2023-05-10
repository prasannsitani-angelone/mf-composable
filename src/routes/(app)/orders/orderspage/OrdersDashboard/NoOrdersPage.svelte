<script lang="ts">
	import Link from '$components/Link.svelte';
	import NoOrders from '$components/NoOrders.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import type { PageData } from '../../../../$types';
	import TrendingFunds from '../../../discoverfunds/TrendingFunds/TrendingFunds.svelte';
	let data: PageData;
	const classes = {
		header: 'p-4 pb-0',
		container: `!pb-0 ${$$props.class}`
	};
	export { data };
</script>

<article class="hidden md:block">
	<NoOrders title="You don't have any orders currently" />
</article>
<article class="mt-2 {$$props.class}">
	<NoOrders class="block md:hidden" title="You don't have any orders currently" />
	{#if data?.searchDashboardData?.weeklyTopSchemes}
		<TrendingFunds
			tableData={data.searchDashboardData.weeklyTopSchemes}
			{classes}
			title="Popular Funds"
		>
			<footer class="mt-3 border-t border-grey-line py-5" slot="footer">
				<div
					class=" flex cursor-pointer items-center justify-center text-sm font-semibold uppercase text-blue-primary"
				>
					<Link
						to={`/explorefunds/${data?.searchDashboardData?.searchOptions[0]?.name
							?.split(' ')
							.join('-')
							.toLowerCase()}?id=${data?.searchDashboardData?.searchOptions[0]?.id}`}
						class="flex items-center"
					>
						<span class="uppercase">explore funds</span>
						<RightIcon class="ml-2" stroke="#3F5BD9" />
					</Link>
				</div>
			</footer>
		</TrendingFunds>
	{/if}
</article>
