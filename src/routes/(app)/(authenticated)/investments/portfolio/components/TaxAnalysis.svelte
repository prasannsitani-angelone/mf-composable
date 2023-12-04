<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import LinearChart from '$components/Charts/LinearChart.svelte';
	import TaxImplecationIcon from '$lib/images/icons/TaxImplecationIcon.svelte';
	import type { LinearChartInput } from '$lib/types/IChart';
	import type { ITaxation } from '$lib/types/IInvestments';
	import { WMSIcon } from 'svelte-components';

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
			investmentPercentage: 'stcgInvPercentage',
			investedAmount: 'stcgInvAmount',
			fillColor: '#FACE80',
			taxType: 'STCG'
		},
		{
			label: 'Long term investment',
			investmentPercentage: 'ltcgInvPercentage',
			investedAmount: 'ltcgInvAmount',
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
			fiscalYr.start = `${currentYear.charAt(2)}${currentYear.charAt(3)}`;
			fiscalYr.end = `${nextYr1.charAt(2)}${nextYr1.charAt(3)}`;
		} else {
			const nextYr2 = currentYear;
			fiscalYr.start = `${(today.getFullYear() - 1).toString().charAt(2)}${(today.getFullYear() - 1)
				.toString()
				.charAt(3)}`;
			fiscalYr.end = `${nextYr2.charAt(2) + nextYr2.charAt(3)}`;
		}

		return fiscalYr;
	}

	let taxationData: ITaxation = {
		stcgInvPercentage: 0,
		stcgInvAmount: 0,
		stcgInvUnits: 0,
		ltcgInvPercentage: 0,
		ltcgInvAmount: 0,
		ltcgInvUnits: 0,
		totalElssInvestedFy: 0,
		maxElssInvestAllowed: 0,
		elssInvestmentCap: 0
	};

	$: taxGainGraph = <LinearChartInput[]>(<unknown>[
		{
			name: 'STCG',
			color: '#FACE80',
			weightage: taxationData?.stcgInvPercentage?.toFixed(2)
		},
		{
			name: 'LTCG',
			color: '#019C81',
			weightage: taxationData?.ltcgInvPercentage?.toFixed(2)
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
		await goto(`${base}/investments/ltcg-stcg-gains?taxType=${taxType}&holdingType=EQUITY`);
	};
	export { taxationData };
</script>

<article class="rounded bg-white">
	<header class="flex border-b border-grey-line p-4">
		<div class="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-background">
			<TaxImplecationIcon width={20} height={21} />
		</div>
		<div class="flex flex-col">
			<h2 class="text-base text-black-key">Tax Analysis</h2>
			<h3 class="text-xs text-black-bolder">Your short term and long term gains</h3>
		</div>
	</header>
	<section class="flex flex-col border-b border-grey-line p-4">
		<h4 class="mb-3 text-sm font-medium text-black-key">Tax Capital Gains</h4>
		<p class="text-xs text-black-bolder">Fund split by holding period</p>
		<!-- For Graph -->
		<div class="mt-3">
			<LinearChart chartInput={taxGainGraph} />
		</div>
		<div class="mt-4">
			{#each investmentTypes as investmentType}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class={`flex items-start py-3 ${
						investmentType.label === 'Short term investment' ? 'border-b border-grey-line' : ''
					}`}
					on:click={() => {
						navigateToDetailedAnalysis(investmentType?.taxType);
					}}
					role="button"
					tabindex="0"
				>
					<div class="flex items-center">
						<div class="h-4 w-4 rounded-md" style={`background:${investmentType.fillColor}`} />
						<p class="ml-2 text-sm text-black-key">{investmentType.label}</p>
					</div>

					<div class="ml-auto flex">
						<div class="mr-3 flex flex-col">
							<p class="text-sm font-medium text-black-key">
								{taxationData[investmentType.investmentPercentage]?.toFixed(2) || 0}%
							</p>
							<p class="mt-1 text-xs text-black-bolder">
								₹{taxationData[investmentType.investedAmount]?.toFixed(2)}
							</p>
						</div>
						<div class="flex items-center justify-center">
							<WMSIcon name="right-arrow" width={16} height={16} />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="flex flex-col p-4">
		<h4 class="mb-3 text-sm font-medium text-black-key">Tax Exemption under 80C</h4>
		<p class="mb-4 text-xs text-black-bolder">
			You can invest ₹{taxationData.maxElssInvestAllowed} more in ELSS funds till March ‘{getCurrentFiscalYear()
				.end} to avail tax benefits for financial year ‘{getCurrentFiscalYear().start} to ‘{getCurrentFiscalYear()
				.end}
		</p>

		<div class="flex">
			<div class="flex flex-col">
				<p class="text-xs text-black-bolder">Invested</p>
				<p class="text-sm font-medium text-black-key">₹{taxationData.totalElssInvestedFy}</p>
			</div>
			<div class="ml-auto flex flex-col">
				<p class="text-right text-xs text-black-bolder">Limit</p>
				<p class="text-sm font-medium text-black-key">₹{taxationData.elssInvestmentCap}</p>
			</div>
		</div>
		<div class="mt-3">
			<LinearChart chartInput={elssInvestmetnGraph} />
		</div>
	</section>
</article>
