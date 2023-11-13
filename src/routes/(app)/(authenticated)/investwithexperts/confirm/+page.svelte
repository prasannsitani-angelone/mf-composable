<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import PieChart from '$components/Charts/PieChart.svelte';
	import ChangePaymentContainerWithState from '$components/Payment/ChangePaymentContainerWithState.svelte';
	import PaymentSleeveWithState from '$components/Payment/PaymentSleeveWithState.svelte';
	import {
		netBankingBulkSIPFlow,
		upiBulkSIPFlow,
		walletBulkSIPFlow
	} from '$components/Payment/flow';
	import { getFormattedSIPDate } from '$components/Payment/util';
	import { getCompleteSIPDateBasedonDD, getDateSuperscript } from '$lib/utils/helpers/date';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { decodeToObject, encodeObject } from '$lib/utils/helpers/params';
	import { onMount } from 'svelte';
	import SkeletonLoader from './components/SkeletonLoader.svelte';
	import WhyThisFundPopup from './components/WhyThisFundPopup.svelte';
	import {
		onMountAnalytics,
		whyTheseFundsClickAnalytics,
		changePaymentMethodAnalytics,
		mountChangePaymentMethodAnalytics,
		payFromPaymentMethodPage,
		payNowClickAnalytics
	} from './analytics';
	import { paymentAppStore } from '$lib/stores/IntentPaymentAppsStore';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import KycProgressPopup from '$components/Payment/KYCProgressPopup.svelte';
	import { getValidSIPRegDate } from '$lib/api/sipdate';

	export let data: import('./$types').PageData;

	$: userData = $page?.data?.userDetails;

	const params = $page.url.searchParams.get('params');
	const { amount = 0, date, requestId } = decodeToObject(params || '');
	const profileData = $page.data?.profile;

	const upiPaymentAmountLimit = 100000;
	const minimumNetBankingAmountLimit = 50;

	let whyThisFundPopupVisible = false;
	let defaultInputPaymentError = '';
	let isKYCInProgress = false;

	const navigateToOrders = async () => {
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};

	const onRefresh = async () => {
		invalidate('app:investwithexperts:confirm');
	};

	const toggleWhyThisFundPopup = () => {
		whyThisFundPopupVisible = !whyThisFundPopupVisible;
		if (whyThisFundPopupVisible) {
			whyTheseFundsClickAnalytics();
		}
	};

	const toggleKYCProgressPopup = () => {
		isKYCInProgress = !isKYCInProgress;
	};

	onMount(() => {
		onMountAnalytics();
		getValidSIPStartDate();
	});

	let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: '',
		firstTimeUser: true
	};
	let showChangePayment = false;

	const showPaymentMethodScreen = () => {
		changePaymentMethodAnalytics();
		showChangePayment = true;
		mountChangePaymentMethodAnalytics({
			DefaultMethod: paymentHandler.paymentMode
		});
	};

	const hidePaymentMethodScreen = () => {
		showChangePayment = false;
	};

	const assignPreviousPaymentDetails = async (promise) => {
		paymentHandler = await promise;
		paymentHandler.paymentMode =
			paymentAppStore.checkIfPaymentAppInstalledElseGetFallback(paymentHandler.paymentMode) || '';
	};

	const updatePaymentHandler = (input) => {
		paymentHandler.firstTimeUser =
			typeof input.firstTimeUser === 'boolean' ? input.firstTimeUser : paymentHandler.firstTimeUser;
		paymentHandler.paymentMode = input.paymentMode || paymentHandler.paymentMode;
		paymentHandler.selectedAccount =
			input.selectedAccount >= 0 ? input.selectedAccount : paymentHandler.selectedAccount;
		paymentHandler.upiId = input.upiId || paymentHandler.upiId;
	};

	const getSIPDate = () => {
		return getCompleteSIPDateBasedonDD(date, sipRegDate, 30);
	};

	let sipRegDate: Date;
	const getValidSIPStartDate = async () => {
		sipRegDate = await getValidSIPRegDate();
	};

	const paymentFlow = async (params) => {
		if (userData?.isKycInProgress) {
			toggleKYCProgressPopup();
			return;
		}

		const basketResponse = await data.api.basket;
		const schemes = basketResponse?.schemes;

		// analytics code
		const analyticsArr: Record<string, string | number>[] = [];
		schemes.forEach((scheme) => {
			analyticsArr.push({
				amount: scheme.amount,
				name: scheme.schemeName
			});
		});

		analyticsArr.push({
			totalAmount: amount,
			date,
			paymentMethod: paymentHandler.paymentMode
		});

		if (showChangePayment) {
			payFromPaymentMethodPage(analyticsArr);
		} else {
			payNowClickAnalytics(analyticsArr);
		}
		//

		// when first time user and first time payment true then navigate to payment method screen
		if (paymentHandler.firstTimeUser) {
			showPaymentMethodScreen();
			return;
		}

		const orders = [];
		schemes.forEach((scheme) => {
			orders.push({
				firstOrderToday: true,
				folioNumber: '',
				frequency: scheme.sipFrequency,
				installmentAmount: scheme.amount,
				isin: scheme.isin,
				noOfInstallment: scheme.sipMaxInstallmentNo,
				schemeCode: scheme.schemeCode,
				startDate: getFormattedSIPDate(getSIPDate())
			});
		});

		const commonInput = {
			...params,
			amount,
			packId: basketResponse.packId,
			sipDate: getSIPDate(),
			orders,
			accNO: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO,
			ifscCode: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.ifscCode,
			bankName: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			dpNumber: profileData?.dpNumber,
			fullName: profileData?.clientDetails?.fullName,
			onSuccess: successFlow
		};

		if (paymentHandler?.paymentMode === 'NET_BANKING') {
			netBankingBulkSIPFlow(commonInput);
		} else if (paymentHandler?.paymentMode === 'UPI') {
			paymentHandler.upiId = params?.inputId;
			upiBulkSIPFlow(commonInput);
		} else {
			walletBulkSIPFlow(commonInput);
		}
	};

	const navigateToOrderSummary = async (bulkId) => {
		const params = encodeObject({
			bulkId
		});
		await goto(`ordersummary?params=${params}`, {
			replaceState: true
		});
	};

	const successFlow = (params) => {
		navigateToOrderSummary(params?.bulkRequestId);
	};

	const upiValidationErrorFuncPS = (error) => {
		defaultInputPaymentError = error;
		showPaymentMethodScreen();
	};

	const clearInputPaymentErrorPC = () => {
		defaultInputPaymentError = '';
	};

	const updatePaymentMode = (amount: string) => {
		if (
			(paymentHandler?.paymentMode === 'GOOGLEPAY' ||
				paymentHandler?.paymentMode === 'PHONEPE' ||
				paymentHandler?.paymentMode === 'PAYTM' ||
				paymentHandler?.paymentMode === 'UPI') &&
			parseInt(amount) > upiPaymentAmountLimit
		) {
			paymentHandler.paymentMode = 'NET_BANKING';
		} else if (
			paymentHandler?.paymentMode === 'NET_BANKING' &&
			parseInt(amount) < minimumNetBankingAmountLimit
		) {
			paymentHandler.paymentMode = 'UPI';
		}
	};

	$: updatePaymentMode(amount);
