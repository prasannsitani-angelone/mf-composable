<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { format } from 'date-fns';
	import { decodeToObject, encodeObject } from '$lib/utils/helpers/params';
	import OrderSummaryHeader from '$components/OrderSummary/OrderSummaryHeader.svelte';
	import OrderStatus from '$components/OrderSummary/OrderStatus.svelte';
	import AutopayTile from './AutopayEnabledTile/AutopayEnabledTile.svelte';
	import Button from '$components/Button.svelte';
	import { onMount } from 'svelte';
	import type { SIPData } from './type';
	import { goToDashboardButtonAnalytics, orderScreenOpenAnalytics } from './analytics';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { invalidate } from '$app/navigation';
	import { SEO, WMSIcon } from 'svelte-components';
	import { ORDER_STATUS } from '$lib/constants/orderFlowStatuses';
	import { base } from '$app/paths';
	import PageTitle from '$components/PageTitle.svelte';
	import AutopayTimeLineCard from './AutopayTimeLine/AutopayTimeLineCard.svelte';
	export let data: PageData;

	const params = $page.url.searchParams.get('params') || '';
	const decodedParams = decodeToObject(params);
	const {
		firstTimePayment,
		orderID,
		sipID,
		amount,
		date,
		isIntegeratedFlow,
		isRedeem,
		isSwitch,
		isSwp,
		isLumpsumViaMandate
	} = decodedParams;

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

	const navigateToFAQ = (tag: string) => {
		if (tag) {
			const params = encodeObject({
				tag: tag,
				orderId: orderID
			});
			goto(`${base}/faqs?params=${params}`);
		}
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
			FundName: isSIPOrder ? sd?.schemeName : od?.schemeName,
			isin: isSIPOrder ? sd?.isin : od?.isin,
			Amount: isSIPOrder ? sd?.installmentAmount : od?.amount,
			investmentType: isSIPOrder
				? orderData?.data?.data?.firstOrder === 'N'
					? 'SIP-installment'
					: 'SIP'
				: 'OTI',
			NextSIPPayment: isSIPOrder ? getNextSIPDate(sd) : null,
			FirstSIPPayment: isSIPOrder ? firstTimePayment : null,
			AutoPayBank: emandateBankDetails?.bankName,
			AutopayCtaExist: !sd?.accountNo,
			PaymentMethod: sd?.isFtpWithMandate ? 'autopay' : od?.paymentMode,
			PaymentBank: isSIPOrder ? sd?.bankName : od?.bankName,
			Status: orderStatus,
			Remarks: od?.remarks,
			integratedUpiFlow: isIntegeratedFlow,
			OrderID: orderID,
			SipId: sipID,
			PaywithAutopay: sd?.isFtpWithMandate ? 'Yes' : 'No'
		});
	};

	onMount(() => {
		onMountAnalytics();
	});
</script>

<SEO seoTitle="Order Summary | Angel One" seoDescription="Summary of your Investment" />

<article class="flex h-full flex-col justify-center md:pb-4">
	{#await data.api.data}
		<LoadingIndicator svgClass="!w-12 !h-12" class="self-center" />
	{:then orderSummaryData}
		{#if orderSummaryData.ok}
			{@const { headerContent, schemeDetails, amount } = orderSummaryData}
			{@const {
				schemeName,
				toSchemeName,
				amount: switchAmount
			} = orderSummaryData?.orderData?.data?.data || {}}
			<div
				class="flex h-[calc(100vh-56px)] flex-col overflow-hidden sm:h-full md:rounded-lg md:bg-white md:p-2"
			>
				<header class="hidden sm:block">
					<PageTitle title="Order Summary" class="-mx-2 !mt-2 mb-3">
						<svelte:fragment slot="leftTitle">
							<div class="ml-4 text-lg font-medium text-black-key">Order Summary</div>
						</svelte:fragment>
						<svelte:fragment slot="leftIcon">
							<span />
						</svelte:fragment>
						<svelte:fragment slot="rightColumn">
							<div class="mr-4">
								<WMSIcon
									name="question-mark-point"
									stroke="#3F5BD9"
									height={24}
									width={24}
									class="p-0.5"
									on:click={() => navigateToFAQ(orderSummaryData?.tag)}
								/>
							</div>
						</svelte:fragment>
					</PageTitle>
				</header>

				<OrderSummaryHeader
					heading={headerContent?.heading}
					subHeadingArr={headerContent?.subHeadingArr}
					subHeaderClass={headerContent?.subHeaderClass}
					status={headerContent?.status}
					class="sm:ml-2 sm:mr-2"
				/>
				<div class="flex flex-1 flex-col overflow-auto px-2">
					<OrderStatus
						class="mt-3"
						cardHeading={isSIPOrder && !firstTimePayment ? 'Order Details' : 'Order Status'}
						schemeData={{
							amount,
							schemeName: schemeDetails?.schemeName,
							logoUrl: schemeDetails?.logoUrl
						}}
						statusData={orderSummaryData?.statusHistoryItems}
						showTimeline={true}
						collapsibleTimeline={!orderSummaryData?.emandateBankDetails &&
							!isLumpsumOrder &&
							!isRedeem &&
							!isSwitch &&
							!isSwp &&
							!isLumpsumOrder}
						{isRedeem}
						{isSwitch}
						{isSwp}
						switchData={{
							schemeName,
							toSchemeName,
							amount: switchAmount
						}}
						{headerContent}
					/>
					{#if orderSummaryData.emandateBankDetails && (isSIPOrder || isLumpsumViaMandate)}
						<AutopayTile
							bankLogo={orderSummaryData.emandateBankDetails?.bankLogo}
							bankName={orderSummaryData.emandateBankDetails?.bankName}
							accNo={orderSummaryData.emandateBankDetails?.accNO}
							isFtpWithMandate={orderSummaryData.sipData?.data?.data?.isFtpWithMandate}
							clazz="mt-2"
						/>
					{/if}
				</div>
				<section class="sticky bottom-0 flex flex-col bg-white shadow-top sm:shadow-none">
					{#if !orderSummaryData.emandateBankDetails && isSIPOrder}
						<AutopayTimeLineCard
							autopayTimelineItems={orderSummaryData.autopayTimelineItems}
							class="px-4"
						/>
					{/if}
					<section class="px-4 py-3 shadow-top sm:self-end sm:px-0 sm:shadow-none md:pb-2 md:pt-4">
						{#if isSIPOrder && !firstTimePayment && orderSummaryData.emandateBankDetails}
							<Button
								variant="outlined"
								class="w-full self-end sm:w-[328px] md:mr-2"
								onClick={navigateToSipBook}
							>
								GO TO SIPS
							</Button>
						{:else if isSIPOrder && !orderSummaryData.emandateBankDetails}
							<Button
								variant="contained"
								onClick={navigateToEmandate}
								class="w-full self-end sm:w-[328px] md:mr-2">SET UP AUTOPAY</Button
							>
						{:else}
							<Button
								variant="outlined"
								class="w-full self-end sm:w-[328px] md:mr-2"
								onClick={navigateToOrders}
							>
								GO TO ORDERS
							</Button>
						{/if}
					</section>
				</section>
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
