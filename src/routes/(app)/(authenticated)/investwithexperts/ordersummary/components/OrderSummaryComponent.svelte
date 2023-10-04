<script lang="ts">
	import { base } from '$app/paths';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { OrderSummaryStatus } from './OrderSummaryStatus';
	import { WMSIcon } from 'svelte-components';

	export let sipAmount: number;
	export let sipNextDate: number;
	export let status: OrderSummaryStatus;

	function getStatusTitle() {
		if (status == OrderSummaryStatus.SUCCESS) {
			return 'Order Placed Successfully';
		} else if (status == OrderSummaryStatus.PENDING) {
			return 'Confirming Your Payment';
		}
	}

	function getStatusDescription() {
		if (status == OrderSummaryStatus.SUCCESS) {
			return 'Your portfolio will be updated within 48 hours';
		} else if (status == OrderSummaryStatus.PENDING) {
			return 'Your payment status is pending. We will notify you once we have an update';
		}
	}

	function getImagePath() {
		if (status == OrderSummaryStatus.SUCCESS) {
			return `${base}/images/invest_with_expert_success.webp`;
		} else if (status == OrderSummaryStatus.PENDING) {
			return `${base}/images/invest_with_expert_pending.webp`;
		}
	}
</script>

<article class="bg-white py-1 {$$props.class}">
	<div class="m-3 flex flex-row items-center justify-center rounded-lg bg-green-pale p-2">
		{#if status === OrderSummaryStatus.SUCCESS}
			<div class="mx-3">
				<WMSIcon name="well-done" />
			</div>
		{/if}
		<p class="text-center text-lg font-normal text-black-title">
			{getStatusTitle()}
		</p>
	</div>

	<img src={getImagePath()} alt="Order Status" />

	<div class="m-3 rounded-lg bg-gradient-to-l from-green p-3 text-sm font-normal">
		{getStatusDescription()}
	</div>

	<section class="mx-3 mb-4 flex items-center justify-between rounded bg-grey px-4 py-3">
		<article class="flex-1">
			<div class="text-xs font-normal text-grey-body">Total SIP Amount</div>
			<div class="text-base font-normal text-black-title">
				₹{addCommasToAmountString(Math.trunc(sipAmount ?? 0))}
			</div>
		</article>

		<article class="flex-1 text-right">
			<div class="text-xs font-normal text-grey-body">Next SIP Payment</div>
			<div class="text-base font-normal text-black-title">
				{getDateTimeString(sipNextDate, 'DATE', true)}
			</div>
		</article>
	</section>
</article>
