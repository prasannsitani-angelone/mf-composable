<script lang="ts">
	import { PortfolioCard } from 'svelte-components';
	import VerticalLineSeparatorIcon from '$lib/images/icons/VerticalLineSeparatorIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { InvestmentSummary } from '$lib/types/IInvestments';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { externalPortfolioViewAnalysisClickAnalytics } from '$lib/analytics/externalPortfolio/externalPortfolio';

	export let investmentSummary: InvestmentSummary;
	export let partialImportedFundCount = 0;
	export let totalImportedFundCount = 0;
	export let isPartialImport = false;

	const onGoToPortfolioClick = (e: MouseEvent) => {
		const eventMetaData = {
			CurrentValue: parseFloat(investmentSummary?.currentValue?.toFixed(2) || '0'),
			TotalInvestment: parseFloat(investmentSummary?.investedValue?.toFixed(2) || '0'),
			OverallReturn: `${investmentSummary?.returnsValue?.toFixed(
				2
			)} (${investmentSummary?.returnsAbsolutePer?.toFixed(2)}%)`,
			TodaysReturn: `${investmentSummary?.previousDayReturns?.toFixed(
				2
			)} (${investmentSummary?.previousDayReturnPercentage?.toFixed(2)}%)`,
			TotalFunds: totalImportedFundCount,
			FundType: 'External'
		};
		externalPortfolioViewAnalysisClickAnalytics(eventMetaData);
		e.stopPropagation();
		goto(`${base}/investments/portfolio/external`);
	};
</script>

<PortfolioCard variant="secondary" wrapperClass="sm:sticky sm:top-0">
	<section class="flex items-center justify-between lg:mx-0">
		<article class="flex flex-col items-start">
			<div class="text-xs md:text-sm">Current Value</div>
			<div class="text-[18px] font-medium md:text-xl">
				₹{investmentSummary?.currentValue
					? addCommasToAmountString(investmentSummary?.currentValue?.toFixed(0))
					: '0'}
			</div>
		</article>

		<article class="flex flex-col items-end">
			<div class="text-xs md:text-sm">Total Invested</div>
			<div class="text-[18px] font-medium md:text-xl">
				₹{investmentSummary?.investedValue
					? addCommasToAmountString(investmentSummary?.investedValue?.toFixed(0))
					: '0'}
			</div>
		</article>
	</section>
	<section
		class={`light dark my-2 flex items-center justify-between rounded-lg bg-white bg-opacity-10 px-3 py-4 md:my-6 md:py-3.5 lg:mx-0`}
	>
		<article class="flex flex-col items-start">
			<div class="flex items-center justify-around text-xs">
				<span class="text-xs"> Total Funds </span>
			</div>

			{#if isPartialImport}
				<div class="flex items-center text-center text-base">
					<WMSIcon name="polygon-red-warning" width={10} height={10} class="mr-1" />
					<span class="mr-1 font-medium"
						>{Number(totalImportedFundCount - partialImportedFundCount)}/{totalImportedFundCount ||
							'-'}
					</span>
				</div>
			{:else}
				<div class="text-center text-base">
					<span class="mr-1 font-medium"> {totalImportedFundCount} </span>
				</div>
			{/if}
		</article>
		<article>
			<div>
				<VerticalLineSeparatorIcon opacity={1} />
			</div>
		</article>
		<article class="flex flex-col items-end">
			<div class="flex items-center justify-around text-xs">
				<span class="text-xs"> Total Returns </span>
			</div>
			<div class="text-center text-base">
				<span class="font-medium">
					{investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
						? '-'
						: ''}₹{investmentSummary?.returnsValue
						? addCommasToAmountString(Math.abs(investmentSummary?.returnsValue)?.toFixed(0))
						: '0'}
				</span>
				<span
					class="text-xs {investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
						? 'text-sell'
						: 'text-buy'}"
				>
					({investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
						? '-'
						: '+'}{investmentSummary?.returnsAbsolutePer
						? Math.abs(investmentSummary?.returnsAbsolutePer)?.toFixed(2)
						: '0.00'}%)
				</span>
			</div>
		</article>
	</section>

	<section class="border-t border-neutral-100 border-opacity-10 px-4 lg:px-0">
		<article data-testid="viewPortfolioAnalysis">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div on:click={onGoToPortfolioClick}>
				<div
					class="px-17 flex cursor-pointer items-center justify-center pt-3 text-center text-sm font-medium"
				>
					<span> VIEW PORTFOLIO ANALYSIS </span>
					<RightIcon class="ml-2" stroke="white" />
				</div>
			</div>
		</article>
	</section>
	{#if isPartialImport}
		<section
			class={`light my-4 flex items-start justify-around rounded-lg bg-white bg-opacity-10 px-3 py-4 md:my-6 md:py-3.5 lg:mx-0`}
		>
			<div class="mr-3 mt-1.5">
				<WMSIcon name="polygon-red-warning" width={16} height={16} />
			</div>

			<div class="text-xs text-background-alt">
				Total Invested and Current Value may not include some of your investments due to a technical
				issue.
			</div>
		</section>
	{/if}
</PortfolioCard>
