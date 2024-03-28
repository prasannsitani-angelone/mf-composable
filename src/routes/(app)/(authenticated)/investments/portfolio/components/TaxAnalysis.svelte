<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import AmountText from '$components/AmountText.svelte';
	import Button from '$components/Button.svelte';
	import LinearChart from '$components/Charts/LinearChart.svelte';
	import TaxationIcon from '$lib/images/icons/TaxationIcon.svelte';
	import type { LinearChartInput } from '$lib/types/IChart';
	import type { ITaxation } from '$lib/types/IInvestments';
	import { BtnVariant, WMSIcon } from 'svelte-components';
	import {
		longTermInvestmentClickAnalytics,
		shortTermInvestmentClickAnalytics
	} from '../../analytics';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { schemeScreenerStore } from '$lib/stores/SchemeScreenerStore';

	interface IInvestmentTypes {
		label: string;
		investmentPercentage: string;
		investedAmount: string;
		fillColor: '#019C81' | '#FACE80';
		taxType: 'STCG' | 'LTCG';
	}

	const investmentTypes: IInvestmentTypes[] = [
		{
			label: 'Short term investment',
			investmentPercentage: 'stcgCurPercentage',
			investedAmount: 'stcgCurAmount',
			fillColor: '#FACE80',
			taxType: 'STCG'
		},
		{
			label: 'Long term investment',
			investmentPercentage: 'ltcgCurPercentage',
			investedAmount: 'ltcgCurAmount',
			fillColor: '#019C81',
			taxType: 'LTCG'
		}
	];

	function getCurrentFiscalYear() {
		const today = new Date();
		const curMonth = today.getMonth();
		const currentYear = today.getFullYear().toString();
		const fiscalYr = { start: '', end: '' };

		if (curMonth > 3) {
			const nextYr1 = (today.getFullYear() + 1).toString();
			fiscalYr.start = currentYear;
			fiscalYr.end = nextYr1;
		} else {
			const nextYr2 = currentYear;
			fiscalYr.start = (today.getFullYear() - 1).toString();
			fiscalYr.end = nextYr2;
		}

		return fiscalYr;
	}

	let taxationData: ITaxation = {
		stcgCurPercentage: 0,
		stcgCurAmount: 0,
		stcgInvUnits: 0,
		ltcgCurAmount: 0,
		ltcgCurPercentage: 0,
		ltcgInvUnits: 0,
		totalElssInvestedFy: 0,
		maxElssInvestAllowed: 0,
		elssInvestmentCap: 0
	};

	$: taxGainGraph = <LinearChartInput[]>(<unknown>[
		{
			name: 'STCG',
			color: '#FACE80',
			weightage: taxationData?.stcgCurPercentage?.toFixed(2)
		},
		{
			name: 'LTCG',
			color: '#019C81',
			weightage: taxationData?.ltcgCurPercentage?.toFixed(2)
		}
	]);

	$: elssInvestmetnGraph = <LinearChartInput[]>[
		{
			name: 'Invested',
			color: '#008F75',
			weightage: (taxationData?.totalElssInvestedFy / taxationData?.elssInvestmentCap) * 100
		},
		{
			name: 'Remaining',
			color: '#E0F2EE',
			weightage: (taxationData?.maxElssInvestAllowed / taxationData?.elssInvestmentCap) * 100
		}
	];
	const navigateToDetailedAnalysis = async (taxType: string) => {
		let investmentPercent;
		let investedAmt;
		if (taxType === 'STCG') {
			investmentPercent = taxationData[investmentTypes[0].investmentPercentage]?.toFixed(2) || 0;
			investedAmt = taxationData[investmentTypes[0].investedAmount]?.toFixed(2);

			shortTermInvestmentClickAnalytics({
				shortterminvestment: `${investmentPercent}%`,
				Currentvalue: investedAmt
			});
		} else if (taxType === 'LTCG') {
			investmentPercent = taxationData[investmentTypes[1]?.investmentPercentage]?.toFixed(2) || 0;
			investedAmt = taxationData[investmentTypes[1]?.investedAmount]?.toFixed(2);

			longTermInvestmentClickAnalytics({
				longterminvestment: `${investmentPercent}%`,
				Currentvalue: investedAmt
			});
		}

		const params = encodeObject({
			investmentPercent,
			investedAmt
		});
		await goto(
			`${base}/investments/ltcg-stcg-gains?taxType=${taxType}&holdingType=EQUITY&params=${params}`
		);
	};
	const gotoExploreMore = async () => {
		schemeScreenerStore?.getFiltersResponse('subCategory=ELSS');
		await goto(`${base}/filters/items`);
	};

	export { taxationData };
