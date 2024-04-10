<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from '$components/Button.svelte';
	import BigDotIcon from '$lib/images/icons/BigDotIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { stayInvestedImpressionAnalytics } from '$lib/analytics/redemption/redemption';
	import { calculateLumpsumReturns } from '$lib/utils/helpers/returns';
	import StoriesComponent from '$components/Stories/StoriesComponent.svelte';
	import type { Story } from '$lib/types/IStories';
	import { getStoriesData } from '$lib/api/media';
	import StoriesSkeletonLoader from '$components/Stories/StoriesSkeletonLoader.svelte';
	import {
		taxWithdrawalVideoClickAnalytics,
		taxWithdrawalVideoCloseAnalytics,
		taxWithdrawalVideoImpressionAnalytics
	} from '$lib/analytics/stories/stories';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	export let currentValue: number;
	export let categoryName: string;
	export let subCategoryName: string;
	export let exitLoadDetails: string;
	export let scheme: SchemeDetails;

	const dispatch = createEventDispatcher();

	const primaryCtaClick = () => {
		dispatch('primaryCtaClick');
	};

	const secondaryCtaClick = () => {
		dispatch('secondaryCtaClick');
	};

	let threeYearMaturityAmount = 0;
	let fiveYearMaturityAmount = 0;
	let threeYearGainLossPercentage = 0;
	let fiveYearGainLossPercentage = 0;
	let stories: Story[];
	let shouldLoadStories: boolean;

	let storyAnalytics = {
		onStoryClick: taxWithdrawalVideoClickAnalytics,
		onStoryClose: taxWithdrawalVideoCloseAnalytics,
		storyImpression: taxWithdrawalVideoImpressionAnalytics
	};

	const getDefaultCagr = () => {
		const category = {
			EQUITY: 12,
			DEBT: 7,
			LIQUID: 4,
			HYBRID: 10
		};

		if (categoryName?.toUpperCase() === 'DEBT') {
			if (subCategoryName?.toUpperCase() === 'LIQUID') {
				return category?.LIQUID;
			} else {
				return category?.DEBT;
			}
		} else if (categoryName?.toUpperCase() === 'HYBRID') {
			return category?.HYBRID;
		} else {
			// for Equity and other cases
			return category?.EQUITY;
		}
	};

	const get3YearReturns = () => {
		const threeYearReturns = calculateLumpsumReturns(currentValue, 3, getDefaultCagr());
		threeYearMaturityAmount = threeYearReturns?.matuarityAmount;
		threeYearGainLossPercentage = threeYearReturns?.gainLossPercentage;
	};

	const get5YearReturns = () => {
		const fiveYearReturns = calculateLumpsumReturns(currentValue, 5, getDefaultCagr());
		fiveYearMaturityAmount = fiveYearReturns?.matuarityAmount;
		fiveYearGainLossPercentage = fiveYearReturns?.gainLossPercentage;
	};

	const fetchStories = async () => {
		shouldLoadStories = false;
		const response = await getStoriesData('?exitloadconfig=true');
		stories = response.data?.stories;
		shouldLoadStories = true;
	};

	get3YearReturns();
	get5YearReturns();

	onMount(() => {
		stayInvestedImpressionAnalytics();
		fetchStories();
	});

	const graphData = [
		{
			type: 'CURRENT_VALUE',
			amount: currentValue,
			returnPercentage: 0,
			xAxisTitle1: 'Current',
			xAxisTitle2: 'Value',
			barHeight: 9
		},
		{
			type: '3Y_RETURN',
			amount: threeYearMaturityAmount,
			returnPercentage: threeYearGainLossPercentage,
			xAxisTitle1: 'After',
			xAxisTitle2: '3 Years',
			barHeight: 20
		},
		{
			type: '5Y_RETURN',
			amount: fiveYearMaturityAmount,
			returnPercentage: fiveYearGainLossPercentage,
			xAxisTitle1: 'After',
			xAxisTitle2: '5 Years',
			barHeight: 32
		}
	];

	const additionalChargesData = [
		{
			title: 'Exit Load',
			detail: exitLoadDetails
		}
	];

	const tooltipData = [
		'Standard returns calculated based on fund asset type:',
		'Equity: 12%',
		'Debt: 7%',
		'Liquid: 4%',
		'Hybrid: 10%'
	];
