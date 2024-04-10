<script lang="ts">
	import Card from '$components/Card.svelte';
	import type {
		FolioHoldingType,
		InternalInvestmentSummary,
		InvestmentSummary
	} from '$lib/types/IInvestments';
	import { getTimestampHoursDifference } from '$lib/utils/helpers/date';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { createEventDispatcher } from 'svelte';
	import type { PageData } from '../$types';
	import FetchFundsFlowModal from '../../(dashboard)/components/FetchFundsFlowModal.svelte';
	import RefreshErrorModal from '../../(dashboard)/components/RefreshErrorModal.svelte';
	import RefreshFunds from '../../(dashboard)/components/RefreshFunds.svelte';
	import { refreshWaitHours } from '../../constants';

	export let folioSummary: InternalInvestmentSummary | InvestmentSummary | FolioHoldingType;
	export let xirr = 0;
	export let isExternal = false;
	export let data: PageData;

	let refreshNotAllowed = false;
	let otpInitiated = false;
	let otpFlow: 'INITIAL' | 'REFRESH' = 'INITIAL';
	let otpStep: 'GENERATE' | 'VERIFY' | 'SUCCESS' = 'GENERATE';

	const dispatch = createEventDispatcher();

	const handlefetchFundsSuccess = () => {
		dispatch('fetchFundsSuccess');
	};

	const onModalClick = () => {
		otpInitiated = false;
		refreshNotAllowed = false;
	};

	const hasWaitingPeriodPassedPostRefresh = (summary: InvestmentSummary) => {
		const hourDiff = getTimestampHoursDifference(Date.now(), summary?.lastSuccessfullImportTs);
		return hourDiff >= refreshWaitHours;
	};

	const isRefreshAllowed = (data: InvestmentSummary) => {
		return hasWaitingPeriodPassedPostRefresh(data);
	};

	const onRefreshFunds = (summary: InvestmentSummary) => {
		if (isRefreshAllowed(summary)) {
			otpInitiated = true;
			otpFlow = 'REFRESH';
		} else {
			refreshNotAllowed = true;
		}
	};
</script>

<article>
	<Card class="mb-2">
		{#if isExternal}
			<div
				class="mb-3 inline-block rounded bg-tint12-secondary-alt px-2 py-1 text-xs font-normal text-secondary-alt"
			>
				Includes External Investments
			</div>
		{/if}
		<section class="grid grid-cols-2 divide-x">
			<div>
				<h3 class="text-xs font-normal text-body">Current Value</h3>
				<p class="text-lg font-medium text-title">
					{folioSummary?.currentValue < 0 ? '-' : ''}₹{!Number.isNaN(
						Math.abs(folioSummary?.currentValue)
					)
						? addCommasToAmountString(Math.abs(folioSummary?.currentValue)?.toFixed(2))
						: ''}
				</p>
			</div>
			<div class="text-right">
				<h3 class="text-xs font-normal text-body">Total Invested</h3>
				<p class="text-lg font-medium text-title">
					₹{!Number.isNaN(Math.abs(folioSummary?.investedValue))
						? addCommasToAmountString(Math.abs(folioSummary?.investedValue)?.toFixed(2))
						: ''}
				</p>
			</div>
		</section>
		<section
			class="mt-3 flex rounded bg-background p-2"
			class:justify-between={!isExternal}
			class:justify-center={isExternal}
		>
			<div>
				<h3 class="text-xs font-normal text-body" class:text-center={isExternal}>Total Returns</h3>
				<p class="text-xs font-medium text-title">
					{folioSummary?.returnsValue < 0 ? '-' : ''}₹{!Number.isNaN(
						Math.abs(folioSummary?.returnsValue)
					)
						? addCommasToAmountString(Math.abs(folioSummary?.returnsValue)?.toFixed(2))
						: ''}
					<span
						class={folioSummary?.returnsValue > 0
							? 'text-buy'
							: folioSummary?.returnsValue < 0
							? 'text-sell'
							: ''}
						>({folioSummary?.returnsAbsolutePer > 0
							? '+'
							: ''}{folioSummary?.returnsAbsolutePer?.toFixed(2)}%)</span
					>
				</p>
			</div>
			{#if !isExternal}
				<div class="text-right">
					<h3 class="text-xs font-normal text-body">XIRR</h3>
					<p class="text-xs font-medium text-title">
						{xirr < 0 ? '-' : ''}
						{xirr ? addCommasToAmountString(Math.abs(xirr)?.toFixed(2)) + '%' : '- -'}
					</p>
				</div>
			{/if}
		</section>
		{#if isExternal}
			<RefreshFunds
				class="!pb-0 !pt-3"
				summary={folioSummary}
				onButtonClick={() => onRefreshFunds(folioSummary)}
			/>
		{/if}
	</Card>
</article>

{#if refreshNotAllowed}
	<RefreshErrorModal {onModalClick} summary={folioSummary} />
{:else if otpInitiated}
	<FetchFundsFlowModal
		flow={otpFlow}
		step={otpStep}
		{data}
		{onModalClick}
		onfetchFundsSuccess={handlefetchFundsSuccess}
	/>
{/if}
