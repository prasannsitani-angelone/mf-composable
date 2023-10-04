<script lang="ts">
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	let amount: number;
	let nextSipDateTs: number;
	export { amount, nextSipDateTs };
</script>

<section class={`rounded-lg bg-white px-4 py-5 shadow-csm ${$$props.class}`}>
	<div class="font-normal text-black-title">SIP Schedule</div>

	<article class="mt-3 rounded border p-4 font-normal">
		<section class="flex items-baseline justify-between">
			<div class="text-xs text-grey-body">Instalment Amount</div>
			<div class="text-base text-black-title">
				₹{addCommasToAmountString(amount?.toFixed(0))}
			</div>
		</section>

		<section class="mt-4 flex items-baseline justify-between">
			<div class="text-xs text-grey-body">Next SIP Payment</div>
			<div class="text-base text-black-title">
				{getDateTimeString(nextSipDateTs, 'DATE', true)}
			</div>
		</section>
	</article>
</section>
