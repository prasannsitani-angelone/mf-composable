<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import ChangePaymentContainer from '../../../../../InvestmentPad/OrderPadComponents/ChangePaymentContainer.svelte';
	import LoadingPopup from '$components/Payment/LoadingPopup.svelte';
	import UpiClosePopup from '$components/Payment/UPIClosePopup.svelte';
	import UpiTransactionPopup from '$components/Payment/UPITransactionPopup.svelte';
	import { PAYMENT_MODE } from '$components/Payment/constants';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import { getCompleteSIPDateBasedonDD } from '$lib/utils/helpers/date';
	import { encodeObject } from '$lib/utils/helpers/params';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';

	import { upiSIPFlow, walletSIPFlow } from '$components/Payment/flow';
	import { onDestroy, onMount } from 'svelte';
	import { initializeGPayState, initializeUPIState } from '$components/Payment/util';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import {
		landedOnPaymentScreenAnalytics,
		paymentRadioClickAnalytics,
		paymentOnPayClickAnalytics,
		paymentFailureScreenAnalytics,
		onRetryClickAnalytics,
		paymentPendingScreenAnalytics,
		paymentOnRequestResponseAnalytics
	} from '$lib/analytics/startFirstSip/payment';

	export let scheme: SchemeDetails;
	export let amount: number;
	export let calendarDate = 4;
	export let calendarMonth: string;
	export let calendarYear: number;
	export let dateSuperscript = 'th';

	export let hidePaymentMethodScreen = (): void => undefined;

	const nextSipDateBufferDays = 30;
	const allowedPaymentmethods = ['PHONEPE', 'GOOGLEPAY', 'UPI'];

	$: profileData = $page?.data?.profile;

	let xRequestId = '';
	let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: ''
	};
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
	const gpayPaymentState = {
		paymentWindowInterval: null,
		waitTime: 10
	};

	onMount(() => {
		const eventMetaData = {
			FundISIN: scheme?.isin,
			MonthlyAmount: `${amount}`,
			SipDate: `${calendarDate}-${
				new Date(`${calendarMonth} 1, ${calendarYear}`).getMonth() + 1
			}-${calendarYear}`
		};

		landedOnPaymentScreenAnalytics(eventMetaData);
	});

	onDestroy(() => {
		resetState();
	});

	const resetState = () => {
		if (state.interval) {
			clearInterval(state.interval);
		}
		initializeUPIState(upiState);
		initializeGPayState(gpayPaymentState);
	};

	const onPaymentModeSelect = (paymentMode: string) => {
		const eventMetaData = { ModeofPayment: paymentMode };
		paymentRadioClickAnalytics(eventMetaData);
		paymentHandler.paymentMode = paymentMode;
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

	const displayError = ({ heading = 'Error', errorSubHeading = '', type = '' }) => {
		if (type === 'PAYMENT_FAILED' || type === 'PAYMENT_PATCH_FAILED') {
			paymentFailureScreenAnalytics();
			const eventMetaData = { status: 'Failure', message: errorSubHeading };
			paymentOnRequestResponseAnalytics(eventMetaData);
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
		error.type = '';
		onRetryClickAnalytics();
	};

	const displayPendingPopup = async ({ errorSubHeading = '', orderId, sipId }) => {
		paymentPendingScreenAnalytics();
		const eventMetaData = { status: 'Pending', message: errorSubHeading };
		paymentOnRequestResponseAnalytics(eventMetaData);
		navigatToOrderSummary({
			orderId,
			sipId
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
	};

	const updateUPITimer = (time: number) => {
		upiState.timer = time;
	};

	const assignNewRequestId = () => {
		xRequestId = uuidv4();
	};

	const getSIPDate = () => {
		return getCompleteSIPDateBasedonDD(calendarDate, new Date(), nextSipDateBufferDays);
	};

	const onPayment = async (inputId: string) => {
		const eventMetaData = {
			FundISIN: scheme?.isin,
			MonthlyAmount: `${amount}`,
			SipDate: `${calendarDate}-${
				new Date(`${calendarMonth} 1, ${calendarYear}`).getMonth() + 1
			}-${calendarYear}`,
			Paidfrom: paymentHandler?.paymentMode
		};

		paymentOnPayClickAnalytics(eventMetaData);

		assignNewRequestId();

		const commonInput = {
			amount,
			accNO: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO,
			ifscCode: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.ifscCode,
			bankName: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			dpNumber: profileData?.dpNumber,
			fullName: profileData?.clientDetails?.fullName,
			schemeCode: scheme?.schemeCode,
			xRequestId,
			state,
			showLoading,
			stopLoading,
			displayPendingPopup,
			displayError,
			onStart: hidePaymentMethodScreen,
			onSuccess: navigatToOrderSummary
		};

		const commonSIPInput = {
			...commonInput,
			sipFrequency: scheme?.sipFrequency,
			sipMaxInstallmentNo: scheme?.sipMaxInstallmentNo,
			sipDate: getSIPDate(),
			onSuccess: navigatToOrderSummary
		};

		if (paymentHandler?.paymentMode === 'UPI') {
			paymentHandler.upiId = inputId;
			upiSIPFlow({
				...commonSIPInput,
				inputId,
				upiState,
				showUPILoading,
				stopUPILoading,
				onUPIValidationFailure,
				updateUPITimer,
				isFirstSip: true
			});
		} else {
			walletSIPFlow({
				...commonSIPInput,
				paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode].name,
				paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode].apiName,
				gpayPaymentState,
				isFirstSip: true
			});
		}
	};

	const goBack = async () => {
		window.history.back();
	};

	const navigatToOrderSummary = async ({ orderId, sipId }) => {
		const params = encodeObject({
			amount: amount,
			isin: scheme?.isin,
			date: calendarDate,
			orderID: orderId,
			sipID: sipId,
			firstTimePayment: true
		});

		const eventMetaData = { status: 'Success', message: 'Success' };
		paymentOnRequestResponseAnalytics(eventMetaData);

		goto(`${base}/startfirstsip/summary?params=${params}`, {
			replaceState: true
		});
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="text-title-black hidden flex-row items-center pb-6 pt-3 text-lg font-medium active:opacity-80 sm:flex"
	on:click={goBack}
>
	<WMSIcon name="left-arrow" height={16} width={16} class="mr-4" />
	Confirm Order
</div>

<article class="flex h-full flex-col sm:h-max">
	<ChangePaymentContainer
		isSIP={true}
		{dateSuperscript}
		{calendarDate}
		amount={amount.toString()}
		schemeName={scheme?.schemeName}
		onBackClick={hidePaymentMethodScreen}
		paymentModes={Object.keys(PAYMENT_MODE)}
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
		{allowedPaymentmethods}
	/>

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
			amount={amount.toString()}
			timer={upiState.timer}
			onClose={onUPITransactionPopupClose}
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
			class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
			isModalOpen
			handleButtonClick={closeErrorPopup}
			buttonTitle={error.type === 'PATCH_FAILED' || error.type === 'PAYMENT_PATCH_FAILED'
				? 'CLOSE'
				: 'RETRY'}
			buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
			buttonVariant="contained"
		/>
	{/if}
</article>
