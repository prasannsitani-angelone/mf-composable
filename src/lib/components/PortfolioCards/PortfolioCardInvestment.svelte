<script setup lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import Button from '$components/Button.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	import { PortfolioCard } from 'svelte-components';
	import type { InvestmentSummary } from '$lib/types/IInvestments';

	import { viewPortfolioAnalysisAnalytics } from '../../../routes/(app)/(authenticated)/investments/analytics';
	import {
		portfolioCardExpandClickEvent,
		portfolioCardExpandImpressionEvent
	} from '$components/PortfolioCards/analytics';
	import { appStore } from '$lib/stores/SparkStore';
	import { profileStore } from '$lib/stores/ProfileStore';

	let isFamilyPortfolio = false;

	const setIsFamilyPortfolio = () => {
		isFamilyPortfolio = appStore?.isFamilyPortfolioSelected($profileStore?.clientId);
	};

	$: setIsFamilyPortfolio(), $appStore;

	let cardCollapsed = true;

	const viewPortfolioAnalysisAnalyticsFunc = () => {
		const eventMetaData = {
			CurrentValue: parseFloat(investmentSummary?.currentValue?.toFixed(0)),
			TotalInvestment: parseFloat(investmentSummary?.investedValue?.toFixed(0)),
			OverallReturn: `${investmentSummary?.returnsValue?.toFixed(
				0
			)} (${investmentSummary?.returnsAbsolutePer?.toFixed(2)}%)`,
			TodaysReturn: `${investmentSummary?.previousDayReturns?.toFixed(
				0
			)} (${investmentSummary?.previousDayReturnPercentage?.toFixed(2)}%)`
		};
		viewPortfolioAnalysisAnalytics(eventMetaData);
	};

	const onGoToPortfolioClick = (e: MouseEvent) => {
		e.stopPropagation();
		goto(`${base}/investments/portfolio`);
		viewPortfolioAnalysisAnalyticsFunc();
	};

	export let discoverPage = false;
	export let onInfoClick = () => '';
	export let investmentSummary: InvestmentSummary;

	const toggleCardView = () => {
		cardCollapsed = !cardCollapsed;
		logToggleClickEvent();
	};

	function logToggleClickEvent() {
		const eventMetaData = {
			CurrentValue: parseFloat(investmentSummary?.currentValue?.toFixed(0)),
			TotalInvestment: parseFloat(investmentSummary?.investedValue?.toFixed(0)),
			OverallReturn: `${investmentSummary?.returnsValue?.toFixed(
				0
			)} (${investmentSummary?.returnsAbsolutePer?.toFixed(2)}%)`,
			TodaysReturn: `${investmentSummary?.previousDayReturns?.toFixed(
				0
			)} (${investmentSummary?.previousDayReturnPercentage?.toFixed(2)}%)`
		};
		portfolioCardExpandClickEvent(eventMetaData);
	}

	function logToggleCardExpandedEvent() {
		const eventMetaData = {
			CurrentValue: parseFloat(investmentSummary?.currentValue?.toFixed(0)),
			TotalInvestment: parseFloat(investmentSummary?.investedValue?.toFixed(0)),
			OverallReturn: `${investmentSummary?.returnsValue?.toFixed(
				0
			)} (${investmentSummary?.returnsAbsolutePer?.toFixed(2)}%)`,
			TodaysReturn: `${investmentSummary?.previousDayReturns?.toFixed(
				0
			)} (${investmentSummary?.previousDayReturnPercentage?.toFixed(2)}%)`,
			XIRR: `${investmentSummary.xirr?.toFixed(2)}%`
		};
		portfolioCardExpandImpressionEvent(eventMetaData);
	}
</script>

