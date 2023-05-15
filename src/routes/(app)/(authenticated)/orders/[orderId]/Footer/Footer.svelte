<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import { INVESTMENT_TYPE, TRANSACTION_TYPE } from '$lib/constants/transactionType';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { base } from '$app/paths';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { encodeObject } from '$lib/utils/helpers/params';
	import type { IOrderDetails } from '$lib/types/IOrderDetails';
	import {
		placeNewOrderCtaClickAnalytics,
		retryCtaClickAnalytics
	} from '$lib/analytics/orders/orders';

	let isOrderFailedAtExchange: boolean;
	let schemeDetails: SchemeDetails;
	let orderDetailsData: IOrderDetails;
	$: deviceType = $page?.data?.deviceType;
	const orderDetailsFooterCtaAnalytics = () => {
		if (isOrderFailedAtExchange) {
			placeNewOrderCtaClickAnalytics();
		} else {
			const eventMetaData = {
				Message: 'Payment processing failed at Angel One'
			};

			retryCtaClickAnalytics(eventMetaData);
		}
	};
	const handleFooterCtaClick = () => {
		orderDetailsFooterCtaAnalytics();
		let reRouteUrl = 'schemes';
		let orderpad = 'INVEST';
		if (orderDetailsData?.transactionType === TRANSACTION_TYPE.REDEEM) {
			reRouteUrl = 'investments';
			orderpad = 'REDEEM';
		}
		const routerPath = `${reRouteUrl}/${normalizeFundName(
			schemeDetails?.schemeName,
			schemeDetails?.isin,
			schemeDetails?.schemeCode
		)}`;
		let params = '';
		if (orderDetailsData?.transactionType === TRANSACTION_TYPE.PURCHASE) {
			if (isOrderFailedAtExchange) {
				params = encodeObject({
					investmentType: orderDetailsData?.investmentType,
					investmentAmount: orderDetailsData?.amount
				});
			} else {
				params = encodeObject({
					orderId: orderDetailsData?.orderId,
					pgTxnId: orderDetailsData?.pgTxnId,
					investmentType: orderDetailsData?.investmentType,
					investmentAmount: orderDetailsData?.amount
				});
			}
		}

		if (params) {
			goto(`${base}/${routerPath}?params=${params}&orderpad=${orderpad}`);
		} else {
			goto(`${base}/${routerPath}?orderpad=${orderpad}`);
		}
	};
	export { isOrderFailedAtExchange, schemeDetails, orderDetailsData };
</script>

{#if deviceType?.isMobile}
	<!-- Mobile view footer button -->
	<article class="mx-3 mt-4 block md:hidden">
		<section class="fixed inset-0 top-auto bg-white px-4 py-5">
			<Button class="w-full" onClick={handleFooterCtaClick}>
				{orderDetailsData?.investmentType === INVESTMENT_TYPE.REDEEM
					? 'RETRY WITHDRAWAL'
					: isOrderFailedAtExchange
					? 'PLACE NEW ORDER'
					: 'RETRY PAYMENT'}
			</Button>
		</section>
	</article>
{:else}
	<!-- Desktop view footer button -->
	<article class="w-full text-right">
		<Button class="w-6/12 sm:max-w-21" onClick={handleFooterCtaClick}>
			{orderDetailsData?.investmentType === INVESTMENT_TYPE.REDEEM
				? 'RETRY WITHDRAWAL'
				: isOrderFailedAtExchange
				? 'PLACE NEW ORDER'
				: 'RETRY PAYMENT'}
		</Button>
	</article>
{/if}