</script>

{#await data.api.basket}
	<SkeletonLoader />
{:then basket}
	{#if basket.ok}
		{#if !showChangePayment}
			<article class="flex h-full flex-col justify-between overflow-y-hidden">
				<!-- Content -->
				<section class="mx-2 mb-2 mt-3 flex flex-col overflow-y-scroll">
					<!-- Section 1 -->
					<div class="mb-2 rounded-lg bg-white p-3">
						<!-- Heading  -->
						<div class="mb-4 text-base font-normal text-black-title">
							Investing in 4 Mutual Funds
						</div>
						<!-- Investment Info  -->
						<div
							class="flex flex-row justify-between rounded bg-grey p-2 text-sm font-normal text-black-title"
						>
							<div class="flex flex-col">
								<div class="text-xs text-grey-body">Total SIP Amount</div>
								<div>₹{addCommasToAmountString(amount)}</div>
							</div>
							<div class="flex flex-col">
								<div class="text-xs text-grey-body">Monthly SIP Date</div>
								<div class="text-end">{date}{getDateSuperscript(date)}</div>
							</div>
						</div>
					</div>
					<!-- Section 2 -->
					<div class="rounded-lg bg-white p-3">
						<!-- Heading  -->
						<div class="mb-7 text-base font-normal text-black-title">Investment Allocation</div>
						<!-- Pie Chart  -->
						<div class="mb-6 flex w-full flex-row items-center justify-center">
							<PieChart data={basket?.chartData} />
						</div>
						<!-- schemes table -->
						<div class="mb-6 flex flex-col">
							<!-- header -->
							<div
								class="flex flex-row justify-between border-b border-grey-line pb-3 text-xs text-grey-body"
							>
								<div class="w-2/3">Fund</div>
								<div class="w-1/3 text-end">Amount</div>
							</div>
							<!-- data  -->
							<div class="flex flex-col gap-5 pt-6">
								{#each basket.schemes as scheme, index (index)}
									<div class="flex flex-row text-sm font-normal text-black-title">
										<div class="flex w-2/3 flex-row">
											<SchemeLogo size="xs" src={scheme.logoUrl} alt="scheme logo" />
											<div class="ml-2">{scheme.schemeName}</div>
										</div>
										<div class="w-1/3 text-end">₹{addCommasToAmountString(scheme.amount)}</div>
									</div>
								{/each}
							</div>
						</div>
						<!-- Why This Fund Link -->
						<Button
							variant="transparent"
							class="h-fit min-h-min w-fit p-0 text-blue-primary"
							onClick={toggleWhyThisFundPopup}>Why these funds?</Button
						>
					</div>
				</section>
				<!-- footer  -->
				{#await assignPreviousPaymentDetails(data.api.previousPaymentDetails)}
					<div />
				{:then}
					<section class="flex w-full flex-row bg-white px-4 py-3">
						<PaymentSleeveWithState
							amount={amount.toString()}
							{paymentHandler}
							{requestId}
							bankAccounts={profileData?.bankDetails}
							{showPaymentMethodScreen}
							{paymentFlow}
							pendingFlow={successFlow}
							upiValidationErrorFunc={upiValidationErrorFuncPS}
							submitButtonText={paymentHandler?.firstTimeUser
								? 'PROCEED'
								: `PAY ₹${addCommasToAmountString(amount)}`}
						/>
					</section>
				{/await}
			</article>
		{:else}
			<ChangePaymentContainerWithState
				allowedPaymentmethods={$paymentAppStore.allPaymentApps}
				amount={amount.toString()}
				{paymentHandler}
				bankAccounts={profileData?.bankDetails}
				{hidePaymentMethodScreen}
				{updatePaymentHandler}
				{paymentFlow}
				pendingFlow={successFlow}
				{defaultInputPaymentError}
				clearInputPaymentError={clearInputPaymentErrorPC}
			>
				<div slot="schemeTile" class="flex flex-col">
					<div class="flex w-full flex-col bg-white px-3 py-4">
						<div class="flex flex-row">
							<div class="mr-2 flex max-w-[56px] flex-row">
								<SchemeLogo
									class="!mr-0"
									size="xs"
									src={basket.schemes?.[0].logoUrl}
									alt="scheme logo"
								/>
								{#if basket.schemes?.length > 1}
									<div
										class="relative left-[-16px] flex h-9 w-9 min-w-[36px] flex-row items-center justify-center rounded-full border border-grey-line bg-white text-xs shadow-csm"
									>
										+ {basket.schemes?.length - 1}
									</div>
								{/if}
							</div>
							<div class="flex w-full flex-row items-center justify-between text-sm font-normal">
								<div>{basket.schemes?.length} Mutual Funds</div>
								<div>₹{addCommasToAmountString(amount)}</div>
							</div>
						</div>
						<div class="mt-2 text-xs text-black-title">
							Monthly SIP Date: {date}{getDateSuperscript(date)}
						</div>
					</div>
					<div class="bg-grey pb-2" />
				</div>
			</ChangePaymentContainerWithState>
		{/if}
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

{#if whyThisFundPopupVisible}
	<WhyThisFundPopup hide={toggleWhyThisFundPopup} />
{/if}

{#if isKYCInProgress}
	<KycProgressPopup onClose={toggleKYCProgressPopup} onSubmit={toggleKYCProgressPopup} />
{/if}