</script>

<article class="rounded bg-background-alt {$$props.class}">
	<header class="flex border-b p-4">
		<div class="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-background">
			<TaxationIcon />
		</div>
		<div class="flex flex-col">
			<h2 class="text-base text-title">Tax Overview</h2>
			<h3 class="text-xs text-body">Your short term and long term gains</h3>
		</div>
	</header>
	<section class="flex flex-col border-b p-4">
		<h4 class="mb-3 text-sm font-medium text-title">Capital Gains Tax Split</h4>
		<p class="text-xs text-body">Applicable on your portfolio if you withdraw today</p>
		<!-- For Graph -->
		<div class="mt-3">
			<LinearChart chartInput={taxGainGraph} />
		</div>
		<div>
			{#each investmentTypes as investmentType}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class={`flex items-center ${
						investmentType.label === 'Short term investment'
							? 'border-b border-border pb-3'
							: 'pt-3'
					}`}
					on:click={() => {
						navigateToDetailedAnalysis(investmentType?.taxType);
					}}
					role="button"
					tabindex="0"
				>
					<div class="flex items-center">
						<div class="h-4 w-4 rounded-md" style={`background:${investmentType.fillColor}`} />
						<p class="ml-2 text-sm text-title">{investmentType.label}</p>
					</div>

					<div class="ml-auto flex">
						<div class="mr-3 flex flex-col items-end">
							<p class="text-sm font-medium text-title">
								{taxationData[investmentType.investmentPercentage]?.toFixed(2) || 0}%
							</p>
							<p class="mt-1 text-xs text-body">
								<AmountText amount={taxationData[investmentType.investedAmount]?.toFixed(2)} />
							</p>
						</div>
						<div class="flex items-center justify-center">
							<WMSIcon name="right-arrow" width={17} height={17} stroke="#425061" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="flex flex-col p-4">
		<h4 class="mb-3 text-sm font-medium text-title">Save Taxes with ELSS Funds</h4>

		<p class="mb-4 text-xs text-body">
			{#if taxationData?.totalElssInvestedFy >= taxationData?.elssInvestmentCap}
				You have already invested
				<AmountText amount={taxationData?.elssInvestmentCap?.toFixed()} />
				in ELSS funds and availed tax benefits for financial year {getCurrentFiscalYear().start}
				to ‘{getCurrentFiscalYear().end}
			{:else}
				Invest up to
				<AmountText amount={taxationData?.maxElssInvestAllowed?.toFixed()} />
				more in ELSS funds till March {getCurrentFiscalYear().end} to reduce your taxable income by
				<span class="font-bold">₹1.5 Lakh</span>
				under
				<span class="font-bold">section 80C</span> of the Income Tax Act of India
			{/if}
		</p>

		<div class="flex">
			<div class="flex flex-col">
				<p class="text-xs text-body">Invested</p>
				<p class="text-sm font-medium text-title">
					<AmountText amount={taxationData?.totalElssInvestedFy?.toFixed()} />
				</p>
			</div>
			<div class="ml-auto flex flex-col">
				<p class="text-right text-xs text-body">Limit</p>
				<p class="text-sm font-medium text-title">
					<AmountText amount={taxationData?.elssInvestmentCap?.toFixed()} />
				</p>
			</div>
		</div>
		<div class="mt-3">
			<LinearChart chartInput={elssInvestmetnGraph} />
		</div>
		{#if taxationData?.totalElssInvestedFy < taxationData?.elssInvestmentCap}
			<div class="flex items-center justify-between md:my-2">
				<h4 class="text-sm font-medium text-title">Explore Tax Saving Funds</h4>
				<Button
					variant={BtnVariant.Contained}
					size="sm"
					class="px-2 py-0 text-xs font-medium"
					onClick={gotoExploreMore}
				>
					EXPLORE NOW
				</Button>
			</div>
		{/if}
	</section>
</article>
