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
	import { onDestroy, onMount } from 'svelte';
	import type { SIPData } from './type';
	import {
		faqsButtonClickAnalytics,
		goToDashboardButtonAnalytics,
		orderScreenOpenAnalytics,
		orderTimelineDropdownToggledAnalytics,
		setupAutopayOrderSummaryButtonClickAnalytics
	} from './analytics';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { invalidate } from '$app/navigation';
	import { SEO, WMSIcon } from 'svelte-components';
	import { ORDER_STATUS } from '$lib/constants/orderFlowStatuses';
	import { base } from '$app/paths';
	import PageTitle from '$components/PageTitle.svelte';
	import AutopayTimeLineCard from './AutopayTimeLine/AutopayTimeLineCard.svelte';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import { headerStore } from '$lib/stores/HeaderStore';
	import { fly } from 'svelte/transition';
	import AnimationPlayer from '$components/AnimationPlayer.svelte';
	import SuccessAnimation from '$lib/images/SuccessLottie.json';
	import { orderSummaryStore } from '$lib/stores/OrderSummaryStore';
	import OrdersTile from '$components/OrderSummary/OrdersTile.svelte';
	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

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
		isLumpsumViaMandate,
		isBuyPortfolio,
		isCart
	} = decodedParams;

	let orderStatusString = '';
	let paymentStatusString = '';
	let isOrderSummaryVisited = orderSummaryStore?.isOrderVisited(orderID);
	let animationCompleted = false;
	let animationTimeout: ReturnType<typeof setTimeout>;

	const getCommonEventMetaData = async () => {
		const { orderData, sipData, emandateBankDetails, headerContent } = await data.api.data;
		const sd = sipData?.data?.data;
		const od = orderData?.data?.data;
		const eventMetaData = {
			FundName: isSIPOrder ? sd?.schemeName : od?.schemeName,
			Isin: isSIPOrder ? sd?.isin : od?.isin,
			Amount: isSIPOrder ? sd?.installmentAmount : od?.amount,
			InvestmentType: isSIPOrder
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
			Status: headerContent?.status,
			Remarks: od?.remarks,
			integratedUpiFlow: isIntegeratedFlow,
			OrderID: orderID,
			SipId: sipID,
			PaywithAutopay: sd?.isFtpWithMandate ? 'Yes' : 'No',
			FAQsPresent: !(isBuyPortfolio || isCart) ? 'Yes' : 'No'
		};
		return eventMetaData;
	};

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

	const handleTimelineToggle = async () => {
		const eventMetaData = await getCommonEventMetaData();
		orderTimelineDropdownToggledAnalytics(eventMetaData);
	};

	const navigateToEmandate = async () => {
		const eventMetaData = await getCommonEventMetaData();
		setupAutopayOrderSummaryButtonClickAnalytics(eventMetaData);
		const params = encodeObject({
			amount: amount,
			date: date,
			sipID: sipID
		});
		goto(`${base}/autopay/manage?params=${params}`);
	};

	const navigateToFAQ = async (tag: string) => {
		const eventMetaData = await getCommonEventMetaData();
		faqsButtonClickAnalytics(eventMetaData);
		if (tag) {
			const params = encodeObject({
				tag: tag,
				orderId: orderID,
				redirectedFrom: 'ordersummary'
			});
			goto(`${base}/faqs?params=${params}`);
		}
	};

	const getNextSIPDate = (data: SIPData = {}) => {
		return data?.startDate ? format(new Date(data.startDate), 'dd MMM yyyy') : '';
	};

	const isLumpsumOrder = orderID && !sipID;
	const isSIPOrder = (orderID && sipID) || (!firstTimePayment && sipID);

	const setMobileHeader = (val = false) => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = val;
		}
	};

	const updateOrderSummaryStory = () => {
		const visitedOrders = orderSummaryStore?.getVisitedOrders();
		visitedOrders?.push(orderID);
		orderSummaryStore?.updateStore({ visitedOrders });
	};

	const clearTimeouts = () => {
		if (animationTimeout !== undefined) {
			clearTimeout(animationTimeout);
		}
	};

	const handleAnimation = () => {
		animationTimeout = setTimeout(() => {
			animationCompleted = true;

			clearTimeouts();
		}, 2500);
	};

	const checkOrderSummaryVisited = () => {
		if (isOrderSummaryVisited) {
			animationCompleted = true;
		} else {
			updateOrderSummaryStory();
			handleAnimation();
		}
	};

	const onMountAnalytics = async () => {
		const eventMetaData = await getCommonEventMetaData();
		orderScreenOpenAnalytics(eventMetaData);
	};

	onMount(() => {
		setMobileHeader(false);
		checkOrderSummaryVisited();
		onMountAnalytics();

		return () => {
			clearTimeouts();
		};
	});

	onDestroy(() => {
		setMobileHeader(true);
	});
</script>

<SEO seoTitle="Order Summary | Angel One" seoDescription="Summary of your Investment" />

