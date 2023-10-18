<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Header from './Header/HeaderComponent.svelte';
	import { format } from 'date-fns';
	import { decodeToObject, encodeObject } from '$lib/utils/helpers/params';
	import SchemeCard from './SchemeCard/SchemeCard.svelte';
	import OrderStatusCard from './OrderStatusCard/OrderStatusCard.svelte';
	import AutopayTile from './AutopayEnabledTile/AutopayEnabledTile.svelte';
	import Button from '$components/Button.svelte';
	import { onMount } from 'svelte';
	import type { SIPData } from './type';
	import { goToDashboardButtonAnalytics, orderScreenOpenAnalytics } from './analytics';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { invalidate } from '$app/navigation';
	import { SEO } from 'svelte-components';
	import { ORDER_STATUS } from '$lib/constants/orderFlowStatuses';
	import OrdersAutoPayComponent from '$components/AutopaySetupTile/OrdersAutoPayComponent.svelte';
	import { base } from '$app/paths';
	export let data: PageData;

	const params = $page.url.searchParams.get('params') || '';
	const decodedParams = decodeToObject(params);
	const { firstTimePayment, orderID, sipID, amount, date } = decodedParams;

	let orderStatusString = '';
	let paymentStatusString = '';

	const navigateToOrders = async () => {
		const { orderData } = await data.api.data;

		orderStatusString = orderData?.data?.data?.status || '';
		paymentStatusString = orderData?.data?.data?.paymentStatus || '';

		let orderStatus = '';

		if (orderStatusString === 'ORDER_REJECTED' || paymentStatusString === 'failure') {
			orderStatus = 'failed';
		} else if (
			orderStatusString === ORDER_STATUS?.ORDER_COMPLETE ||
			paymentStatusString === 'success'
		) {
			orderStatus = 'success';
		} else {
			orderStatus = 'pending';
		}

		const eventMetaData = {
			InvestmentType: isSIPOrder ? 'SIP' : 'OTI',
			FirstSipPayment: firstTimePayment,
			status: orderStatus
		};

		goToDashboardButtonAnalytics(eventMetaData);

		await goto('orders/orderspage', { replaceState: true });
	};

	const navigateToSipBook = async () => {
		await goto('sipbook/dashboard', { replaceState: true });
	};

	const onRefresh = async () => {
		invalidate('app:ordersummary');
	};

	const navigateToEmandate = () => {
		const params = encodeObject({
			amount: amount,
			date: date,
			sipID: sipID
		});
		goto(`${base}/autopay/manage?params=${params}`);
	};

	const getNextSIPDate = (data: SIPData = {}) => {
		return data?.startDate ? format(new Date(data.startDate), 'dd MMM yyyy') : '';
	};

	const isLumpsumOrder = orderID && !sipID;
	const isSIPOrder = (orderID && sipID) || (!firstTimePayment && sipID);

	const onMountAnalytics = async () => {
		const { orderData, sipData, emandateBankDetails } = await data.api.data;
		const sd = sipData?.data?.data;
		const od = orderData?.data?.data;

		orderStatusString = orderData?.data?.data?.status || '';
		paymentStatusString = orderData?.data?.data?.paymentStatus || '';

		let orderStatus = '';

		if (
			(isLumpsumOrder && orderData?.ok) ||
			(isSIPOrder && ((orderData?.ok && sipData?.ok) || (sipData?.ok && !firstTimePayment)))
		) {
			if (orderStatusString === 'ORDER_REJECTED' || paymentStatusString === 'failure') {
				orderStatus = 'failed';
			} else if (
				orderStatusString === ORDER_STATUS?.ORDER_COMPLETE ||
				paymentStatusString === 'success'
			) {
				orderStatus = 'success';
			} else {
				orderStatus = 'pending';
			}
		}

		orderScreenOpenAnalytics({
			FundName: sd?.schemeName,
			isin: sd?.isin,
			Amount: sd?.installmentAmount,
			investmentType: 'SIP',
			NextSIPPayment: getNextSIPDate(sd),
			FirstSIPPayment: firstTimePayment,
			AutoPayBank: emandateBankDetails?.bankName,
			AutopayCtaExist: !sd?.accountNo,
			PaymentMethod: od?.paymentMode,
			PaymentBank: od?.bankName,
			Status: orderStatus,
			Remarks: od?.remarks
		});
	};

	onMount(() => {
		onMountAnalytics();
	});
