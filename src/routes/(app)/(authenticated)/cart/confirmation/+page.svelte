<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import Button from '$components/Button.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import ChangePaymentContainer from '$components/Payment/ChangePaymentContainer.svelte';
	import LoadingPopup from '$components/Payment/LoadingPopup.svelte';
	import PaymentSleeve from '$components/Payment/PaymentSleeve.svelte';
	import UpiClosePopup from '$components/Payment/UPIClosePopup.svelte';
	import UpiTransactionPopup from '$components/Payment/UPITransactionPopup.svelte';
	import {
		NET_BANKING_MIN_LIMIT,
		PAYMENT_MODE,
		UPI_MAX_LIMIT
	} from '$components/Payment/constants';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { encodeObject } from '$lib/utils/helpers/params';
	import ReadOnlyTile from '../components/ReadOnlyTile.svelte';
	import type { PageData } from './$types';
	import { netBankingCartFlow, upiCartFlow, walletCartFlow } from '$components/Payment/flow';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import logger from '$lib/utils/logger';
	import {
		closeNetBankingPaymentWindow,
		initializeGPayState,
		initializeUPIState,
		intializeNetBankingState
	} from '$components/Payment/util';
	import { WMSIcon } from 'wms-ui-component';
	import { cartStore } from '$lib/stores/CartStore';
	import {
		changePaymentMethodAnalytics,
		clickCheckoutAnalytics,
		mountAnalytics,
		mountChangePaymentMethodAnalytics,
		paymentFailedScreenAnalytics,
		paymentFailedScreenCloseButtonAnalytics,
		paymentModeScreenPayButtonClickAnalytics,
		paymentPendingScreenAnalytics,
		paymentPendingScreenCloseButtonAnalytics
	} from '../analytics/confirmation';

	export let data: PageData;

	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
	$: profileData = $page?.data?.profile;

	let xRequestId = '';
	let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: ''
	};
	let firstTimeUser = false;
	let showChangePayment = false;
	let inputPaymentError = '';
	let bankPopupVisible = false;
	let validateUPILoading = false;
	let pendingCaseOrderID: number;
	const error = {
		visible: false,
		heading: '',
		subHeading: '',
		type: ''
	};
	const pending = {
		visible: false,
		heading: '',
		subHeading: ''
	};
	const loadingState = {
		heading: '',
		isLoading: false
	};
	const state = {
		interval: null
	};
	const upiState = {
		flow: 0,
		timer: 0,
		timerInterval: null,
		paymentWindowInterval: null
	};
	const netBankingState = {
		paymentWindow: null,
		paymentWindowInterval: null
	};
	const gpayPaymentState = {
		paymentWindowInterval: null,
		waitTime: 10
	};

	const listenerFunc = (event) => {
		if (location.origin === event?.origin && event?.data?.source === 'paymentCallback') {
			logger.info({
				type: 'Payment Redirection Response',
				params: event?.data
			});
			closeNetBankingPaymentWindow(netBankingState);
		}
	};

	onMount(() => {
		window.addEventListener('message', listenerFunc);
	});

	onDestroy(() => {
		resetState();
		if (browser) {
			window.removeEventListener('message', listenerFunc, false);
			mountAnalytics();
		}
	});

	const resetState = () => {
		if (state.interval) {
			clearInterval(state.interval);
		}
		intializeNetBankingState(netBankingState);
		initializeUPIState(upiState);
		initializeGPayState(gpayPaymentState);
	};

	const defaultValueToPaymentHandler = () => {
		paymentHandler.paymentMode = '';
		paymentHandler.upiId = '';
		paymentHandler.selectedAccount = 0;
		firstTimeUser = true;
	};

	const assignPreviousPaymentDetails = async (promise, itemList) => {
		const previousPaymentDetails = await promise;
		const profileData = $page?.data?.profile;
		if (previousPaymentDetails?.ok) {
			const data = previousPaymentDetails?.data;
			const bankDetails = profileData?.bankDetails;
			const index = profileStore.bankAccountIndexByAccountNumberOnServer(
				bankDetails,
				data?.accountNo
			);
			if (index < 0) {
				defaultValueToPaymentHandler();
				return;
			}
			paymentHandler.upiId = data?.upiId;
			paymentHandler.selectedAccount = index;
			const paymentMode = data?.paymentMode;
			if (itemList?.totalAmount > UPI_MAX_LIMIT) {
				paymentHandler.paymentMode = 'NET_BANKING';
			} else if (paymentMode === 'NET_BANKING' && itemList?.totalAmount < NET_BANKING_MIN_LIMIT) {
				paymentHandler.paymentMode = 'UPI';
			} else if (
				(paymentMode === 'GOOGLEPAY' || paymentMode === 'PHONEPE') &&
				os !== 'Android' &&
				os !== 'iOS'
			) {
				paymentHandler.paymentMode = 'UPI';
			} else {
				paymentHandler.paymentMode = paymentMode;
			}
		} else {
			defaultValueToPaymentHandler();
		}
	};

	const showPaymentMethodScreen = () => {
		changePaymentMethodAnalytics();
		showChangePayment = true;
		mountChangePaymentMethodAnalytics({
			DefaultPaymentMethod: paymentHandler?.paymentMode,
			DefaultBank: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			ChangeBankAvailable: profileData?.bankDetails?.length > 1
		});
	};

	const hidePaymentMethodScreen = () => {
		showChangePayment = false;
	};

	const onPaymentModeSelect = (paymentMode: string) => {
		paymentHandler.paymentMode = paymentMode;
		firstTimeUser = false;
	};

	const onAccountChange = (index: number) => {
		paymentHandler.selectedAccount = index;
	};

	const resetInputPaymentError = () => {
		inputPaymentError = '';
	};

	const showBankPopup = () => {
		bankPopupVisible = true;
	};

	const hideBankPopup = () => {
		bankPopupVisible = false;
	};

	const showLoading = (heading: string) => {
		loadingState.isLoading = true;
		loadingState.heading = heading;
	};

	const stopLoading = () => {
		loadingState.isLoading = false;
		loadingState.heading = '';
	};

	const showUPILoading = () => {
		validateUPILoading = true;
	};

	const stopUPILoading = () => {
		validateUPILoading = false;
	};

	const paymentFailedScreenAnalyticsWithData = async () => {
		const itemList = await data.api.itemList;
		paymentFailedScreenAnalytics({
			Amount: itemList?.totalAmount,
			PaymentMethod: paymentHandler?.paymentMode,
			PaymentBank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName,
			PaymentFailed:
				'IF the money has been debited from your bank account, please do not worry, it will be refunded automatically'
		});
	};

	const displayError = ({ heading = 'Error', errorSubHeading = '', type = '' }) => {
		if (type === 'PAYMENT_FAILED' || type === 'PAYMENT_PATCH_FAILED') {
			paymentFailedScreenAnalyticsWithData();
		}
		error.visible = true;
		error.heading = heading;
		error.subHeading = errorSubHeading;
		error.type = type;
	};

	const closeErrorPopup = () => {
		error.heading = '';
		error.subHeading = '';
		error.visible = false;
		if (error.type === 'PATCH_FAILED') {
			goBack();
		} else if (error.type === 'PAYMENT_PATCH_FAILED') {
			paymentFailedScreenCloseButtonAnalytics();
			goBack();
		} else if (error.type === 'PAYMENT_FAILED') {
			paymentFailedScreenCloseButtonAnalytics();
			cartStore.updateCartData(false);
			onRefresh();
		}
		error.type = '';
	};

	const displayPendingPopup = async ({
		heading = 'Payment Pending',
		errorSubHeading = '',
		orderId
	}) => {
		const itemList = await data.api.itemList;
		paymentPendingScreenAnalytics({
			Amount: itemList?.totalAmount,
			PaymentMethod: paymentHandler?.paymentMode,
			PaymentBank: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			PaymentPending:
				'we are confirming the status of your payment. This Usually takes few minutes. We will notify you once we have an update'
		});
		pending.visible = true;
		pending.heading = heading;
		pending.subHeading = errorSubHeading;
		pendingCaseOrderID = orderId;
	};

	const closePendingPopup = () => {
		paymentPendingScreenCloseButtonAnalytics();
		pending.heading = '';
		pending.subHeading = '';
		pending.visible = false;
		navigatToOrderSummary({
			orderId: pendingCaseOrderID
		});
	};

	const onUPITransactionPopupClose = () => {
		upiState.flow = 3;
	};

	const onUPITransactionContinuation = () => {
		upiState.flow = 2;
	};

	const upiCloseLogic = async () => {
		showLoading('Waiting for payment');
		upiState.flow = 0;
	};

	const onUPIValidationFailure = (error) => {
		inputPaymentError = error;
		showPaymentMethodScreen();
	};

	const updateUPITimer = (time: number) => {
		upiState.timer = time;
	};

	const assignNewRequestId = () => {
		xRequestId = uuidv4();
	};

	const onPayment = async (inputId: string) => {
		// analytics
		const itemList = await data.api.itemList;
		if (showChangePayment) {
			paymentModeScreenPayButtonClickAnalytics({
				NoOfFunds: itemList?.shortenedFundList?.length,
				CheckedFundsList: itemList?.shortenedFundList
			});
		} else {
			clickCheckoutAnalytics({
				NoOfFunds: itemList?.shortenedFundList?.length,
				CheckedFundsList: itemList?.shortenedFundList
			});
		}

		if (firstTimeUser) {
			showPaymentMethodScreen();
			return;
		}
		assignNewRequestId();
		const commonInput = {
			amount: itemList?.totalAmount,
			accNO: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO,
			ifscCode: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.ifscCode,
			bankName: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			fullName: profileData?.clientDetails?.fullName,
			cartItemIds: itemList?.cartIDArray || [],
			paymentMode: paymentHandler?.paymentMode,
			xRequestId,
			state,
			showLoading,
			stopLoading,
			displayPendingPopup,
			displayError,
			onStart: hidePaymentMethodScreen,
			onSuccess: navigatToOrderSummary
		};

		if (paymentHandler?.paymentMode === 'NET_BANKING') {
			netBankingCartFlow({
				...commonInput,
				netBankingState
			});
		} else if (paymentHandler?.paymentMode === 'UPI') {
			paymentHandler.upiId = inputId;
			upiCartFlow({
				...commonInput,
				inputId,
				upiState,
				showUPILoading,
				stopUPILoading,
				onUPIValidationFailure,
				updateUPITimer
			});
		} else {
			walletCartFlow({
				...commonInput,
				paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode].name,
				paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode].apiName,
				gpayPaymentState
			});
		}
	};

	const onRefresh = async () => {
		invalidate('app:cart:confirmation');
	};

	const goBack = async () => {
		window.history.back();
	};

	const navigatToOrderSummary = async ({ orderId }) => {
		cartStore.updateCartData(false);
		const params = encodeObject({
			orderID: orderId
		});

		goto(`${base}/cart/ordersummary?params=${params}`, {
			replaceState: true
		});
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="text-title-black hidden flex-row items-center pt-3 pb-6 text-lg font-medium active:opacity-80 sm:flex"
	on:click={goBack}
>
	<WMSIcon name="left-arrow" height={16} width={16} class="mr-4" />
	Confirm Order
</div>

<article class="flex h-full flex-col sm:h-max">
	{#await data.api.itemList}
		<LoadingIndicator svgClass="!w-12 !h-12" class="self-center" />
	{:then itemList}
		{#if itemList.ok}
			<div class="flex h-full flex-col overflow-hidden sm:h-max sm:overflow-auto">
				<div class="flex flex-1 flex-col overflow-auto sm:mb-3 sm:flex-initial sm:overflow-visible">
					<div
						class="hidden grid-cols-[46%_18%_18%_18%] items-center border-b border-t border-grey-line bg-white px-6 py-4 text-sm font-medium text-grey-dark sm:grid"
					>
						<div>Fund</div>
						<div>Investment Type</div>
						<div>SIP Date</div>
						<div>Amount</div>
					</div>
					{#each itemList.data?.data as item, id (id)}
						<ReadOnlyTile
							schemeName={item.schemeName}
							schemeLogo={item.logoUrl}
							amount={item.amount}
							sipDate={item.sipDay}
							isSip={item.investmentType === 'SIP'}
						/>
					{/each}
					<div
						class="grid grid-cols-[46%_18%_18%_18%] items-center bg-white px-3 py-3 sm:px-6 sm:py-4"
					>
						<div class="text-title-black text-sm font-bold">Total</div>
						<div
							class="text-title-black col-start-4 flex justify-end text-sm font-bold sm:justify-start"
						>
							₹{addCommasToAmountString(itemList?.totalAmount?.toString())}
						</div>
					</div>
				</div>
				{#await assignPreviousPaymentDetails(data.api.previousPaymentDetails, itemList)}
					<div />
				{:then}
					<div
						class="flex flex-col bg-white sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3"
					>
						{#if !firstTimeUser}
							<div>
								<PaymentSleeve
									class="border-t border-b border-grey-line sm:border-0"
									selectedMode={paymentHandler?.paymentMode}
									onPaymentMethodChange={showPaymentMethodScreen}
									bankName={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName}
									bankAccount={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO}
									upiId={paymentHandler.upiId}
									amount={itemList?.totalAmount}
								/>
							</div>
						{:else}
							<div />
						{/if}
						<div class="px-4 py-3 sm:p-0">
							<Button
								class="w-full sm:w-80"
								onClick={() => onPayment(paymentHandler.upiId)}
								disabled={loadingState.isLoading || validateUPILoading}
							>
								PAY ₹{addCommasToAmountString(itemList?.totalAmount?.toString())} NOW
							</Button>
						</div>
					</div>
				{/await}
			</div>
		{:else}
			<div class="flex h-full flex-col items-center self-center px-4 py-4">
				<div class="mb-4 text-center text-base font-medium text-black-title">
					We are facing some issue at our end. Please try again or contact field support
				</div>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
					REFRESH
				</Button>
			</div>
		{/if}
		{#if showChangePayment}
			<ChangePaymentContainer
				amount={itemList?.totalAmount?.toString()}
				onBackClick={hidePaymentMethodScreen}
				selectedMode={paymentHandler?.paymentMode}
				onSelect={onPaymentModeSelect}
				onSubmit={onPayment}
				bankAccounts={profileData?.bankDetails}
				selectedAccount={paymentHandler?.selectedAccount}
				inputError={inputPaymentError}
				resetInputError={resetInputPaymentError}
				defaultInputVal={paymentHandler?.upiId || ''}
				onChangeBank={showBankPopup}
				class={$$props.class}
				isLoading={loadingState.isLoading || validateUPILoading}
			/>
		{/if}

		{#if bankPopupVisible}
			<BankSelectionPopup
				bankAccounts={profileData?.bankDetails}
				selectedAccount={paymentHandler?.selectedAccount}
				{onAccountChange}
				onClose={hideBankPopup}
			/>
		{/if}

		{#if upiState.flow === 2}
			<UpiTransactionPopup
				amount={itemList?.totalAmount?.toString()}
				timer={upiState.timer}
				onClose={onUPITransactionPopupClose}
			/>
		{:else if upiState.flow === 3}
			<UpiClosePopup onClose={onUPITransactionContinuation} onConfirm={upiCloseLogic} />
		{/if}

		{#if loadingState.isLoading}
			<LoadingPopup heading={loadingState.heading} />
		{:else if pending.visible}
			<ResultPopup
				popupType="PENDING"
				title={pending.heading}
				text={pending.subHeading}
				class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				isModalOpen
				handleButtonClick={closePendingPopup}
				buttonTitle="CLOSE"
				buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
				buttonVariant="contained"
			/>
		{:else if error.visible}
			<ResultPopup
				popupType="FAILURE"
				title={error.heading}
				text={error.subHeading}
				class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				isModalOpen
				handleButtonClick={closeErrorPopup}
				buttonTitle={error.type === 'PATCH_FAILED' || error.type === 'PAYMENT_PATCH_FAILED'
					? 'CLOSE'
					: 'RETRY'}
				buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
				buttonVariant="contained"
			/>
		{/if}
	{:catch}
		<div class="flex h-full flex-col items-center self-center px-4 py-4">
			<div class="mb-4 text-center text-base font-medium text-black-title">
				We are facing some issue at our end. Please try again or contact field support
			</div>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
				REFRESH
			</Button>
		</div>
	{/await}
</article>
