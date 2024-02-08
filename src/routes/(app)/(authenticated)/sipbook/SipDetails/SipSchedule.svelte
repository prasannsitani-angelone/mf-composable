<script lang="ts">
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	let amount: number;
	let nextSipDateTs: number;
	export { amount, nextSipDateTs };
</script>

<section class={`rounded-t-lg bg-background-alt px-4 pb-0 pt-5 shadow-csm ${$$props.class}`}>
	<div class="font-normal text-title">SIP Schedule</div>

	<article class="mt-3 rounded border p-4 font-normal">
		<section class="flex items-baseline justify-between">
			<div class="text-xs text-body">Instalment Amount</div>
			<div class="text-base text-title">
				₹{addCommasToAmountString(amount?.toFixed(0))}
			</div>
		</section>

		<section class="mt-4 flex items-baseline justify-between">
			<div class="text-xs text-body">Next SIP Payment</div>
			<div class="text-base text-title">
				{getDateTimeString(nextSipDateTs, 'DATE', true)}
			</div>
		</section>
	</article>
</section>
