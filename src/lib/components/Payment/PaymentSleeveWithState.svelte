<script lang="ts">
	import { browser } from '$app/environment';
	import logger from '$lib/utils/logger';
	import { onDestroy, onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { PAYMENT_MODE } from '$components/Payment/constants';
	import {
		closeNetBankingPaymentWindow,
		initializeGPayState,
		initializeUPIState,
		intializeNetBankingState
	} from './util';
	import UpiTransactionPopup from './UPITransactionPopup.svelte';
	import UpiClosePopup from './UPIClosePopup.svelte';
	import LoadingPopup from '../../../routes/(app)/InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import Button from '$components/Button.svelte';
	import OrderPadPaymentSleeve from './OrderPadPaymentSleeve.svelte';
	import { stringToInteger } from '$lib/utils/helpers/numbers';

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

	export let submitButtonText = 'Proceed';
	export let isSubmitButtonDisabled = false;
	export let isPaymentSleeveVisible = true;

	// payment
	let xRequestId = '';
	let validateUPILoading = false;
	const error = {
		visible: false,
		heading: '',
		subHeading: '',
		type: ''
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

	const displayError = ({ heading = 'Error', errorSubHeading = '', type = '' }) => {
		error.visible = true;
		error.heading = heading;
		error.subHeading = errorSubHeading;
		error.type = type;
	};

	const closeErrorPopup = () => {
		error.heading = '';
		error.subHeading = '';
		error.visible = false;
		error.type = '';
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
			paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode].name,
			paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode].apiName,
			gpayPaymentState
		};

		paymentFlow(commonInput);
	};
</script>

<section class="flex w-full flex-row">
	{#if !paymentHandler.firstTimeUser && stringToInteger(amount) > 0 && isPaymentSleeveVisible}
		<OrderPadPaymentSleeve
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
			!amount
				? 'cursor-default !bg-grey-line !text-grey-disabled active:opacity-100'
				: 'bg-blue-primary'
		}`}
		disabled={!amount || validateUPILoading || loadingState.isLoading || isSubmitButtonDisabled}
		onClick={() => onPaymentTypeSubmit(paymentHandler.upiId)}
	>
		{submitButtonText}
	</Button>
</section>

{#if upiState.flow === 2}
	<UpiTransactionPopup {amount} timer={upiState.timer} onClose={onUPITransactionPopupClose} />
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
		class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
		handleButtonClick={closeErrorPopup}
		closeModal={closeErrorPopup}
		buttonTitle="TRY AGAIN"
		buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
		buttonVariant="contained"
	/>
{/if}
