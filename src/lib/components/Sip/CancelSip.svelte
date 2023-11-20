<script lang="ts">
	import { RadioButton } from 'svelte-components';
	import InfoDoubleIcon from '$lib/images/icons/InfoDoubleIcon.svelte';
	import { SIP_CANCEL_REASONS } from '$lib/constants/sip';
	import { createEventDispatcher } from 'svelte';
	import { calculateSipReturns } from '$lib/utils/helpers/returns';
	import CancelSipFooter from '$components/Sip/CancelSipFooter.svelte';
	import CancelSipProjectedGraph from '$components/Sip/CancelSipProjectedGraph.svelte';
	import type { IReturnsProjectedGraphDataTypes } from '$lib/types/ISipType';

	export let instalmentAmount: number;
	export let categoryName: string;
	export let subCategoryName: string;

	const dispatch = createEventDispatcher();

	let fiveYearMaturityAmount = 0;
	let fiveYearGainLossPercentage = 0;
	let selectedReason = '';

	const handleSelectedReasonChange = (val: number) => {
		selectedReason = SIP_CANCEL_REASONS?.find((reason) => reason?.id === val)?.text || '';
		dispatch('sipCancellationReasonChange', val);
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

	const get5YearReturns = () => {
		const fiveYearReturns = calculateSipReturns(instalmentAmount, 5, getDefaultCagr());
		fiveYearMaturityAmount = fiveYearReturns?.matuarityAmount;
		fiveYearGainLossPercentage = fiveYearReturns?.gainLossPercentage;
	};

	get5YearReturns();

	const graphData: IReturnsProjectedGraphDataTypes = [
		{
			type: 'INSTALMENT_AMOUNT',
			amount: instalmentAmount,
			returnPercentage: 0,
			xAxisTitle1: 'Instalment Amount',
			xAxisTitle2: '',
			barHeight: 9
		},
		{
			type: '5Y_RETURN',
			amount: fiveYearMaturityAmount,
			returnPercentage: fiveYearGainLossPercentage,
			xAxisTitle1: 'After 5 Years',
			xAxisTitle2: '',
			barHeight: 24
		}
	];

	const tooltipData: string[] = [
		'Standard returns calculated based on fund asset type:',
		'Equity: 12%',
		'Hybrid: 10%',
		'Debt: 7%',
		'Liquid: 4%'
	];

	const handleCancelSipClick = () => {
		dispatch('cancelSipClick', selectedReason);
	};

	const handleStayInvestedClick = () => {
		dispatch('stayInvestedClick');
	};
</script>

<section class="-m-2 {$$props?.class || ''}">
	<section class="hidden sm:block">
		<div class="text-base font-medium text-black-key">Cancel SIP</div>
	</section>
	<!--Top Yellow Warning-->
	<article class="flex items-center bg-yellow-background px-4 py-2 font-normal md:mt-4 md:rounded">
		<div>
			<InfoDoubleIcon />
		</div>
		<div class="ml-2 text-xs text-black-key">
			Cancelling an SIP early stops you from taking advantage of the compounding effect
		</div>
	</article>

	<!--Body section-->
	<section class="mb-20 bg-white md:mb-0">
		<!--Graph Section-->
		<article>
			<div class="mx-5 pb-3 pt-6 text-sm font-medium text-black-key md:mx-0 md:pb-6 md:pt-3">
				Projected value for your SIP is calculated based on fund asset type
			</div>

			<!--Graph-->
			<CancelSipProjectedGraph {graphData} {tooltipData} />

			<div class="mx-4 mt-3 text-[11px] font-normal text-black-bolder md:mx-0">
				Disclaimer: Projected value is calculated based on instalment amount only and does not
				consider your current or future investment in this fund. Your actual returns may vary.
			</div>
		</article>

		<!--Reason Selection-->
		<section class="p-4 md:px-0">
			<div class="text-sm font-medium text-black-key">
				<div class="md:hidden">We want to help you reach your financial goals!</div>
				<div class="md:hidden">Please tell us why you want to cancel your SIP</div>
				<div class="hidden md:inline-block">
					We want to help you reach your financial goals! Please tell us why you want to cancel your
					SIP
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			{#each SIP_CANCEL_REASONS as reason}
				<article
					class="mt-6 flex items-center justify-between md:cursor-pointer"
					on:click={() => handleSelectedReasonChange(reason?.id)}
				>
					<div class="text-sm font-normal text-black-key">{reason?.text}</div>

					<RadioButton
						class="scale-125 !border-[1px] !bg-white {selectedReason !== reason?.text
							? '!border-black-bolder'
							: ''}"
						selected={selectedReason === reason?.text}
					/>
				</article>
			{/each}
		</section>
	</section>

	<CancelSipFooter
		{selectedReason}
		on:cancelSipButtonClick={handleCancelSipClick}
		on:stayInvestedButtonClick={handleStayInvestedClick}
	/>
</section>
