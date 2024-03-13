<script lang="ts">
	import Card from '$components/Card.svelte';
	import type { InternalInvestmentSummary } from '$lib/types/IInvestments';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	export let folioSummary: InternalInvestmentSummary;
</script>

<article>
	<Card class="mb-2">
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
		<section class="mt-3 flex justify-between rounded bg-background p-2">
			<div>
				<h3 class="text-xs font-normal text-body">Total Returns</h3>
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
			<div class="text-right">
				<h3 class="text-xs font-normal text-body">XIRR</h3>
				<p class="text-xs font-medium text-title">
					{folioSummary?.xirr < 0 ? '-' : ''}
					{!Number.isNaN(Math.abs(folioSummary?.xirr))
						? addCommasToAmountString(Math.abs(folioSummary?.xirr)?.toFixed(2))
						: ''}%
				</p>
			</div>
		</section>
	</Card>
</article>
