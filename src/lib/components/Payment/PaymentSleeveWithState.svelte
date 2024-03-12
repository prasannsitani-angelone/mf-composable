<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { PAYMENT_MODE, WRONG_BANK_ERROR_CODE } from '$components/Payment/constants';
	import UpiTransactionPopup from './UPITransactionPopup.svelte';
	import UpiClosePopup from './UPIClosePopup.svelte';
	import LoadingPopup from '../../../routes/(app)/InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import Button from '$components/Button.svelte';
	import PaymentSleeve from './PaymentSleeve.svelte';
	import { stringToInteger } from '$lib/utils/helpers/numbers';
	import { WMSIcon } from 'svelte-components';
	import {
		intializeNetBankingState,
		listenerFunc,
		type NetBankingStateType
	} from '$components/Payment/CommonHandling/netbanking';
	import { initializeUPIState, type UpiStateType } from '$components/Payment/CommonHandling/upi';
	import {
		initializeGPayState,
		type WalletPaymentStateType
	} from '$components/Payment/CommonHandling/wallet';

	export let amount: string;
	export let requestId: string;
	export let bankAccounts: BankDetailsEntity[];
	export let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: '',
		firstTimeUser: true
	};
	export let showPaymentMethodScreen: () => void;
	export let pendingFlow: (param: object) => void;
	export let paymentFlow: (param: object) => void;
	export let upiValidationErrorFunc: (param: string) => void;

	export let submitButtonText = 'Continue';
	export let isSubmitButtonDisabled = false;
	export let isPaymentSleeveVisible = true;

	// payment
	let xRequestId = '';
	let validateUPILoading = false;
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
	const upiState: UpiStateType = {
		flow: 0,
		timer: 0,
		timerInterval: null,
		paymentWindowInterval: null
	};
	const netBankingState: NetBankingStateType = {
		paymentWindow: null,
		paymentWindowInterval: null
	};
	const gpayPaymentState: WalletPaymentStateType = {
		paymentWindowInterval: null,
		waitTime: 10
	};

	onMount(() => {
		window.addEventListener('message', (event) => listenerFunc(event, netBankingState));
	});

	onDestroy(() => {
		resetState();
		if (browser) {
			window.removeEventListener('message', (event) => listenerFunc(event, netBankingState), false);
		}
	});

	//  ------- helpers functions -----------
	const assignNewRequestId = () => {
		xRequestId = uuidv4();
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

	const displayError = ({ heading = 'Error', errorSubHeading = '', type = '', code = '' }) => {
		error.visible = true;
		error.heading = heading;
		error.subHeading = errorSubHeading;
		error.type = type;
		error.code = code;
	};

	const closeErrorPopup = () => {
		error.heading = '';
		error.subHeading = '';
		error.visible = false;
		error.type = '';
		error.code = '';
	};

	const retryWithSamePaymentMethod = () => {
		closeErrorPopup();
		onPaymentTypeSubmit(paymentHandler?.upiId);
	};

	const handleChangePaymentMethodRetryClick = () => {
		closeErrorPopup();
		showPaymentMethodScreen();
	};

	const displayPendingPopup = (params) => {
		pendingFlow(params);
	};

	const showLoading = (heading: string) => {
		loadingState.isLoading = true;
		loadingState.heading = heading;
	};

	const onUPITransactionPopupClose = () => {
		upiState.flow = 3;
	};

	const onUPITransactionContinuation = () => {
		upiState.flow = 2;
	};

	const upiCloseLogic = async () => {
		upiState.flow = 0;
	};

	const resetState = () => {
		if (state.interval) {
			clearInterval(state.interval);
		}
		intializeNetBankingState(netBankingState);
		initializeUPIState(upiState);
		initializeGPayState(gpayPaymentState);
	};

	const upiValidationErrorHandler = (error) => {
		upiValidationErrorFunc(error);
	};

	const updateUPITimer = (time: number) => {
		upiState.timer = time;
	};

	const onPaymentTypeSubmit = async (inputId: string) => {
		// generating request id
		if (requestId) {
			xRequestId = requestId;
		} else {
			assignNewRequestId();
		}

		const commonInput = {
			amount,
			xRequestId,
			state,
			showLoading,
			stopLoading,
			displayPendingPopup,
			displayError,
			//netbanking
			netBankingState,
			// upi
			inputId,
			upiState,
			showUPILoading,
			stopUPILoading,
			onUPIValidationFailure: upiValidationErrorHandler,
			updateUPITimer,
			//wallet
			paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode]?.name,
			paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode]?.apiName,
			gpayPaymentState
		};

		paymentFlow(commonInput);
	};
</script>

<section class="flex w-full flex-row">
	{#if !paymentHandler.firstTimeUser && stringToInteger(amount) > 0 && isPaymentSleeveVisible}
		<PaymentSleeve
			selectedMode={paymentHandler?.paymentMode}
			onPaymentMethodChange={showPaymentMethodScreen}
			bankName={bankAccounts?.[paymentHandler?.selectedAccount]?.bankName}
			bankAccount={bankAccounts?.[paymentHandler?.selectedAccount]?.accNO}
			upiId={paymentHandler.upiId}
			class="flex flex-1"
		/>
	{/if}
	<!-- Submit Button -->
	<Button
		class={`flex h-12 flex-1 rounded ${
			!amount ? 'cursor-default !bg-border !text-disabled active:opacity-100' : 'bg-primary'
		}`}
		disabled={!amount || validateUPILoading || loadingState.isLoading || isSubmitButtonDisabled}
		onClick={() => onPaymentTypeSubmit(paymentHandler.upiId)}
	>
		{submitButtonText}
	</Button>
</section>

{#if upiState.flow === 2}
	<UpiTransactionPopup
		{amount}
		timer={upiState.timer}
		onClose={onUPITransactionPopupClose}
		accNO={bankAccounts?.[paymentHandler?.selectedAccount]?.accNO}
		bankName={bankAccounts?.[paymentHandler?.selectedAccount]?.bankName}
		bankLogo={bankAccounts?.[paymentHandler?.selectedAccount]?.bankLogo}
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
				<section class="item-center mt-2 flex rounded bg-background p-2">
					<div class="my-auto flex-1">
						<WMSIcon name="info-in-circle-dark" class="p-1" stroke="#3F5BD9" />
					</div>
					<div class="ml-3 text-left text-sm font-normal text-body">
						If any money has been debited from your account, it will be refunded automatically.
					</div>
				</section>
			{:else}
				<section class="mt-4 text-sm text-body">
					To complete your order, please retry payment
				</section>
			{/if}
		</svelte:fragment>
	</ResultPopup>
{/if}