</script>

<SEO seoTitle="Order Summary | Angel One" seoDescription="Summary of your Investment" />

<article class="flex h-full flex-col justify-center">
	{#await data.api.data}
		<LoadingIndicator svgClass="!w-12 !h-12" class="self-center" />
	{:then orderSummaryData}
		{#if orderSummaryData.ok}
			<div class="flex h-full flex-col overflow-hidden">
				<Header
					heading={orderSummaryData.headerContent?.heading}
					subHeadingArr={orderSummaryData.headerContent?.subHeadingArr}
					subHeaderClass={orderSummaryData.headerContent?.subHeaderClass}
					status={orderSummaryData.headerContent?.status}
					clazz="sm:ml-2 sm:mr-2 border-b border-grey-line sm:border-b-0"
				/>
				<div class="flex flex-1 flex-col overflow-auto px-2">
					<SchemeCard
						logoUrl={orderSummaryData.schemeDetails?.logoUrl}
						schemePlan={orderSummaryData.schemeDetails?.schemePlan}
						schemeName={orderSummaryData.schemeDetails?.schemeName}
						schemeCardItems={orderSummaryData.schemeCardItems}
						clazz="mt-2 shadow-csm"
					/>
					{#if firstTimePayment && orderSummaryData?.paymentStatus && orderSummaryData?.paymentStatus !== 'pending'}
						<OrderStatusCard
							statusHistoryItems={orderSummaryData?.statusHistoryItems}
							heading={orderSummaryData?.statusCardHeading}
							clazz="!mt-2"
						/>
					{/if}
					{#if orderSummaryData.emandateBankDetails && isSIPOrder}
						<AutopayTile
							bankLogo={orderSummaryData.emandateBankDetails?.bankLogo}
							bankName={orderSummaryData.emandateBankDetails?.bankName}
							accNo={orderSummaryData.emandateBankDetails?.accNO}
							clazz="mt-2"
						/>
						{#if firstTimePayment}
							<Button
								variant="transparent"
								class="mt-6 w-max self-center"
								onClick={navigateToOrders}
							>
								GO TO ORDERS
							</Button>
						{:else}
							<Button
								variant="transparent"
								class="mt-6 w-max self-center"
								onClick={navigateToSipBook}
							>
								GO TO SIPS
							</Button>
						{/if}
					{:else if isSIPOrder && orderSummaryData?.paymentStatus === 'success'}
						<OrdersAutoPayComponent class="mt-2" {amount} on:autoPayClick={navigateToEmandate} />
					{:else if isSIPOrder}
						<OrdersAutoPayComponent class="mt-2" {amount} on:autoPayClick={navigateToEmandate} />
						{#if firstTimePayment}
							<Button
								variant="transparent"
								class="mt-6 w-max self-center"
								onClick={navigateToOrders}
							>
								GO TO ORDERS
							</Button>
						{:else}
							<Button
								variant="transparent"
								class="mt-6 w-max self-center"
								onClick={navigateToSipBook}
							>
								GO TO SIPS
							</Button>
						{/if}
					{:else if isLumpsumOrder}
						<Button variant="transparent" class="mt-6 w-max self-center" onClick={navigateToOrders}>
							GO TO ORDERS
						</Button>
					{/if}
				</div>
			</div>
		{:else}
			<div class="flex h-full flex-col items-center self-center px-4 py-4">
				<div class="mb-4 text-center text-base font-normal text-black-title">
					We are facing some issue at our end. Please try again or contact field support
				</div>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
					REFRESH
				</Button>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={navigateToOrders}>
					GO TO ORDERS
				</Button>
			</div>
		{/if}
	{:catch}
		<div class="flex h-full flex-col items-center self-center px-4 py-4">
			<div class="mb-4 text-center text-base font-normal text-black-title">
				We are facing some issue at our end. Please try again or contact field support
			</div>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
				REFRESH
			</Button>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={navigateToOrders}>
				GO TO ORDERS
			</Button>
		</div>
	{/await}
</article>
