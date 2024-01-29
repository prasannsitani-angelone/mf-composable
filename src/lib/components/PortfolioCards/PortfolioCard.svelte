<script setup lang="ts">
	import { base } from '$app/paths';
	import VerticalLineSeparatorIcon from '$lib/images/icons/VerticalLineSeparatorIcon.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import Button from '$components/Button.svelte';
	import { PortfolioCard, WMSIcon } from 'svelte-components';
	import type { InvestmentSummary } from '$lib/types/IInvestments';
	import { viewPortfolioAnalysisAnalytics } from '../../../routes/(app)/(authenticated)/investments/analytics';
	import { modifiedGoto } from '$lib/utils/goto';

	let showInfo = false;

	const toggleInfo = () => {
		showInfo = !showInfo;
	};

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
		modifiedGoto(`${base}/investments/portfolio`);
		viewPortfolioAnalysisAnalyticsFunc();
	};

	const navigateToInvestments = () => {
		modifiedGoto(`${base}/investments`);
	};

	export let discoverPage = false;
	export let investmentSummary: InvestmentSummary;
</script>

<div class="block cursor-pointer">
	<PortfolioCard class="p-4 {$$props.class || ''}" variant="secondary">
		<section class="flex items-center justify-between sm:hidden lg:mx-0">
			<article class="flex flex-col items-start">
				<div class="text-xs md:text-sm">Current Value</div>
				<div class="font-normal md:text-xl">
					₹{investmentSummary?.currentValue
						? addCommasToAmountString(investmentSummary?.currentValue?.toFixed(2))
						: '0.00'}
				</div>
			</article>

			<article class="flex flex-col items-end">
				<div class="text-xs md:text-sm">Total Returns</div>
				<div class="items-center font-normal md:text-xl">
					{investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
						? '-'
						: ''}₹{investmentSummary?.returnsValue
						? addCommasToAmountString(Math.abs(investmentSummary?.returnsValue)?.toFixed(2))
						: '0.00'}
					<span
						class={investmentSummary?.returnsValue && investmentSummary.returnsValue >= 0
							? 'text-xs text-green-buy'
							: 'text-xs text-red-sell'}
						>({investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
							? '-'
							: '+'}{investmentSummary?.returnsAbsolutePer
							? Math.abs(investmentSummary?.returnsAbsolutePer)?.toFixed(2)
							: '0.00'}%)</span
					>
				</div>
			</article>
		</section>

		<section class="hidden justify-between pb-1 sm:flex lg:mx-0">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<article on:click={navigateToInvestments} class="flex flex-col items-start">
				<div class="text-xs">Current Value</div>
				<div class="text-lg font-normal">
					₹{investmentSummary?.currentValue
						? addCommasToAmountString(investmentSummary?.currentValue?.toFixed(2))
						: '0.00'}
				</div>
			</article>

			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<article class="flex flex-col items-start" on:click={toggleInfo}>
				{#if showInfo}<WMSIcon name="arrow-collapse" width={12} height={8} stroke="#FFFFFF" />
				{:else}<WMSIcon name="arrow-expand" width={12} height={8} stroke="#FFFFFF" />
				{/if}
			</article>
		</section>

		{#if !investmentSummary || !investmentSummary.investedValue || investmentSummary.investedValue === 0}
			<section
				class="mt-3 border-t border-neutral-100 border-opacity-10 pt-2 text-xs font-normal max-sm:ml-4 max-sm:mr-4"
			>
				<article>Explore funds and start investing today</article>
			</section>
		{:else if showInfo}
			<section
				class={`flex items-center justify-between rounded-lg bg-white bg-opacity-10 p-3 ${
					discoverPage ? 'max-sm:hidden' : ''
				}`}
			>
				<article class="flex flex-col text-left">
					<div class="flex text-xs">Total Invested</div>
					<div class="mt-1">
						<span class="mr-1 font-normal">
							{investmentSummary?.investedValue && investmentSummary.investedValue < 0
								? '-'
								: ''}₹{investmentSummary?.investedValue
								? addCommasToAmountString(Math.abs(investmentSummary?.investedValue)?.toFixed(2))
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
				<article class="flex flex-col items-end text-right">
					<div class="flex text-xs">Total Returns</div>
					<div class="mt-1">
						{investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
							? '-'
							: ''}₹{investmentSummary?.returnsValue
							? addCommasToAmountString(Math.abs(investmentSummary?.returnsValue)?.toFixed(2))
							: '0.00'}
						<span
							class={investmentSummary?.returnsValue && investmentSummary.returnsValue >= 0
								? 'text-xs text-green-buy'
								: 'text-xs text-red-sell'}
							>({investmentSummary?.returnsValue && investmentSummary.returnsValue < 0
								? '-'
								: '+'}{investmentSummary?.returnsAbsolutePer
								? Math.abs(investmentSummary?.returnsAbsolutePer)?.toFixed(2)
								: '0.00'}%)</span
						>
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
						size="sm"
						class="px-17 flex !h-auto !w-full cursor-pointer items-center justify-center pt-4 text-center text-sm font-medium"
					>
						<span class="text-white"> VIEW PORTFOLIO ANALYSIS </span>
						<RightIcon class="ml-2" stroke="white" />
					</Button>
					<!-- </Button> -->
				</article>
			</section>
		{/if}
	</PortfolioCard>
</div>
