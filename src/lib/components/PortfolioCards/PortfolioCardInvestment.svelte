<script setup lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import Button from '$components/Button.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import Link from '$components/Link.svelte';
	import { WMSIcon } from 'wms-ui-component';

	import { PortfolioCard } from 'wms-ui-component';
	import PortfolioCardLoader from './PortfolioCardLoader.svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import type { InvestmentSummary } from '$lib/types/IInvestments';

	import { viewPortfolioAnalysisAnalytics } from '../../../routes/(app)/(authenticated)/investments/analytics';

	let cardCollapsed = true;

	const dispatch = createEventDispatcher<{
		portfolidataReceived: { investmentSummary: InvestmentSummary };
	}>();

	const viewPortfolioAnalysisAnalyticsFunc = () => {
		const eventMetaData = {
			CurrentValue: parseFloat(investmentSummary?.currentValue?.toFixed(2)),
			TotalInvestment: parseFloat(investmentSummary?.investedValue?.toFixed(2)),
			OverallReturn: `${investmentSummary?.returnsValue?.toFixed(
				2
			)} (${investmentSummary?.returnsAbsolutePer?.toFixed(2)}%)`,
			TodaysReturn: `${investmentSummary?.previousDayReturns?.toFixed(
				2
			)} (${investmentSummary?.previousDayReturnPercentage?.toFixed(2)}%)`
		};
		viewPortfolioAnalysisAnalytics(eventMetaData);
	};

	export let discoverPage = false;
	export let onInfoClick = () => '';
	let investmentSummary: InvestmentSummary;
	let loading = true;

	onMount(async () => {
		await tick();
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?summary=true`;
		try {
			const res = await useFetch(url, {}, fetch);

			if (res?.ok) {
				const summaryData = await res.data;
				investmentSummary = summaryData?.data?.summary || {};
			} else {
				investmentSummary = {};
			}
		} catch (e) {
			investmentSummary = {};
		} finally {
			loading = false;
		}
		dispatch('portfolidataReceived', {
			investmentSummary
		});
	});
	const toggleCardView = () => {
		cardCollapsed = !cardCollapsed;
	};
</script>

{#if loading}
	<PortfolioCardLoader {discoverPage} />
{:else}
	<PortfolioCard class="!px-3 !pt-4 !pb-3">
		<section class=" flex items-start justify-between lg:mx-0" data-testid="portfolioTopSection">
			<article class="flex flex-col items-start">
				<div class="text-xs">Current Value</div>
				<div data-testid="portfolioCurrentValue" class=" text-lg font-medium">
					₹{investmentSummary?.currentValue
						? addCommasToAmountString(investmentSummary?.currentValue?.toFixed(2))
						: '0.00'}
				</div>
			</article>

			<Button
				variant="transparent"
				class="flex flex-col items-end pl-2 pb-2 !pt-0 !pr-0"
				size="xs"
				onClick={toggleCardView}
			>
				{#if cardCollapsed}
					<WMSIcon name="arrow-expand" width={12} height={6} stroke="#fff" class="" />
				{:else}
					<WMSIcon name="arrow-collapse" width={12} height={6} stroke="#fff" class="" />
				{/if}
			</Button>
		</section>

		{#if !investmentSummary || !investmentSummary.investedValue || investmentSummary.investedValue === 0}
			<section
				class="mt-3 border-t border-neutral-100 border-opacity-10 pt-2 text-xs font-normal max-sm:mr-4 max-sm:ml-4"
			>
				<article>Explore funds and start investing today</article>
			</section>
		{:else}
			<section
				class="mt-2 mb-3 flex flex-col items-center justify-around rounded-lg bg-white bg-opacity-10 px-2 py-4 md:py-3.5 lg:mx-0"
			>
				<div class="flex w-full">
					<article class=" flex-1 border-r border-dashed border-grey-dashed text-left">
						<div class=" text-xs font-normal">Total Invested</div>
						<div class=" text-sm font-medium" data-testid="portfolioInvestedValue">
							₹{investmentSummary?.investedValue
								? addCommasToAmountString(investmentSummary?.investedValue?.toFixed(2))
								: '0.00'}
						</div>
					</article>
					<article class=" flex-1 text-right">
						<div class=" text-xs font-normal">Total Returns</div>
						<div
							class="flex flex-wrap items-center justify-end text-sm"
							data-testid="portfolioReturnsValue"
						>
							<div class="flex items-center">
								<span class="mr-1 font-medium">
									{#if investmentSummary?.returnsValue && investmentSummary.returnsValue >= 0}
										<WMSIcon width={12} height={12} name="gain-double-stacked" />
									{:else}
										<WMSIcon width={12} height={12} name="loss-double-stacked" />
									{/if}
								</span>
								<span class=" font-semibold"
									>{investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
										? '-'
										: ''}₹{investmentSummary?.returnsValue
										? addCommasToAmountString(Math.abs(investmentSummary?.returnsValue)?.toFixed(2))
										: '0.00'}
								</span>
							</div>

							<span
								class="ml-1 font-medium {investmentSummary?.returnsValue &&
								investmentSummary.returnsValue >= 0
									? 'text-green-buy'
									: 'text-red-sell'}"
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
					<div class=" mt-4 flex w-full">
						<article class="flex-1 border-r border-dashed border-grey-dashed text-left">
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
							<div class=" text-sm font-medium" data-testid="portfolioXirrValue">
								{Math.abs(investmentSummary?.xirr || 0)?.toFixed(2)}%
							</div>
						</article>
						<article class="flex-1 text-right">
							<div class=" text-xs font-normal">1 Day Return</div>
							<div class="flex flex-wrap justify-end text-sm" data-testid="portfolioOneDayReturn">
								<span class=" font-semibold">
									{investmentSummary?.previousDayReturns && investmentSummary.previousDayReturns < 0
										? '-'
										: ''}₹{investmentSummary?.previousDayReturns
										? addCommasToAmountString(
												Math.abs(investmentSummary?.previousDayReturns)?.toFixed(2)
										  )
										: '0.00'}
								</span>
								<span
									class="ml-1 font-medium {investmentSummary?.previousDayReturns &&
									investmentSummary.previousDayReturns >= 0
										? 'text-green-buy'
										: 'text-red-sell'}"
								>
									({investmentSummary?.previousDayReturns &&
									investmentSummary.previousDayReturns < 0
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

			<section
				class={`border-t border-neutral-100 border-opacity-10 px-4 lg:px-0 ${
					discoverPage ? 'max-sm:hidden' : ''
				}`}
			>
				<article data-testid="viewPortfolioAnalysis">
					<Link to="/investments/portfolio" on:linkClicked={viewPortfolioAnalysisAnalyticsFunc}>
						<div
							class="px-17 flex cursor-pointer items-center justify-center pt-3 text-center text-sm font-semibold"
						>
							<span> VIEW PORTFOLIO ANALYSIS </span>
							<RightIcon class="ml-2" stroke="white" />
						</div>
					</Link>
				</article>
			</section>
		{/if}
	</PortfolioCard>
{/if}

<style>
	.investment-xirr :global(.xirr-exclamation) {
		stroke: #fff;
	}
	.investment-xirr :global(.xirr-exclamation *) {
		stroke: #fff;
	}
</style>
