<script lang="ts">
	import WMSIcon from '$components/WMSIcon.svelte';
	import AmountSelectionComponent from './AmountSelectionComponent.svelte';
	import Link from '$components/Link.svelte';
	import Slider from '@bulatdashiev/svelte-slider';
	import RightChevron from '../../sipCalculator/icons/RightChevron.svelte';
	import { BtnSize, BtnVariant, Button } from 'svelte-components';
	import BarChartGraphComponent from '../../sipCalculator/components/BarChartGraphComponent.svelte';
	import { getSipReturns } from '../../sipCalculator/investmentCalculation';
	import { getDisplayAmount } from '../../sipCalculator/utils.js';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount.js';
	import type { SipCalcBarType } from '../../sipCalculator/components/types.js';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import {
		sipCalculatorEditClickAnalytics,
		sipCalculatorInvestButtonClickAnalytics,
		sipCalculatorNudgeImpressionAnalytics,
		sipCalculatorReturnsSliderAnalytics
	} from './analytics';
	import { modifiedGoto } from '$lib/utils/goto';

	export let MinRoiSlider = 1;
	export let MaxRoiSlider = 40;
	$: roiSlider = [12];
	$: selectedAmount = 1000;

	$: dataSet = [
		{
			durationInYears: 1,
			investedAmount: 0,
			gains: 0
		},
		{
			durationInYears: 3,
			investedAmount: 0,
			gains: 0
		},
		{
			durationInYears: 5,
			investedAmount: 0,
			gains: 0
		},
		{
			durationInYears: 10,
			investedAmount: 0,
			gains: 0
		}
	];

	function sliderChangeAnalytics() {
		sipCalculatorReturnsSliderAnalytics({
			InvType: 'SIP',
			amount: selectedAmount,
			returnabs: roiSlider[0]
		});
	}

	$: selectedAmount, performCalculation(), sliderChangeAnalytics();
	$: roiSlider, performCalculation(), sliderChangeAnalytics();

	let maxData: SipCalcBarType;

	const performCalculation = () => {
		const investedAmount = selectedAmount;
		const CAGR = roiSlider[0];

		dataSet = dataSet.map((it) => {
			const selectedYear = it.durationInYears;

			let investmentReturns;
			investmentReturns = getSipReturns(investedAmount, selectedYear, CAGR);

			it.investedAmount = investmentReturns.totalInvestment;
			it.gains = investmentReturns.capitalGain;
			return it;
		});
		maxData = dataSet[dataSet.length - 1];
	};

	const getExploreFundsPath = async () => {
		sipCalculatorInvestButtonClickAnalytics({
			InvType: 'SIP',
			amount: selectedAmount,
			returnabs: roiSlider[0]
		});

		const investmentType = 'SIP';
		const returnRangeStart = Math.max(roiSlider[0] - 2, 0);
		const returnRangeEnd = roiSlider[0] + 3;
		const query = `investmentType=${investmentType}&schemeType=Growth&threeYearReturn=${returnRangeStart}_${returnRangeEnd}`;
		await modifiedGoto(`${base}/filters/items?${query}`);
	};

	onMount(() => {
		sipCalculatorNudgeImpressionAnalytics({
			InvType: 'SIP',
			amount: selectedAmount,
			returnabs: roiSlider[0]
		});
	});
</script>

<div
	class="flex w-full flex-col items-center rounded-lg bg-background-alt p-4 shadow-csm {$$props.class}"
>
	<div class="mb-3 flex w-full items-start justify-between">
		<div class="text-base font-medium text-title">SIP Calculator</div>
		<Link to="/sipCalculator" on:linkClicked={sipCalculatorEditClickAnalytics}>
			<WMSIcon name="edit-thick" stroke="var(--PRIMARY)" />
		</Link>
	</div>

	<div class="mb-3 flex w-full flex-col items-start justify-start">
		<div class="text-xl font-medium text-title">
			Total Value: ₹{getDisplayAmount(maxData?.investedAmount + maxData?.gains)}
		</div>
		<div class="text-xs font-normal text-body">
			When you invest ₹{addCommasToAmountString(selectedAmount)}/month over {maxData?.durationInYears}
			years
		</div>
	</div>

	<div class="-mb-10 flex w-full flex-col items-start justify-start">
		<div class="flex items-center justify-start pb-2">
			<div class="h-2 w-[14px] rounded bg-tint24-buy" />
			<div class="pl-2 text-xs text-body">
				Investment - ₹{getDisplayAmount(maxData?.investedAmount)}
			</div>
		</div>
		<div class="flex items-center justify-start">
			<div class="h-2 w-[14px] rounded bg-buy pr-2" />
			<div class="pl-2 text-xs text-body">Gain - ₹{getDisplayAmount(maxData?.gains)}</div>
		</div>
	</div>

	<BarChartGraphComponent
		class="!mx-0 mb-3 w-full !justify-between gap-10 sm:w-fit sm:gap-20"
		bind:dataSet
	/>

	<div class="mb-3 flex w-full flex-col items-start justify-start">
		<div class="mb-2 text-center text-xs font-normal text-body">Monthly SIP Amount</div>
		<AmountSelectionComponent bind:selectedAmount />
	</div>

	<div class="w-full">
		<div class="mb-2 flex justify-between">
			<span class="flex items-center justify-center text-xs font-normal text-body">
				Expected Returns % (p.a.)
			</span>
			<div class="flex flex-row items-center">
				<div class="min-w-[45px] rounded bg-background px-2 py-1">
					<div class="text-right text-base font-medium text-title">
						{roiSlider[0]}%
					</div>
				</div>
			</div>
		</div>
		<div class="slider mb-0">
			<Slider
				class="h-[60px]"
				bind:value={roiSlider}
				min={MinRoiSlider}
				max={MaxRoiSlider}
				step={1}
			>
				<div class="h-5 w-5 rounded-full bg-primary" />
			</Slider>
		</div>
	</div>
	<Button
		on:click={getExploreFundsPath}
		size={BtnSize.XS}
		endAdornment={RightChevron}
		variant={BtnVariant.Transparent}
		class="w-full bg-background-alt !px-0 text-center text-sm font-medium uppercase text-primary sm:my-3"
	>
		FIND MUTUAL FUNDS
	</Button>
</div>
