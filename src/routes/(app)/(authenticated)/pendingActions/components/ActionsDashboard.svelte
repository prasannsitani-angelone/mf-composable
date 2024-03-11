<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { INotification, Notif } from '$lib/types/INotifications';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import DateFns from '$lib/utils/asyncDateFns';
	import { onMount } from 'svelte';
	import {
		actNowClick,
		actionCentreImpression
	} from '$lib/analytics/pendingActionCenter/analytics';
	import type { IActionItem } from '$lib/analytics/pendingActionCenter/analytics';
	import PaymentOrderCard from '$components/Cohorts/PaymentOrderCard.svelte';
	import { SIP_ORDER_CARD_TYPES } from '$lib/constants/actions';

	export let actionsData:
		| INotification
		| { instalmentFailedOrders: []; paymentFailedOrders: []; instalmentPending: [] };

	const onOrderFailedButtonClick = (order: Notif) => {
		goto(`${base}/orders/${order?.orderID}`);
		actNowClick({
			FundName: order?.schemeName,
			Amount: order?.amount,
			Heading: 'Recent Failed Orders',
			cta: 'retry'
		});
	};

	const handleFailedSipPaymentClick = (order: Notif) => {
		if (order?.orderID) {
			const reRouteUrl = 'schemes';
			const path = `${reRouteUrl}/${normalizeFundName(
				order?.schemeName,
				order?.isin,
				order?.schemeCode
			)}`;

			let params = null;
			params = encodeObject({
				investmentType: 'LUMPSUM',
				investmentAmount: order?.amount,
				skipOrderPad: true,
				sipInstalmentId: order?.orderID.toString(),
				isAdditionalFlag: true
			});

			goto(`${base}/${path}?params=${params}&orderpad=INVEST`);
		} else {
			goto(`${base}/sipbook/dashboard`);
		}
		actNowClick({
			FundName: order?.schemeName,
			Amount: order?.amount,
			Heading: `${actionsData?.instalmentFailedOrders?.length} SIP Payments Missed`,
			cta: 'paynow'
		});
	};

	const handlePendingSipPaymentClick = (order: Notif) => {
		if (order?.sipId) {
			const reRouteUrl = 'schemes';
			const path = `${reRouteUrl}/${normalizeFundName(
				order?.schemeName,
				order?.isin,
				order?.schemeCode
			)}`;
			const { format } = DateFns.DateFns;

			let params = null;
			params = encodeObject({
				investmentType: 'SIP',
				investmentAmount: order?.installmentAmount,
				sipDate: new Date(order?.sipPaymentDate)?.getDate(),
				ftp: true,
				skipOrderPad: true,
				redirectedFrom: 'SIP_PAYMENTS',
				sipId: order?.sipId,
				sipRegistrationNumber: order?.sipRegistrationNo,
				sipDueDate: format(new Date(order?.sipPaymentDate), 'yyyy-MM-dd')
			});
			goto(`${base}/${path}?params=${params}&orderpad=INVEST`);
		} else {
			goto(`${base}/sipbook/${order?.sipId}`);
		}
		actNowClick({
			FundName: order?.schemeName,
			Amount: order?.amount,
			Heading: `${actionsData?.instalmentPending?.length} Pending SIP Payments`,
			cta: 'paynow'
		});
	};
	onMount(async () => {
		await DateFns.init();
		const items: IActionItem[] = [];
		actionsData?.instalmentFailedOrders?.forEach((x) => {
			const item: IActionItem = {
				heading: `${actionsData?.instalmentFailedOrders?.length} SIP Payments Missed`,
				fundName: x.schemeName,
				amount: x.amount
			};
			items.push(item);
		});
		actionsData?.instalmentPending?.forEach((x) => {
			const item: IActionItem = {
				heading: `${actionsData?.instalmentPending?.length} Pending SIP Payments`,
				fundName: x.schemeName,
				amount: x.amount
			};
			items.push(item);
		});
		actionsData?.paymentFailedOrders?.forEach((x) => {
			const item: IActionItem = {
				heading: `Recent Failed Orders`,
				fundName: x.schemeName,
				amount: x.amount
			};
			items.push(item);
		});
		const metaData = {
			pending: actionsData?.instalmentPending?.length,
			failedInstallment: actionsData?.instalmentFailedOrders?.length,
			failed: actionsData?.paymentFailedOrders?.length,
			items: items
		};
		actionCentreImpression(metaData);
	});
</script>

<section class="-md:mt-4 -mt-2 flex flex-col rounded-md pb-2">
	{#if actionsData?.instalmentPending?.length > 0}
		<section class="mt-2 md:mt-4">
			<PaymentOrderCard
				sipList={actionsData?.instalmentPending || []}
				on:buttonClick={(e) => handlePendingSipPaymentClick(e?.detail)}
				cardType={SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_DUE}
			/>
		</section>
	{/if}
	{#if actionsData?.instalmentFailedOrders?.length > 0}
		<section class="mt-2 md:mt-4">
			<PaymentOrderCard
				sipList={actionsData?.instalmentFailedOrders || []}
				on:buttonClick={(e) => handleFailedSipPaymentClick(e?.detail)}
				cardType={SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_MISSED}
			/>
		</section>
	{/if}
	{#if actionsData?.paymentFailedOrders?.length > 0}
		<section class="mt-2 md:mt-4">
			<PaymentOrderCard
				sipList={actionsData?.paymentFailedOrders || []}
				on:buttonClick={(e) => onOrderFailedButtonClick(e?.detail)}
				cardType={SIP_ORDER_CARD_TYPES?.FAILED_ORDER}
			/>
		</section>
	{/if}
</section>
