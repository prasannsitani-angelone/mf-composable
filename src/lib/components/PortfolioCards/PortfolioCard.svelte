<script setup lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import GainArrowIcon from '$lib/images/icons/GainArrowIcon.svelte';
	import LossArrowIcon from '$lib/images/icons/LossArrowIcon.svelte';
	import VerticalLineSeparatorIcon from '$lib/images/icons/VerticalLineSeparatorIcon.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import Button from '$components/Button.svelte';
	import { PortfolioCard } from 'svelte-components';
	import type { InvestmentSummary } from '$lib/types/IInvestments';
	import { viewPortfolioAnalysisAnalytics } from '../../../routes/(app)/(authenticated)/investments/analytics';

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

	const onGoToPortfolioClick = (e: MouseEvent) => {
		e.stopPropagation();
		goto(`${base}/investments/portfolio`);
		viewPortfolioAnalysisAnalyticsFunc();
	};

	const navigateToInvestments = () => {
		goto(`${base}/investments`);
	};

	export let discoverPage = false;
	export let investmentSummary: InvestmentSummary;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={navigateToInvestments} class="block cursor-pointer">
	<PortfolioCard class="pb-4 pt-6 lg:p-6 {$$props.class || ''}">
		<section class=" flex items-center justify-between lg:mx-0">
			<article class="flex flex-col items-start">
				<div class="text-xs md:text-sm">Total Invested</div>
				<div class="text-[18px] font-normal md:text-xl">
					₹{investmentSummary?.investedValue
						? addCommasToAmountString(investmentSummary?.investedValue?.toFixed(2))
						: '0.00'}
				</div>
			</article>

			<article class="flex flex-col items-end">
				<div class="text-xs md:text-sm">Current Value</div>
				<div class="text-[18px] font-normal md:text-xl">
					₹{investmentSummary?.currentValue
						? addCommasToAmountString(investmentSummary?.currentValue?.toFixed(2))
						: '0.00'}
				</div>
			</article>
		</section>

		{#if !investmentSummary || !investmentSummary.investedValue || investmentSummary.investedValue === 0}
			<section
				class="mt-3 border-t border-neutral-100 border-opacity-10 pt-2 text-xs font-normal max-sm:ml-4 max-sm:mr-4"
			>
				<article>Explore funds and start investing today</article>
			</section>
		{:else}
			<section
				class={`my-4 flex items-center justify-around rounded-lg bg-white bg-opacity-10 px-3 py-4 md:my-6 md:py-3.5 lg:mx-0 ${
					discoverPage ? 'max-sm:hidden' : ''
				}`}
			>
				<article class="flex flex-col items-center">
					<div class="flex items-center justify-around text-xs">
						{#if investmentSummary?.returnsValue && investmentSummary.returnsValue >= 0}
							<GainArrowIcon class="mr-1.5" />
						{:else}
							<LossArrowIcon class="mr-1.5" />
						{/if}
						<span class="text-[11px] md:text-xs"> Total Returns </span>
					</div>
					<div class="mx-1 mt-2 text-center text-xs md:text-sm">
						<span class="mr-1 font-normal">
							{investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
								? '-'
								: ''}₹{investmentSummary?.returnsValue
								? addCommasToAmountString(Math.abs(investmentSummary?.returnsValue)?.toFixed(2))
								: '0.00'}
						</span>
						<span>
							({investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
								? '-'
								: '+'}{investmentSummary?.returnsAbsolutePer
								? Math.abs(investmentSummary?.returnsAbsolutePer)?.toFixed(2)
								: '0.00'}%)
						</span>
					</div>
				</article>
				<article>
					<div>
						<VerticalLineSeparatorIcon />
					</div>
				</article>
				<article class="flex flex-col items-center">
					<div class="flex items-center justify-around text-xs">
						{#if investmentSummary?.previousDayReturns && investmentSummary.previousDayReturns >= 0}
							<GainArrowIcon class="mr-1.5" />
						{:else}
							<LossArrowIcon class="mr-1.5" />
						{/if}
						<span class="text-[11px] md:text-xs"> 1 Day Return </span>
					</div>
					<div class="mx-1 mt-2 text-center text-xs md:text-sm">
						<span class="mr-1 font-normal">
							{investmentSummary?.previousDayReturns && investmentSummary.previousDayReturns < 0
								? '-'
								: ''}₹{investmentSummary?.previousDayReturns
								? addCommasToAmountString(
										Math.abs(investmentSummary?.previousDayReturns)?.toFixed(2)
								  )
								: '0.00'}
						</span>
						<span>
							({investmentSummary?.previousDayReturns && investmentSummary.previousDayReturns < 0
								? '-'
								: '+'}{investmentSummary?.previousDayReturnPercentage
								? Math.abs(investmentSummary?.previousDayReturnPercentage)?.toFixed(2)
								: '0.00'}%)
						</span>
					</div>
				</article>
			</section>

			<section>
				<article
					class={`ml-4 mr-3 mt-3 hidden items-baseline justify-between border-t border-neutral-100 border-opacity-10 ${
						discoverPage ? 'max-sm:flex' : ''
					}`}
				>
					<div class="flex items-center justify-around text-xs">
						{#if investmentSummary?.returnsValue && investmentSummary.returnsValue >= 0}
							<GainArrowIcon class="mr-1.5" />
						{:else}
							<LossArrowIcon class="mr-1.5" />
						{/if}
						<span class="text-[11px] md:text-xs"> Total Returns </span>
					</div>
					<div class="mx-1 mt-2 text-center text-xs md:text-sm">
						<span class="mr-1 font-normal">
							{investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
								? '-'
								: ''}₹{investmentSummary?.returnsValue
								? addCommasToAmountString(Math.abs(investmentSummary?.returnsValue)?.toFixed(2))
								: '0.00'}
						</span>
						<span>
							({investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
								? '-'
								: '+'}{investmentSummary?.returnsAbsolutePer
								? Math.abs(investmentSummary?.returnsAbsolutePer)?.toFixed(2)
								: '0.00'}%)
						</span>
					</div>
				</article>
			</section>

			<section
				class={`border-t border-neutral-100 border-opacity-10 px-4 lg:border-none lg:px-0 ${
					discoverPage ? 'max-sm:hidden' : ''
				}`}
			>
				<article>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- <Button onClick={onGoToPortfolioClick} variant="transparent" class="w-full"> -->
					<Button
						onClick={onGoToPortfolioClick}
						variant="transparent"
						class=" px-17 flex !h-auto !w-full cursor-pointer items-center justify-center pt-4 text-center text-sm font-medium hover:border-white hover:outline-white lg:rounded lg:border lg:border-white lg:py-4"
					>
						<span class=" text-white"> VIEW PORTFOLIO ANALYSIS </span>
						<RightIcon class="ml-2" stroke="white" />
					</Button>
					<!-- </Button> -->
				</article>
			</section>
		{/if}
	</PortfolioCard>
</div>