<PortfolioCard class="!px-3 !pt-4 {isFamilyPortfolio ? '!pb-1' : '!pb-3'}" variant="secondary">
	<section class=" flex items-start justify-between lg:mx-0" data-testid="portfolioTopSection">
		<article class="flex flex-col items-start">
			<div class="text-xs">Current Value</div>
			<div data-testid="portfolioCurrentValue" class=" text-lg font-normal">
				₹{investmentSummary?.currentValue
					? addCommasToAmountString(investmentSummary?.currentValue?.toFixed(0))
					: '0'}
			</div>
		</article>
		{#if investmentSummary && investmentSummary.investedValue && investmentSummary.investedValue !== 0 && !isFamilyPortfolio}
			<Button
				variant="transparent"
				class="flex flex-col items-end !pr-0 !pt-0 pb-2 pl-2"
				size="xs"
				onClick={toggleCardView}
			>
				{#if cardCollapsed}
					<WMSIcon name="arrow-expand" width={12} height={6} stroke="#fff" class="" />
				{:else}
					<WMSIcon name="arrow-collapse" width={12} height={6} stroke="#fff" class="" />
				{/if}
			</Button>
		{/if}
	</section>

	{#if !investmentSummary || !investmentSummary.investedValue || investmentSummary.investedValue === 0}
		<section
			class="mt-3 border-t border-neutral-100 border-opacity-10 pt-2 text-xs font-normal max-sm:ml-4 max-sm:mr-4"
		>
			<article>Explore funds and start investing today</article>
		</section>
	{:else}
		<section
			class="light mb-3 mt-2 flex flex-col items-center justify-around rounded-lg bg-white bg-opacity-10 px-2 py-4 md:py-3.5 lg:mx-0"
		>
			<div class="flex w-full">
				<article class=" flex-1 border-r text-left">
					<div class=" text-xs font-normal">Total Invested</div>
					<div class=" text-sm font-normal" data-testid="portfolioInvestedValue">
						₹{investmentSummary?.investedValue
							? addCommasToAmountString(investmentSummary?.investedValue?.toFixed(0))
							: '0'}
					</div>
				</article>
				<article class=" flex-1 text-right">
					<div class=" text-xs font-normal">Total Returns</div>
					<div
						class="flex flex-wrap items-center justify-end text-sm"
						data-testid="portfolioReturnsValue"
					>
						<div class="flex items-center">
							<span class="mr-1 font-normal">
								{#if investmentSummary?.returnsValue && investmentSummary.returnsValue >= 0}
									<WMSIcon width={12} height={12} name="gain-double-stacked" />
								{:else}
									<WMSIcon width={12} height={12} name="loss-double-stacked" />
								{/if}
							</span>
							<span class=" font-medium"
								>{investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
									? '- '
									: ''}₹{investmentSummary?.returnsValue
									? addCommasToAmountString(Math.abs(investmentSummary?.returnsValue)?.toFixed(0))
									: '0'}
							</span>
						</div>

						<span
							class="ml-1 font-normal {investmentSummary?.returnsValue &&
							investmentSummary.returnsValue >= 0
								? 'text-buy'
								: 'text-sell'}"
						>
							({investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
								? '-'
								: ''}{investmentSummary?.returnsAbsolutePer
								? Math.abs(investmentSummary?.returnsAbsolutePer)?.toFixed(2)
								: '0.00'}%)
						</span>
					</div>
				</article>
			</div>

			{#if !cardCollapsed}
				{@const log = logToggleCardExpandedEvent()}
				<div class=" mt-4 flex w-full">
					<article class="flex-1 border-r text-left">
						<div
							data-testid="xirrCardTitle"
							class="investment-xirr flex items-center text-xs font-normal"
						>
							XIRR <WMSIcon
								name="info-in-circle-dark"
								class="xirr-exclamation ml-1 cursor-pointer"
								width={12}
								height={12}
								stroke="#fff"
								on:click={onInfoClick}
							/>
						</div>
						<div class=" text-sm font-normal" data-testid="portfolioXirrValue">
							{investmentSummary?.xirr ? Math.abs(investmentSummary.xirr)?.toFixed(2) + '%' : '- -'}
						</div>
					</article>
					<article class="flex-1 text-right">
						<div class=" text-xs font-normal">1 Day Return</div>
						<div class="flex flex-wrap justify-end text-sm" data-testid="portfolioOneDayReturn">
							<span class=" font-medium">
								{investmentSummary?.previousDayReturns && investmentSummary.previousDayReturns < 0
									? '- '
									: ''}₹{investmentSummary?.previousDayReturns
									? addCommasToAmountString(
											Math.abs(investmentSummary?.previousDayReturns)?.toFixed(0)
									  )
									: '0'}
							</span>
							<span
								class="ml-1 font-normal {investmentSummary?.previousDayReturns &&
								investmentSummary.previousDayReturns >= 0
									? 'text-buy'
									: 'text-sell'}"
							>
								({investmentSummary?.previousDayReturns && investmentSummary.previousDayReturns < 0
									? '-'
									: ''}{investmentSummary?.previousDayReturnPercentage
									? Math.abs(investmentSummary?.previousDayReturnPercentage)?.toFixed(2)
									: '0.00'}%)
							</span>
						</div>
					</article>
				</div>
			{/if}
		</section>

		{#if !isFamilyPortfolio}
			<section
				class={`border-t border-neutral-100 border-opacity-10 px-4 lg:px-0 ${
					discoverPage ? 'max-sm:hidden' : ''
				}`}
			>
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
		{/if}
	{/if}
</PortfolioCard>

<style>
	.investment-xirr :global(.xirr-exclamation) {
		stroke: #fff;
	}
	.investment-xirr :global(.xirr-exclamation *) {
		stroke: #fff;
	}
</style>
