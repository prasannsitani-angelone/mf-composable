<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { INotification, Notif } from '$lib/types/INotifications';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import ActionCard from './ActionCard.svelte';
	import DateFns from '$lib/utils/asyncDateFns';
	import { onMount } from 'svelte';

	export let actionsData:
		| INotification
		| { instalmentFailedOrders: []; paymentFailedOrders: []; instalmentPending: [] };
	const onOrderFailedButtonClick = (order: Notif) => {
		goto(`${base}/orders/${order?.orderID}`);
	};
	const handleSipPaymentClick = (order: Notif) => {
		if (order?.orderID) {
			const reRouteUrl = 'schemes';
			const path = `${reRouteUrl}/${normalizeFundName(
				order?.schemeName,
				order?.isin,
				order?.schemeCode
			)}`;
			const { format } = DateFns.DateFns;

			let params = null;
			if (order?.isSipPaymentNudge) {
				params = encodeObject({
					investmentType: 'LUMPSUM',
					investmentAmount: order?.amount,
					skipOrderPad: true,
					sipInstalmentId: order?.orderID,
					isAdditionalFlag: true
				});
			} else {
				params = encodeObject({
					investmentType: 'SIP',
					investmentAmount: order?.amount,
					sipDate: new Date(order?.sipPaymentDate)?.getDate(),
					ftp: true,
					skipOrderPad: true,
					redirectedFrom: 'SIP_PAYMENTS',
					sipId: order?.sipId,
					sipRegistrationNumber: order?.sipRegistrationNo,
					sipDueDate: format(new Date(order?.sipPaymentDate), 'yyyy-MM-dd')
				});
			}
			goto(`${base}/${path}?params=${params}&orderpad=INVEST`);
		} else {
			goto(`${base}/sipbook/${order?.sipId}`);
		}
	};
	onMount(async () => {
		await DateFns.init();
	});
</script>

<section class="flex flex-col rounded-md bg-white px-2 pb-2 sm:bg-grey">
	{#if actionsData?.instalmentFailedOrders?.length > 0}
		<div class="py-2 font-medium">
			{actionsData?.instalmentFailedOrders?.length} SIP Payments Missed
		</div>
		{#each actionsData?.instalmentFailedOrders as order}
			<ActionCard
				{order}
				buttonText="PAY NOW"
				message="Pay now to continue your SIP"
				icon="red-exclamation"
				onButtonClick={handleSipPaymentClick}
			/>
		{/each}
	{/if}
	{#if actionsData?.instalmentPending?.length > 0}
		<div class="py-2 font-medium">
			{actionsData?.instalmentPending?.length} Pending SIP Payments
		</div>
		{#each actionsData?.instalmentPending as order}
			<ActionCard
				{order}
				buttonText="PAY NOW"
				message="Payment due by {getDateTimeString(order?.sipAmountPayTillDate)}"
				icon="clock"
				onButtonClick={handleSipPaymentClick}
			/>
		{/each}
	{/if}
	{#if actionsData?.paymentFailedOrders?.length > 0}
		<div class="py-2 font-medium">Recent Failed Orders</div>
		{#each actionsData?.paymentFailedOrders as order}
			<ActionCard
				{order}
				buttonText="RETRY"
				message={getDateTimeString(order?.orderDate)}
				icon="calander-icon"
				onButtonClick={onOrderFailedButtonClick}
			/>
		{/each}
	{/if}
</section>
