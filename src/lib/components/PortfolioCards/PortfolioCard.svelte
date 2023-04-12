<script setup lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import GainArrowIcon from '$lib/images/icons/GainArrowIcon.svelte';
	import LossArrowIcon from '$lib/images/icons/LossArrowIcon.svelte';
	import VerticalLineSeparatorIcon from '$lib/images/icons/VerticalLineSeparatorIcon.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import Link from '$components/Link.svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import type { InvestmentSummary } from '$lib/types/IInvestments';

	// import { viewPortfolioAnalysisAnalytics } from '@/analytics/investment/investment'

	const dispatch = createEventDispatcher<{
		portfolidataReceived: { investmentSummary: InvestmentSummary };
	}>();

	const viewPortfolioAnalysisAnalyticsFunc = () => {
		// TODO: Add analytics code
		//   const eventMetaData = {
		//     CurrentValue: parseFloat(props?.investmentSummary?.currentValue?.toFixed(2)),
		//     TotalInvestment: parseFloat(props?.investmentSummary?.investedValue?.toFixed(2)),
		//     OverallReturn: `${props?.investmentSummary?.returnsValue?.toFixed(2)} (${props?.investmentSummary?.returnsAbsolutePer?.toFixed(2)}%)`,
		//     TodaysReturn: `${props?.investmentSummary?.previousDayReturns?.toFixed(2)} (${props?.investmentSummary?.previousDayReturnPercentage?.toFixed(2)}%)`
		//   }
		//   viewPortfolioAnalysisAnalytics(eventMetaData)
	};

	export let discoverPage = false;
	let investmentSummary: InvestmentSummary;

	onMount(async () => {
		await tick();
		const url = `${PUBLIC_MF_CORE_BASE_URL}/portfolio/holdings?summary=true`;
		console.log('Start Portfolio');
		try {
			const res = await useFetch(url, {}, fetch);
			console.log('End Portfolio');

			if (res?.ok) {
				const summaryData = await res.data;
				investmentSummary = summaryData?.data?.summary || {};
			} else {
				investmentSummary = {};
			}
		} catch (e) {
			investmentSummary = {};
		}
		dispatch('portfolidataReceived', {
			investmentSummary
		});
	});
</script>

<article
	class="mb-2 mt-2 rounded-lg bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 pt-6 pb-4 text-white md:mt-0 lg:p-6"
>
	<section class="mx-4 flex items-center justify-between lg:mx-0">
		<article class="flex flex-col items-start">
			<div class="text-xs md:text-sm">Total Invested</div>
			<div class="text-[18px] font-medium md:text-xl">
				₹{investmentSummary?.investedValue
					? addCommasToAmountString(investmentSummary?.investedValue?.toFixed(2))
					: '0.00'}
			</div>
		</article>

		<article class="flex flex-col items-end">
			<div class="text-xs md:text-sm">Current Value</div>
			<div class="text-[18px] font-medium md:text-xl">
				₹{investmentSummary?.currentValue
					? addCommasToAmountString(investmentSummary?.currentValue?.toFixed(2))
					: '0.00'}
			</div>
		</article>
	</section>

	{#if !investmentSummary || !investmentSummary.investedValue || investmentSummary.investedValue === 0}
		<section
			class="mt-3 border-t border-neutral-100 border-opacity-10 pt-2 text-xs font-normal max-sm:mr-4 max-sm:ml-4"
		>
			<article>Explore funds and start investing today</article>
		</section>
	{:else}
		<section
			class={`my-4 mx-4 flex items-center justify-around rounded-lg bg-white bg-opacity-10 px-3 py-4 md:my-6 md:py-3.5 lg:mx-0 ${
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
					<span class="mr-1 font-medium">
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
					<span class="mr-1 font-medium">
						{investmentSummary?.previousDayReturns && investmentSummary.previousDayReturns < 0
							? '-'
							: ''}₹{investmentSummary?.previousDayReturns
							? addCommasToAmountString(Math.abs(investmentSummary?.previousDayReturns)?.toFixed(2))
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
				class={`mt-3 ml-4 mr-3 hidden items-baseline justify-between border-t border-neutral-100 border-opacity-10 ${
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
					<span class="mr-1 font-medium">
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
		<!-- {/if} -->

		<section
			class={`border-t border-neutral-100 border-opacity-10 px-4 lg:border-none lg:px-0 ${
				discoverPage ? 'max-sm:hidden' : ''
			}`}
		>
			<article>
				<Link to="/investments/portfolio" on:click={viewPortfolioAnalysisAnalyticsFunc}>
					<div
						class="px-17 flex cursor-pointer items-center justify-center pt-4 text-center text-sm font-semibold lg:rounded lg:border lg:border-white lg:py-4"
					>
						<span> VIEW PORTFOLIO ANALYSIS </span>
						<RightIcon class="ml-2" stroke="white" />
					</div>
				</Link>
			</article>
		</section>
	{/if}
</article>
