<script lang="ts">
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import Modal from '$components/Modal.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import { onDestroy, onMount } from 'svelte';
	import LoadingPopup from '../../../routes/(app)/InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import { PAYMENT_MODE, WRONG_BANK_ERROR_CODE } from './constants';
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
	import { WMSIcon } from 'svelte-components';

	export let amount: string;
	export let requestId: string;
	export let bankAccounts: BankDetailsEntity[];
	export let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: '',
		firstTimeUser: true
	};
	export let defaultInputPaymentError = '';

	export let allowedPaymentmethods = Object.keys(PAYMENT_MODE);

	export let pendingFlow: (param: object) => void;
	export let paymentFlow: (param: object) => void;
	export let updatePaymentHandler: (param: object) => void;
	export let hidePaymentMethodScreen: () => void;
	export let clearInputPaymentError: () => void = () => undefined;

	export let redirectedFrom = ''; // order pad specific
	export let isSchemeDisabled = false; // order pad specific

	// payment
	let xRequestId = '';
	let inputPaymentError = defaultInputPaymentError;
	let bankPopupVisible = false;
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
		clearInputPaymentError();
	});

	//  ------- helpers functions -----------
	const assignNewRequestId = () => {
		xRequestId = uuidv4();
	};

	const onPaymentModeSelect = (paymentMode: string) => {
		updatePaymentHandler({
			paymentMode,
			firstTimeUser: false
		});

		const eventMetaData = {
			mode: paymentHandler?.paymentMode
		};

		PAYMENT_MODE[paymentMode].analytics(eventMetaData);
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
			paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode]?.name,
			paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode]?.apiName,
			gpayPaymentState
		};

		paymentFlow(commonInput);
	};
</script>

<Modal isModalOpen={true}>
	<div
		class="flex h-full w-full flex-col bg-white shadow-csm sm:h-max sm:max-h-[640px] sm:w-max sm:min-w-[490px] {$$props.class}"
	>
		<PaymentMethodHeader onBackClick={hidePaymentMethodScreen} isPartOfModal />
		<slot name="schemeTile" />
		<PaymentMethod
			paymentModes={allowedPaymentmethods}
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
		on:secondaryButtonClick={closeErrorPopup}
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
