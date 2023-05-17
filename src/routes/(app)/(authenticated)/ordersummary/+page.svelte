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
	import AutopaySetupTile from './AutopaySetupTile/AutopaySetupTile.svelte';
	import Button from '$components/Button.svelte';
	import { getNavigationBaseUrl, isExternalNavigation } from '$lib/utils/helpers/navigation';
	import { getContext, onMount } from 'svelte';
	import type { AppContext } from '$lib/types/IAppContext';
	import type { SIPData } from './type';
	import { OnNavigation } from '$lib/utils/navigation';
	import {
		lumpsumGoTODashBoardButtonAnalytics,
		lumpsumScreenOpenAnalytics,
		sipGoTODashBoardButtonAnalytics,
		sipGoTOSetupAutopayButtonAnalytics,
		sipScreenOpenAnalytics
	} from './analytics';
	import { base } from '$app/paths';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { invalidate } from '$app/navigation';
	export let data: PageData;

	const params = $page.url.searchParams.get('params') || '';
	const decodedParams = decodeToObject(params);
	const { firstTimePayment, orderID, sipID, ...restQueryParams } = decodedParams;

	const appContext: AppContext = getContext('app');

	const navigateToOrders = async () => {
		await goto('orders/orderspage', { replaceState: true });
	};

	const navigateToDashboard = async () => {
		if (isSIPOrder) {
			sipGoTODashBoardButtonAnalytics();
		} else {
			lumpsumGoTODashBoardButtonAnalytics();
		}
		goto(`${base}/investments`);
	};

	const onRefresh = async () => {
		invalidate('app:ordersummary');
	};

	const navigateToEmandate = () => {
		sipGoTOSetupAutopayButtonAnalytics();
		if (isExternalNavigation()) {
			const baseUrl = getNavigationBaseUrl('', appContext.scheme, appContext.host, '/');
			OnNavigation();
			goto(
				`${baseUrl}orderflow/sip/emandate?params=${encodeObject({
					...restQueryParams,
					sipID
				})}`
			);
		} else {
			// no functionality till now
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
		if (isLumpsumOrder && orderData?.ok) {
			lumpsumScreenOpenAnalytics({
				FundName: od?.schemeName,
				isin: od?.isin,
				Amount: od?.amount,
				investmentType: 'OTI',
				PaymentMethod: od?.paymentMode,
				PaymentBank: od?.bankName
			});
		} else if (
			isSIPOrder &&
			((orderData?.ok && sipData?.ok) || (sipData?.ok && !firstTimePayment))
		) {
			sipScreenOpenAnalytics({
				FundName: sd?.schemeName,
				isin: sd?.isin,
				Amount: sd?.installmentAmount,
				investmentType: 'SIP',
				installmentAmount: sd?.installmentAmount,
				NextSIPPayment: getNextSIPDate(sd),
				FirstSIPPayment: firstTimePayment,
				AutoPayBank: emandateBankDetails?.bankName,
				AutopayCtaExist: !sd?.accountNo,
				PaymentMethod: od?.paymentMode,
				PaymentBank: od?.bankName
			});
		}
	};

	onMount(() => {
		onMountAnalytics();
	});
</script>

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
						<Button
							variant="transparent"
							class="mt-6 w-max self-center sm:hidden"
							onClick={navigateToOrders}
						>
							GO TO ORDERS
						</Button>
						<Button
							variant="transparent"
							class="mt-6 hidden w-max self-center sm:flex"
							onClick={navigateToDashboard}
						>
							GO TO DASHBOARD
						</Button>
					{:else if isSIPOrder && orderSummaryData?.paymentStatus === 'success'}
						<AutopaySetupTile
							clazz="mt-2 hidden sm:flex shadow-csm rounded"
							onSubmit={navigateToEmandate}
						/>
					{:else if isSIPOrder}
						<AutopaySetupTile
							clazz="mt-2 hidden sm:flex shadow-csm rounded"
							onSubmit={navigateToEmandate}
						/>
						<Button
							variant="transparent"
							class="mt-6 w-max self-center sm:hidden"
							onClick={navigateToOrders}
						>
							GO TO ORDERS
						</Button>
						<Button
							variant="transparent"
							class="mt-6 hidden w-max self-center sm:flex"
							onClick={navigateToDashboard}
						>
							GO TO DASHBOARD
						</Button>
					{:else if isLumpsumOrder}
						<Button
							variant="transparent"
							class="mt-6 w-max self-center sm:hidden"
							onClick={navigateToOrders}
						>
							GO TO ORDERS
						</Button>
						<Button
							variant="transparent"
							class="mt-6 hidden w-max self-center sm:flex"
							onClick={navigateToDashboard}
						>
							GO TO DASHBOARD
						</Button>
					{/if}
				</div>
				{#if !orderSummaryData.emandateBankDetails && isSIPOrder}
					<AutopaySetupTile clazz="mt-2 sm:hidden" onSubmit={navigateToEmandate} />
				{/if}
			</div>
		{:else}
			<div class="flex h-full flex-col items-center self-center px-4 py-4">
				<div class="mb-4 text-center text-base font-medium text-black-title">
					We are facing some issue at our end. Please try again or contact field support
				</div>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
					REFRESH
				</Button>
				<Button
					variant="transparent"
					class="mt-6 w-max self-center sm:hidden"
					onClick={navigateToOrders}
				>
					GO TO ORDERS
				</Button>
				<Button
					variant="transparent"
					class="mt-6 hidden w-max self-center sm:flex"
					onClick={navigateToDashboard}
				>
					GO TO DASHBOARD
				</Button>
			</div>
		{/if}
	{:catch}
		<div class="flex h-full flex-col items-center self-center px-4 py-4">
			<div class="mb-4 text-center text-base font-medium text-black-title">
				We are facing some issue at our end. Please try again or contact field support
			</div>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
				REFRESH
			</Button>
			<Button
				variant="transparent"
				class="mt-6 w-max self-center sm:hidden"
				onClick={navigateToOrders}
			>
				GO TO ORDERS
			</Button>
			<Button
				variant="transparent"
				class="mt-6 hidden w-max self-center sm:flex"
				onClick={navigateToDashboard}
			>
				GO TO DASHBOARD
			</Button>
		</div>
	{/await}
</article>
