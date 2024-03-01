<script lang="ts">
	import { base } from '$app/paths';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import {
		topFundsImpressionAnalytics,
		topFundsSelectFundAnalytics
	} from '$lib/analytics/topFunds/topFunds';
	import type {
		CategorySubOptionsEntity,
		DashboardCategoryEntity
	} from '$lib/types/IDiscoverFunds';
	import { modifiedGoto } from '$lib/utils/goto';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import viewport from '$lib/utils/useViewPortAction';

	export let tableData: DashboardCategoryEntity[];

	let topFundsInfo = tableData?.filter(
		(item) => item.type === 'tab' && item.name === 'Collections'
	)[0];
	let topFundsCategoryName = topFundsInfo?.data?.[0]?.name;
	let topFundsList = topFundsInfo?.data?.[0]?.data;
	let isImpressionEventSent = false;

	const handleImpressionEvent = () => {
		if (!isImpressionEventSent) {
			isImpressionEventSent = true;
			const funds = topFundsList?.map((item, index) => {
				return {
					FundRank: index + 1,
					FundName: item?.schemeName
				};
			});
			const eventMetaData = {
				Type: topFundsCategoryName,
				FundName: funds
			};
			topFundsImpressionAnalytics(eventMetaData);
		}
	};

	const gotoSchemeDetails = (fund: CategorySubOptionsEntity) => {
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			fund?.schemeName,
			fund?.isin,
			fund?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject({
			paymentMandatory: true
		})}`;
		modifiedGoto(schemeDetailsPath);
	};

	const handleFundClick = (fund: CategorySubOptionsEntity, index: number) => {
		const eventMetaData = {
			FundName: fund?.schemeName,
			Isin: fund?.isin,
			FundRank: index + 1,
			Category: topFundsCategoryName
		};
		topFundsSelectFundAnalytics(eventMetaData);
		gotoSchemeDetails(fund);
	};
</script>

{#if topFundsList?.length}
	<section
		use:viewport
		on:enterViewport={handleImpressionEvent}
		class={`my-2 max-w-4xl rounded-lg bg-background-alt px-4 py-3 shadow-csm ${$$props.class}`}
	>
		<header class="mb-3 flex justify-between" data-testid="top-funds">
			<h2 class="text-base font-medium text-title">{topFundsCategoryName}</h2>
		</header>
		<article class="mt-3">
			{#if topFundsInfo?.data?.[0]}
				{@const fundList = topFundsList}
				<div class="flex justify-between">
					<h3 class="text-xs font-normal text-body">Fund Name</h3>
					<h3 class="text-xs font-normal text-body">3Y Returns</h3>
				</div>
				<div class="divide-y">
					{#each fundList as fund, index (fund?.isin)}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<article
							on:click={() => handleFundClick(fund, index)}
							class="flex items-center rounded {index === fundList.length - 1 ? 'pt-3' : 'py-3'}"
						>
							<SchemeLogo
								size="xs"
								class="border-none"
								src={fund?.logoUrl}
								alt={fund?.schemeName}
							/>
							<span class="line-clamp-1 text-sm font-normal text-title">{fund?.schemeName}</span>
							<div class="flex-1" />
							<span class="ml-3 text-sm font-medium text-buy">{fund?.returns3yr?.toFixed(2)}%</span>
						</article>
					{/each}
				</div>
			{/if}
		</article>
	</section>
{/if}