<article class="flex h-full flex-col justify-center md:mt-0 md:pb-4">
	{#await data.api.data}
		<section class="flex h-full items-center justify-center md:h-[calc(100vh-148px)]">
			<LoadingIndicator svgClass="!w-12 !h-12" />
		</section>
	{:then orderSummaryData}
		{#if orderSummaryData.ok}
			{@const { headerContent, schemeDetails, amount, pendingOrder, cartData } = orderSummaryData}
			{@const {
				schemeName,
				toSchemeName,
				amount: switchAmount
			} = orderSummaryData?.orderData?.data?.data || {}}

			{#if animationCompleted || pendingOrder}
				<section
					class="flex h-full flex-col overflow-hidden sm:h-full md:rounded-lg md:bg-background-alt md:p-2"
				>
					<!-- Mobile Header -->
					<MobileHeader title={'Order Summary'} class="bg-background-alt" titleClass="!font-medium">
						<svelte:fragment slot="faqIcon">
							{#if !(isBuyPortfolio || isCart)}
								<WMSIcon
									name="question-mark-point"
									stroke="#3F5BD9"
									height={24}
									width={24}
									class="p-0.5"
									on:click={() => navigateToFAQ(orderSummaryData?.tag)}
								/>
							{/if}
						</svelte:fragment>
					</MobileHeader>

					<!-- Desktop Heading Section -->
					<header class="hidden sm:block">
						<PageTitle title="Order Summary" class="-mx-2 !mt-2 mb-3">
							<svelte:fragment slot="leftTitle">
								<div class="ml-4 text-lg font-medium text-black-key">Order Summary</div>
							</svelte:fragment>
							<svelte:fragment slot="leftIcon">
								<span />
							</svelte:fragment>
							<svelte:fragment slot="rightColumn">
								{#if !(isBuyPortfolio || isCart)}
									<div class="mr-4 sm:cursor-pointer">
										<WMSIcon
											name="question-mark-point"
											stroke="#3F5BD9"
											height={24}
											width={24}
											class="p-0.5"
											on:click={() => navigateToFAQ(orderSummaryData?.tag)}
										/>
									</div>
								{/if}
							</svelte:fragment>
						</PageTitle>
					</header>

					<section in:fly={{ y: 100, duration: 750 }}>
						<OrderSummaryHeader
							heading={headerContent?.heading}
							subHeadingArr={headerContent?.subHeadingArr}
							subHeaderClass={headerContent?.subHeaderClass}
							status={headerContent?.status}
							class="sm:ml-2 sm:mr-2"
						/>
					</section>

					<section
						class="flex flex-1 flex-col overflow-auto px-2"
						in:fly={{ y: 100, duration: 1250 }}
					>
						{#if isBuyPortfolio}
							<OrdersTile
								schemeLogoUrl={orderSummaryData?.orderData?.data?.data?.logoUrl}
								title={orderSummaryData?.orderData?.data?.data?.packName}
								totalAmount={orderSummaryData?.orderData?.data?.data?.totalAmount}
							/>
						{:else if isCart}
							<OrdersTile
								isCart={true}
								items={cartData?.checkedOutItemsLength}
								schemeLogoUrl={cartData?.schemeLogoUrl}
								totalAmount={cartData?.totalAmount}
							/>
						{:else}
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
								on:timelineToggle={handleTimelineToggle}
							/>
						{/if}
						{#if orderSummaryData.emandateBankDetails && (isSIPOrder || isLumpsumViaMandate)}
							<AutopayTile
								bankLogo={orderSummaryData.emandateBankDetails?.bankLogo}
								bankName={orderSummaryData.emandateBankDetails?.bankName}
								accNo={orderSummaryData.emandateBankDetails?.accNO}
								isFtpWithMandate={orderSummaryData.sipData?.data?.data?.isFtpWithMandate}
								clazz="mt-2"
							/>
						{/if}
					</section>

					<section
						class="sticky bottom-0 flex flex-col bg-background-alt shadow-top sm:shadow-none"
					>
						{#if !orderSummaryData.emandateBankDetails && isSIPOrder}
							<AutopayTimeLineCard
								autopayTimelineItems={orderSummaryData.autopayTimelineItems}
								class="px-4 sm:px-0"
							/>
						{/if}
						<section
							class="px-4 py-3 shadow-top sm:self-end sm:px-0 sm:shadow-none md:pb-2 md:pt-4"
						>
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
				</section>
			{:else}
				<AnimationPlayer
					AnimatedLottie={SuccessAnimation}
					bannerText="Order Placed Successfully"
					class="absolute inset-0 z-100 bg-background-alt md:static md:rounded-lg"
				/>
			{/if}
		{:else}
			<div class="flex h-full flex-col items-center self-center px-4 py-4">
				<div class="mb-4 text-center text-base font-normal text-title">
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
			<div class="mb-4 text-center text-base font-normal text-title">
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
