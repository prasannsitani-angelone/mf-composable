<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import TrendingFundsItemTile from './TrendingFundsItemTile.svelte';
	import type { TrendingFund } from '$lib/types/ITrendingFunds';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import {
		trendingFundsImpressionAnalytics,
		trendingFundsSelectFundAnalytics
	} from '$lib/analytics/trendingFunds/trendingFunds';
	import viewport from '$lib/utils/useViewPortAction';

	export let fundList: TrendingFund[];

	let isImpressionEventSent = false;

	$: viewCount = fundList.reduce((acc, { viewCount }) => acc + viewCount, 0);

	const handleImpressionEvent = () => {
		if (!isImpressionEventSent) {
			isImpressionEventSent = true;
			const funds = fundList?.map((fund, index) => {
				return {
					FundRank: index + 1,
					FundName: fund?.schemeName
				};
			});
			const eventMetaData = {
				Type: 'Trending',
				FundName: funds
			};
			trendingFundsImpressionAnalytics(eventMetaData);
		}
	};

	const handleFundClick = (fund: TrendingFund, index: number) => {
		const eventMetaData = {
			FundName: fund.schemeName,
			Isin: fund.isin,
			FundRank: index + 1
		};
		trendingFundsSelectFundAnalytics(eventMetaData);
	};
</script>

<section
	class="my-2 max-w-4xl rounded-lg bg-background-alt px-4 py-3 shadow-csm {$$props.class}"
	use:viewport
	on:enterViewport={handleImpressionEvent}
>
	<header class="mb-2" data-testid="trending-funds">
		<h2 class="text-base font-medium text-title">Most Viewed Funds</h2>
		<div
			class="mt-0.5 flex w-fit items-center rounded bg-tint12-secondary-alt p-1 text-xs font-normal text-secondary-alt"
		>
			<WMSIcon stroke="var(--SECONDARY-ALT)" name="graph-up" height={12} width={12} />
			{addCommasToAmountString(viewCount)} people viewed in the last 24 hours
		</div>
	</header>
	<article class="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
		{#each fundList as fund, index (fund?.isin)}
			<TrendingFundsItemTile {fund} on:cardClick={() => handleFundClick(fund, index)} />
		{/each}
	</article>
</section>
