<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$components/Button.svelte';
	import BigDotIcon from '$lib/images/icons/BigDotIcon.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { WMSIcon } from 'wms-ui-component';
	import { calculateLumpsumReturns } from '../(authenticated)/investments/utils';

	export let currentValue: number;
	export let categoryName: string;
	export let subCategoryName: string;
	export let exitLoadDetails: string;

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

	get3YearReturns();
	get5YearReturns();

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
			barHeight: 16
		},
		{
			type: '5Y_RETURN',
			amount: fiveYearMaturityAmount,
			returnPercentage: fiveYearGainLossPercentage,
			xAxisTitle1: 'After',
			xAxisTitle2: '5 Years',
			barHeight: 24
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
	class="flex w-full flex-col rounded-t-2xl rounded-b-none bg-white px-5 pt-8 pb-3 text-black-key shadow-clg md:rounded-lg {$$props?.class}"
>
	<div class="text-center text-2xl font-medium">You are missing out on potential returns!</div>

	<section class="flex h-fit max-h-96 flex-col overflow-auto">
		<div class="my-4 rounded text-center text-sm font-normal">
			Earn <span class="font-medium"
				>up to ₹{addCommasToAmountString(fiveYearMaturityAmount?.toString())} more</span
			> in returns over 5 years
		</div>

		<article class="flex items-end justify-center">
			<section class="flex items-end justify-center text-xs font-medium">
				{#each graphData as bar, index (index)}
					<article class="flex flex-col items-center justify-center">
						<div class="mb-2">
							<div class="text-center">₹{addCommasToAmountString(bar?.amount?.toFixed(0))}</div>
							{#if bar?.type !== 'CURRENT_VALUE'}
								<div class="text-center">(+{bar?.returnPercentage?.toFixed(0)}%)</div>
							{/if}
						</div>
						<div
							class="w-10 h-{bar?.barHeight} {bar?.type !== 'CURRENT_VALUE'
								? 'bg-green-amount'
								: 'bg-black-bolder'}"
						/>
						<div class="h-[1px] w-[82px] bg-grey-line pt-[1px]" />
						<article class="mt-2 flex w-11 flex-col items-center justify-center font-normal">
							<div class="text-center">{bar?.xAxisTitle1}</div>
							<div class="text-center">{bar?.xAxisTitle2}</div>
						</article>
					</article>
				{/each}
			</section>

			<div class="group mb-3">
				<div class="flex items-center justify-center text-white group-hover:text-gray-300">
					<WMSIcon width={16} height={16} name="info-in-circle-dark" />
				</div>
				<div
					class="absolute z-10 mt-1 -ml-[214px] hidden transform rounded bg-black-title text-sm text-white shadow-lg group-hover:block"
				>
					<div class="absolute -top-1 right-3 -translate-x-0.5 transform">
						<div class="h-2 w-2 rotate-45 transform bg-black-title" />
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

		<article class="mt-2 text-center text-[11px] text-black-bolder">
			Disclaimer: Projected value is based on standard returns of fund asset type. Your actual
			returns may vary.
		</article>

		{#if exitLoadDetails?.length}
			<!-- if condition is temporary (to be removed later in phase 2) -->
			<section class="my-4 rounded bg-grey p-2">
				<div class="text-xs font-medium">Additional Charges on Withdrawal (if applicable)</div>
				{#each additionalChargesData as point, index (index)}
					<article class="mt-3 text-[11px]">
						<section class="flex items-center">
							<BigDotIcon class="mr-1" />
							<div>{point?.title}</div>
						</section>
						<div class="mt-1 ml-2">{point?.detail}</div>
					</article>
				{/each}
			</section>
		{/if}
	</section>

	<section class="bottom-0 mt-2 flex flex-col">
		<Button variant="contained" class="mb-2" onClick={primaryCtaClick}>STAY INVESTED</Button>

		<Button variant="transparent" onClick={secondaryCtaClick}>WITHDRAW</Button>
	</section>
</article>
