<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import TrendingFundsItemTile from './TrendingFundsItemTile.svelte';
	import type { TrendingFund } from '$lib/types/ITrendingFunds';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	export let fundList: TrendingFund[];

	$: viewCount = fundList.reduce((acc, { viewCount }) => acc + viewCount, 0);
</script>

<section class="my-2 max-w-4xl rounded-lg bg-background-alt px-4 py-3 shadow-csm {$$props.class}">
	<header class="mb-2 flex justify-between" data-testid="trending-funds">
		<h2 class="text-base font-medium text-title">Trending</h2>
		<div
			class="flex items-center rounded bg-tint12-secondary-alt p-1 text-xs font-normal text-secondary-alt"
		>
			<WMSIcon stroke="var(--SECONDARY-ALT)" name="graph-up" height={12} width{12} class="-ml-1" />
			{addCommasToAmountString(viewCount)} people viewing
		</div>
	</header>
	<article class="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
		{#each fundList as fund (fund?.isin)}
			<TrendingFundsItemTile {fund} />
		{/each}
	</article>
</section>
