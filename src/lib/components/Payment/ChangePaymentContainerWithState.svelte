<script lang="ts">
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import Modal from '$components/Modal.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import { onDestroy, onMount } from 'svelte';
	import LoadingPopup from '../../../routes/(app)/InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import { PAYMENT_MODE } from './constants';
	import PaymentMethod from './PaymentMethod.svelte';
	import PaymentMethodHeader from './PaymentMethodHeader.svelte';
	import UpiClosePopup from './UPIClosePopup.svelte';
	import UpiTransactionPopup from './UPITransactionPopup.svelte';

	import { browser } from '$app/environment';
	import logger from '$lib/utils/logger';
	import { v4 as uuidv4 } from 'uuid';
	import {
		closeNetBankingPaymentWindow,
		initializeGPayState,
		initializeUPIState,
		intializeNetBankingState
	} from './util';

	export let amount: string;
	export let requestId: string;
	export let bankAccounts: BankDetailsEntity[];
	export let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: '',
		firstTimeUser: true
	};

	export let pendingFlow: (param: object) => void;
	export let paymentFlow: (param: object) => void;
	export let updatePaymentHandler: (param: object) => void;
	export let hidePaymentMethodScreen: () => void;

	export let redirectedFrom = ''; // order pad specific
	export let isSchemeDisabled = false; // order pad specific

	// payment
	let xRequestId = '';
	let inputPaymentError = '';
	let bankPopupVisible = false;
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

	const onPaymentModeSelect = (paymentMode: string) => {
		PAYMENT_MODE[paymentMode].analytics();
		updatePaymentHandler({
			paymentMode,
			firstTimeUser: false
		});
	};

	const resetInputPaymentError = () => {
		inputPaymentError = '';
	};

	const onAccountChange = (index: number) => {
		updatePaymentHandler({
			selectedAccount: index
		});
	};

	const hideBankPopup = () => {
		bankPopupVisible = false;
	};

	const showBankPopup = () => {
		bankPopupVisible = true;
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
	// -------- **** ----------

	const upiValidationErrorHandler = (error) => {
		inputPaymentError = error;
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

<Modal isModalOpen={true}>
	<div
		class="flex h-full w-full flex-col bg-white shadow-csm sm:h-max sm:max-h-[640px] sm:w-max sm:min-w-[490px]"
	>
		<PaymentMethodHeader onBackClick={hidePaymentMethodScreen} title="Complete Your Payment" />
		<slot name="schemeTile" />
		<PaymentMethod
			paymentModes={Object.keys(PAYMENT_MODE)}
			selectedMode={paymentHandler?.paymentMode}
			onSelect={onPaymentModeSelect}
			onSubmit={onPaymentTypeSubmit}
			{amount}
			{bankAccounts}
			selectedAccount={paymentHandler?.selectedAccount}
			inputError={inputPaymentError}
			resetInputError={resetInputPaymentError}
			defaultInputVal={paymentHandler?.upiId || ''}
			onChangeBankClick={showBankPopup}
			isLoading={validateUPILoading || loadingState.isLoading}
			{redirectedFrom}
			{isSchemeDisabled}
			class="sm:px-8 sm:py-8"
		/>
	</div>
</Modal>

{#if bankPopupVisible}
	<BankSelectionPopup
		{bankAccounts}
		selectedAccount={paymentHandler?.selectedAccount}
		{onAccountChange}
		onClose={hideBankPopup}
	/>
{/if}

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
