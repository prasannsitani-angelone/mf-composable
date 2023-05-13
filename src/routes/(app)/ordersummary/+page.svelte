<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Header from './Header/HeaderComponent.svelte';
	import { STATUS_ARR } from './constant';
	import { format } from 'date-fns';
	import { decodeToObject, encodeObject } from '$lib/utils/helpers/params';
	import SchemeCard from './SchemeCard/SchemeCard.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import OrderStatusCard from './OrderStatusCard/OrderStatusCard.svelte';
	import AutopayTile from './AutopayEnabledTile/AutopayEnabledTile.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import AutopaySetupTile from './AutopaySetupTile/AutopaySetupTile.svelte';
	import Button from '$components/Button.svelte';
	import { getNavigationBaseUrl, isExternalNavigation } from '$lib/utils/helpers/navigation';
	import { getContext } from 'svelte';
	import type { AppContext } from '$lib/types/IAppContext';
	import type { SIPData, SchemeCardItems } from './type';
	import { OnNavigation } from '$lib/utils/navigation';
	import { base } from '$app/paths';
	export let data: PageData;

	const params = $page.url.searchParams.get('params') || '';
	const decodedParams = decodeToObject(params);
	const { firstTimePayment, orderID, sipID, ...restQueryParams } = decodedParams;

	const appContext: AppContext = getContext('app');

	const isNull = (val: number | null) => {
		if (!val && val !== 0) {
			return true;
		}
		return false;
	};

	const getNextSIPDate = (data: SIPData = {}) => {
		return data?.startDate ? format(new Date(data.startDate), 'dd MMM yyyy') : '';
	};

	const getBankDetailsByAccountNumber = (bankDetails: Array<BankDetailsEntity>, accNO: string) => {
		return bankDetails?.find((bankAccount) => {
			return accNO === bankAccount.accNO;
		});
	};

	const navigateToOrders = async () => {
		await goto('orders/orderspage', { replaceState: true });
	};

	const navigateToDashboard = async () => {
		goto(`${base}/investments`);
	};

	const navigateToEmandate = () => {
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

	const headerContent: Record<string, any> = {
		heading: '',
		subHeadingArr: [],
		status: STATUS_ARR.SUCCESS,
		subHeaderClass: ''
	};
	const schemeCardItems: Array<SchemeCardItems> = [];
	const schemeDetails = {};
	const statusHistoryItems: Array<Record<string, any>> = [];
	let statusCardHeading = '';

	const sipData = data.api.sipData;
	const orderData = data.api.ordersData;
	const isLumpsumOrder = orderID && !sipID;
	const isSIPOrder = (orderID && sipID) || (!firstTimePayment && sipID);
	let emandateBankDetails: BankDetailsEntity | undefined;

	if (orderData?.ok) {
		const data = orderData?.data?.data;
		if (data?.statusHistory && data.statusHistory.length > 0) {
			let previousStepCurrentState: number | null = null;
			data.statusHistory.forEach((item: Record<string, any>, index: number) => {
				let status = STATUS_ARR.NONE;
				let subTitle = `Estimated by: ${format(new Date(item.timeStamp), 'dd MMMM yyyy')}`;
				if (isNull(previousStepCurrentState) && item.failed) {
					status = STATUS_ARR.FAILED;
					statusCardHeading = item.description;
					subTitle = format(new Date(item.timeStamp), 'dd MMMM yyyy hh:mm a');
				} else if (isNull(previousStepCurrentState) && item.currentState) {
					previousStepCurrentState = index;
					statusCardHeading = item.description;
					status = STATUS_ARR.PENDING;
				} else if (isNull(previousStepCurrentState)) {
					status = STATUS_ARR.SUCCESS;
					statusCardHeading = item.description;
					subTitle = format(new Date(item.timeStamp), 'dd MMMM yyyy hh:mm a');
				}
				statusHistoryItems.push({
					title: item.description,
					subTitle,
					status
				});
			});
			statusHistoryItems.forEach((item, index) => {
				if (index === 0) {
					if (item.status === STATUS_ARR.FAILED) {
						headerContent.heading = 'Order Failed';
						headerContent.subHeadingArr = [
							{
								text: 'If money has been debited from your bank account, please do not worry. It will be refunded automatically',
								class: 'text-red-sell'
							}
						];
						headerContent.status = STATUS_ARR.FAILED;
						headerContent.subHeaderClass = 'bg-yellow-secondary/20';
					} else if (item.status === STATUS_ARR.PENDING) {
						item.status = STATUS_ARR.PAYMENT_PENDING;
						headerContent.heading = 'Order Pending';
						headerContent.subHeadingArr = [
							{
								text: 'We are confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update',
								class: ''
							}
						];
						headerContent.status = STATUS_ARR.PENDING;
						headerContent.subHeaderClass = 'bg-yellow-secondary/20';
					} else if (item.status === STATUS_ARR.SUCCESS) {
						headerContent.heading = 'Order Placed Successfully';
						headerContent.subHeadingArr = [
							{
								text: `Your portfolio will be updated by ${format(
									new Date(data.statusHistory[data.statusHistory.length - 1].timeStamp),
									'do MMMM yyyy'
								)}`,
								class: '!text-black-title font-medium'
							}
						];
						headerContent.status = STATUS_ARR.SUCCESS;
						headerContent.subHeaderClass = 'bg-green-buy/10';
					}
				} else if (index === 2 && item.status === STATUS_ARR.FAILED) {
					headerContent.heading = 'Order Processing Failed by AMC';
					headerContent.subHeadingArr = [
						{
							text: 'We are currently unable to process the mandate request to schedule automatic fund transfer from your bank account to trading account for SIP investments due to some technical issues. Please try again',
							class: 'text-red-sell'
						}
					];
					headerContent.status = STATUS_ARR.FAILED;
					headerContent.subHeaderClass = 'bg-yellow-secondary/20';
				}
			});
		}
		if (isLumpsumOrder) {
			schemeCardItems.push({
				title: 'One Time Investment Amount',
				value: `₹ ${addCommasToAmountString(data?.amount)}`
			});
			schemeDetails.logoUrl = data?.logoUrl;
			schemeDetails.schemePlan = data?.schemePlan;
			schemeDetails.schemeName = data?.schemeName;
		}
	}

	if (!firstTimePayment && sipData?.ok) {
		const data = sipData?.data?.data;
		headerContent.heading = 'SIP Created Successfully';
		headerContent.subHeadingArr = [
			{
				text: `Your first SIP payment is on ${getNextSIPDate(data)}`,
				class: '!text-black-title font-medium'
			}
		];
		headerContent.status = STATUS_ARR.SUCCESS;
		headerContent.subHeaderClass = 'bg-green-buy/10';
	}

	if (sipData?.ok) {
		const data = sipData?.data?.data;
		schemeCardItems.push({
			title: 'Amount',
			value: `₹ ${addCommasToAmountString(data?.installmentAmount)}`
		});
		schemeCardItems.push({
			title: firstTimePayment ? 'Next SIP Payment' : 'First SIP Payment',
			value: getNextSIPDate(data)
		});
		schemeDetails.logoUrl = data?.logoUrl;
		schemeDetails.schemePlan = data?.schemePlan;
		schemeDetails.schemeName = data?.schemeName;
	}

	$: {
		emandateBankDetails = getBankDetailsByAccountNumber(
			data?.profile?.bankDetails,
			sipData?.data?.data?.accountNo
		);
	}
</script>

<article class="flex h-full flex-col">
	{#await data.api}
		Loading...
	{:then}
		<div class="flex h-full flex-col overflow-hidden">
			<Header
				heading={headerContent.heading}
				subHeadingArr={headerContent.subHeadingArr}
				subHeaderClass={headerContent.subHeaderClass}
				status={headerContent.status}
				clazz="sm:ml-2 sm:mr-2 border-b border-grey-line sm:border-b-0"
			/>
			<div class="flex flex-1 flex-col overflow-auto px-2">
				<SchemeCard
					logoUrl={schemeDetails?.logoUrl}
					schemePlan={schemeDetails?.schemePlan}
					schemeName={schemeDetails?.schemeName}
					{schemeCardItems}
					clazz="mt-2 shadow-csm"
				/>
				{#if firstTimePayment && orderData?.data?.data?.paymentStatus !== 'pending'}
					<OrderStatusCard {statusHistoryItems} heading={statusCardHeading} clazz="!mt-2" />
				{/if}
				{#if emandateBankDetails && isSIPOrder}
					<AutopayTile
						bankLogo={emandateBankDetails?.bankLogo}
						bankName={emandateBankDetails?.bankName}
						accNo={emandateBankDetails?.accNO}
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
				{:else if isSIPOrder && orderData?.data?.data?.paymentStatus === 'success'}
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
			{#if !emandateBankDetails && isSIPOrder}
				<AutopaySetupTile clazz="mt-2 sm:hidden" onSubmit={navigateToEmandate} />
			{/if}
		</div>
	{:catch}
		Error
	{/await}
</article>