</script>

<article
	class="flex w-full flex-col rounded-b-none rounded-t-2xl bg-background-alt px-5 pb-3 pt-8 text-title shadow-clg md:rounded-lg {$$props?.class}"
>
	<div class="text-center text-2xl font-normal">You are missing out on potential returns!</div>

	<section class="flex h-fit max-h-96 flex-col overflow-auto">
		<div class="my-4 rounded text-center text-sm font-normal">
			Earn <span class="font-normal"
				>up to ₹{addCommasToAmountString(
					(fiveYearMaturityAmount - Math.round(currentValue))?.toString()
				)} more</span
			> in returns over 5 years
		</div>

		<article class="flex items-end justify-center">
			<section class="flex items-end justify-center text-xs font-normal">
				{#each graphData as bar, index (index)}
					<article class="flex flex-col items-center justify-center">
						<div class="mb-2">
							<div class="text-center">₹{addCommasToAmountString(bar?.amount?.toFixed(0))}</div>
							{#if bar?.type !== 'CURRENT_VALUE'}
								<div class="text-center">(+{bar?.returnPercentage?.toFixed(0)}%)</div>
							{/if}
						</div>
						<div
							class="w-10 h-{bar?.barHeight} {bar?.type !== 'CURRENT_VALUE' ? 'bg-buy' : 'bg-body'}"
						/>
						<div class="h-[1px] w-[82px] bg-border pt-[1px]" />
						<article class="mt-2 flex w-11 flex-col items-center justify-center font-normal">
							<div class="text-center">{bar?.xAxisTitle1}</div>
							<div class="text-center">{bar?.xAxisTitle2}</div>
						</article>
					</article>
				{/each}
			</section>

			<div class="group mb-3">
				<div class="flex items-center justify-center text-background-alt group-hover:text-gray-300">
					<WMSIcon width={16} height={16} name="info-in-circle-dark" />
				</div>
				<div
					class="absolute z-10 -ml-[214px] mt-1 hidden transform rounded bg-title text-sm text-background-alt shadow-lg group-hover:block"
				>
					<div class="absolute -top-1 right-3 -translate-x-0.5 transform">
						<div class="h-2 w-2 rotate-45 transform bg-title" />
					</div>
					<div class="relative w-60 px-4 py-3 text-xs font-normal">
						{#each tooltipData as tip, index (index)}
							<div>
								{tip}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</article>

		<article class="mt-2 text-center text-[11px] text-body">
			Disclaimer: Projected value is based on standard returns of fund asset type. Your actual
			returns may vary.
		</article>

		{#if exitLoadDetails?.length}
			<!-- if condition is temporary (to be removed later in phase 2) -->
			<section class="my-4 rounded bg-background p-2">
				<div class="text-xs font-normal">Additional Charges on Withdrawal (if applicable)</div>
				{#each additionalChargesData as point, index (index)}
					<article class="mt-3 text-[11px]">
						<section class="flex items-center">
							<BigDotIcon class="mr-1" />
							<div>{point?.title}</div>
						</section>
						<div class="ml-2 mt-1">{point?.detail}</div>
					</article>
				{/each}
				{#if !shouldLoadStories}
					<StoriesSkeletonLoader numberOfSkeletons={1} />
				{:else if stories?.length}
					<StoriesComponent
						{stories}
						version="A"
						hideFooter={true}
						isDiscoverPage={false}
						showDescription={true}
						header="Exit"
						{scheme}
						analytics={storyAnalytics}
					/>
				{/if}
			</section>
		{/if}
	</section>

	<section class="bottom-0 mt-2 flex flex-col">
		<Button variant="contained" class="mb-2" onClick={primaryCtaClick}>STAY INVESTED</Button>

		<Button variant="transparent" onClick={secondaryCtaClick}>WITHDRAW</Button>
	</section>
</article>
