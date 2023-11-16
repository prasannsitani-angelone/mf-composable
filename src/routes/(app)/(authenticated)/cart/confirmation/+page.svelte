<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import Button from '$components/Button.svelte';
	import ChangePaymentContainer from '$components/Payment/ChangePaymentContainer.svelte';
	import LoadingPopup from '$components/Payment/LoadingPopup.svelte';
	import PaymentSleeve from '$components/Payment/PaymentSleeve.svelte';
	import UpiClosePopup from '$components/Payment/UPIClosePopup.svelte';
	import UpiTransactionPopup from '$components/Payment/UPITransactionPopup.svelte';
	import {
		NET_BANKING_MIN_LIMIT,
		PAYMENT_MODE,
		UPI_MAX_LIMIT,
		WRONG_BANK_ERROR_CODE
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
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { cartStore } from '$lib/stores/CartStore';
	import {
		changePaymentMethodAnalytics,
		clickCheckoutAnalytics,
		mountAnalytics,
		mountChangePaymentMethodAnalytics,
		paymentFailedScreenAnalytics,
		paymentFailedScreenCloseButtonAnalytics,
		paymentModeScreenPayButtonClickAnalytics,
		paymentPendingScreenAnalytics
	} from '../analytics/confirmation';
	import TableSkeleton from '$components/Table/TableSkeleton.svelte';
	import { paymentAppStore } from '$lib/stores/IntentPaymentAppsStore';
	import KycProgressPopup from '$components/Payment/KYCProgressPopup.svelte';
	import TncModal from '$components/TnC/TncModal.svelte';

	export let data: PageData;

	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
	$: profileData = $page?.data?.profile;
	$: userData = $page?.data?.userDetails;
	$: isMobile = $page?.data?.deviceType?.isMobile;

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
	let isKYCInProgress = false;
	let showTncModal = false;

	const error = {
		visible: false,
		heading: '',
		subHeading: '',
		type: '',
		code: ''
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
			logger.debug({
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
				(paymentMode === 'GOOGLEPAY' || paymentMode === 'PHONEPE' || paymentMode === 'PAYTM') &&
				os !== 'Android' &&
				os !== 'iOS'
			) {
				paymentHandler.paymentMode = 'UPI';
			} else {
				const newPaymentMode =
					paymentAppStore.checkIfPaymentAppInstalledElseGetFallback(paymentMode);
				if (newPaymentMode) {
					paymentHandler.paymentMode = newPaymentMode;
				} else {
					defaultValueToPaymentHandler();
				}
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

	const toggleKYCProgressPopup = () => {
		isKYCInProgress = !isKYCInProgress;
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

	const displayError = ({ heading = 'Error', errorSubHeading = '', type = '', code = '' }) => {
		if (type === 'PAYMENT_FAILED' || type === 'PAYMENT_PATCH_FAILED') {
			paymentFailedScreenAnalyticsWithData();
		}
		error.visible = true;
		error.heading = heading;
		error.subHeading = errorSubHeading;
		error.type = type;
		error.code = code;

		if (error?.code === WRONG_BANK_ERROR_CODE) {
			error.heading = 'Incorrect Bank Account Selected on UPI App';
		}
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
		error.code = '';
	};

	const retryWithSamePaymentMethod = () => {
		closeErrorPopup();
		onPayment(paymentHandler?.upiId);
	};

	const handleChangePaymentMethodRetryClick = () => {
		closeErrorPopup();
		showChangePayment = true;
	};

	const displayPendingPopup = async ({ orderId }) => {
		const itemList = await data.api.itemList;
		paymentPendingScreenAnalytics({
			Amount: itemList?.totalAmount,
			PaymentMethod: paymentHandler?.paymentMode,
			PaymentBank: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			PaymentPending:
				'we are confirming the status of your payment. This Usually takes few minutes. We will notify you once we have an update'
		});
		navigatToOrderSummary({
			orderId
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
		if (userData?.isKycInProgress) {
			toggleKYCProgressPopup();
			return;
		}

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
				paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode]?.name,
				paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode]?.apiName,
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
	const toggleTncModal = () => {
		showTncModal = !showTncModal;
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="text-title-black hidden flex-row items-center pb-6 pt-3 text-lg font-normal active:opacity-80 sm:flex"
	on:click={goBack}
>
	<WMSIcon name="left-arrow" height={16} width={16} class="mr-4" />
	Confirm Order
</div>

<article class="flex h-full flex-col sm:h-max">
	{#await data.api.itemList}
		<TableSkeleton />
	{:then itemList}
		{#if itemList.ok}
			<div class="flex h-full flex-col overflow-hidden sm:h-max sm:overflow-auto">
				<div class="flex flex-1 flex-col overflow-auto sm:mb-3 sm:flex-initial sm:overflow-visible">
					<div
						class="hidden grid-cols-[46%_18%_18%_18%] items-center border-b border-t border-grey-line bg-white px-6 py-4 text-sm font-normal text-grey-dark sm:grid"
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
					{#if isMobile}
						<article class="flex items-center justify-center bg-white px-4 pt-2">
							<p class="text-center text-xs font-normal text-black-title">
								By proceeding, you accept Angel One's
								<button class="text-blue-primary md:cursor-pointer" on:click={toggleTncModal}>
									Terms and Conditions
								</button>
							</p>
						</article>
					{/if}
					<div class="flex flex-row items-center justify-between bg-white px-4 py-3">
						{#if !firstTimeUser}
							<div class="flex flex-1">
								<PaymentSleeve
									selectedMode={paymentHandler?.paymentMode}
									onPaymentMethodChange={showPaymentMethodScreen}
									bankName={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName}
									bankAccount={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO}
									upiId={paymentHandler.upiId}
								/>
							</div>
						{/if}
						<div class="flex flex-1 flex-col">
							{#if !isMobile}
								<article class="flex items-center justify-center bg-white px-4 py-2">
									<p class="text-center text-xs font-normal text-black-title">
										By proceeding, you accept Angel One's
										<button class="text-blue-primary md:cursor-pointer" on:click={toggleTncModal}>
											Terms and Conditions
										</button>
									</p>
								</article>
							{/if}
							<Button
								class="flex h-12 flex-1 rounded"
								onClick={() => onPayment(paymentHandler.upiId)}
								disabled={loadingState.isLoading || validateUPILoading}
							>
								{firstTimeUser
									? 'CONTINUE'
									: `PAY ₹${addCommasToAmountString(itemList?.totalAmount?.toString())}`}
							</Button>
						</div>
					</div>
				{/await}
			</div>
		{:else}
			<div class="flex h-full flex-col items-center self-center px-4 py-4">
				<div class="mb-4 text-center text-base font-normal text-black-title">
					We are facing some issue at our end. Please try again or contact field support
				</div>
				<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
					REFRESH
				</Button>
			</div>
		{/if}
		{#if showChangePayment}
			<ChangePaymentContainer
				allowedPaymentmethods={$paymentAppStore.allPaymentApps}
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
				accNO={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO}
				bankName={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName}
				bankLogo={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankLogo}
			/>
		{:else if upiState.flow === 3}
			<UpiClosePopup onClose={onUPITransactionContinuation} onConfirm={upiCloseLogic} />
		{/if}

		{#if loadingState.isLoading}
			<LoadingPopup heading={loadingState.heading} />
		{:else if error.visible}
			<ResultPopup
				popupType="FAILURE"
				title={error.heading}
				text={error.subHeading}
				class="w-full rounded-b-none rounded-t-2xl p-6 px-4 sm:p-12 md:rounded-lg"
				isModalOpen
				handleButtonClick={retryWithSamePaymentMethod}
				closeModal={closeErrorPopup}
				buttonTitle={`RETRY WITH ${PAYMENT_MODE[paymentHandler?.paymentMode]?.name}`}
				secondaryButtonTitle="USE ANOTHER PAYMENT METHOD"
				buttonClass={`mt-5 w-full rounded cursor-default md:cursor-pointer !uppercase`}
				secondaryButtonClass="mt-3 w-full rounded cursor-default md:cursor-pointer"
				buttonVariant="contained"
				titleClass="px-3 -mt-4"
				on:secondaryButtonClick={handleChangePaymentMethodRetryClick}
			>
				<svelte:fragment slot="popupHeader">
					{#if error?.code === WRONG_BANK_ERROR_CODE}
						<WMSIcon name="red-exclamation-thin" width={92} height={92} />
					{:else}
						<WMSIcon name="red-cross-circle" width={92} height={92} />
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="middleSection">
					{#if error?.code === WRONG_BANK_ERROR_CODE}
						<section class="item-center mt-2 flex rounded bg-grey p-2">
							<div class="my-auto flex-1">
								<WMSIcon name="info-in-circle-dark" class="p-1" stroke="#3F5BD9" />
							</div>
							<div class="ml-3 text-left text-sm font-normal text-grey-body">
								If any money has been debited from your account, it will be refunded automatically.
							</div>
						</section>
					{:else}
						<section class="mt-4 text-sm text-grey-body">
							To complete your order, please retry payment
						</section>
					{/if}
				</svelte:fragment>
			</ResultPopup>
		{/if}

		{#if isKYCInProgress}
			<KycProgressPopup onClose={toggleKYCProgressPopup} onSubmit={toggleKYCProgressPopup} />
		{/if}
		{#if showTncModal}
			<!-- T&C Modal -->
			<TncModal showModal={showTncModal} on:closeModal={toggleTncModal} />
		{/if}
	{:catch}
		<div class="flex h-full flex-col items-center self-center px-4 py-4">
			<div class="mb-4 text-center text-base font-normal text-black-title">
				We are facing some issue at our end. Please try again or contact field support
			</div>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
				REFRESH
			</Button>
		</div>
	{/await}
</article>
