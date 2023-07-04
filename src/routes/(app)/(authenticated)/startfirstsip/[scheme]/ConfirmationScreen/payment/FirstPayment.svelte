<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { goto, invalidate } from '$app/navigation';
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

	import { upiSIPFlow, walletSIPFlow } from '$components/Payment/flow';
	import { onDestroy } from 'svelte';
	import {
		initializeGPayState,
		initializeUPIState,
		intializeNetBankingState
	} from '$components/Payment/util';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	// import  changePaymentMethodAnalytics,
	// mountChangePaymentMethodAnalytics,
	// paymentFailedScreenCloseButtonAnalytics,
	// paymentPendingScreenCloseButtonAnalytics
	// '../../../../cart/analytics/confirmation';

	export let scheme: SchemeDetails;
	export let amount: number;
	export let calendarDate = 4;
	export let dateSuperscript = 'th';

	export let hidePaymentMethodScreen = (): void => undefined;

	const allowedPaymentmethods = ['PHONEPE', 'GOOGLEPAY', 'UPI'];

	$: profileData = $page?.data?.profile;

	let xRequestId = '';
	let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: ''
	};
	let firstTimeUser = false;
	// let showChangePayment = false;
	let inputPaymentError = '';
	let bankPopupVisible = false;
	let validateUPILoading = false;
	let pendingCaseOrderID: number;
	let pendingCaseSipID: number;
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

	// onMount(() => {
	// 	// window.addEventListener('message', listenerFunc);
	// });

	onDestroy(() => {
		resetState();
	});

	const resetState = () => {
		if (state.interval) {
			clearInterval(state.interval);
		}
		intializeNetBankingState(netBankingState);
		initializeUPIState(upiState);
		initializeGPayState(gpayPaymentState);
	};

	const showPaymentMethodScreen = () => {
		// TODO: Analytics
		// changePaymentMethodAnalytics();
		// showChangePayment = true;
		// mountChangePaymentMethodAnalytics({
		// 	DefaultPaymentMethod: paymentHandler?.paymentMode,
		// 	DefaultBank: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
		// 	ChangeBankAvailable: profileData?.bankDetails?.length > 1
		// });
	};

	const onPaymentModeSelect = (paymentMode: string) => {
		paymentHandler.paymentMode = paymentMode;
		firstTimeUser = false;
	};

	const resetInputPaymentError = () => {
		inputPaymentError = '';
	};

	const showBankPopup = () => {
		bankPopupVisible = true;
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

	// const paymentFailedScreenAnalyticsWithData = async () => {
	// 	const itemList = await data.api.itemList;
	// 	paymentFailedScreenAnalytics({
	// 		Amount: itemList?.totalAmount,
	// 		PaymentMethod: paymentHandler?.paymentMode,
	// 		PaymentBank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName,
	// 		PaymentFailed:
	// 			'IF the money has been debited from your bank account, please do not worry, it will be refunded automatically'
	// 	});
	// };

	const displayError = ({ heading = 'Error', errorSubHeading = '', type = '' }) => {
		if (type === 'PAYMENT_FAILED' || type === 'PAYMENT_PATCH_FAILED') {
			// TODO: Analytics
			// paymentFailedScreenAnalyticsWithData();
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
			// TODO: Analytics
			// paymentFailedScreenCloseButtonAnalytics();
			goBack();
		} else if (error.type === 'PAYMENT_FAILED') {
			// TODO: Analytics
			// paymentFailedScreenCloseButtonAnalytics();
			onRefresh();
		}
		error.type = '';
	};

	const displayPendingPopup = async ({
		heading = 'Payment Pending',
		errorSubHeading = '',
		orderId,
		sipId
	}) => {
		// TODO: Analytics
		// const itemList = await data.api.itemList;
		// paymentPendingScreenAnalytics({
		// 	Amount: itemList?.totalAmount,
		// 	PaymentMethod: paymentHandler?.paymentMode,
		// 	PaymentBank: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
		// 	PaymentPending:
		// 		'we are confirming the status of your payment. This Usually takes few minutes. We will notify you once we have an update'
		// });
		pending.visible = true;
		pending.heading = heading;
		pending.subHeading = errorSubHeading;
		pendingCaseOrderID = orderId;
		pendingCaseSipID = sipId;
	};

	const closePendingPopup = () => {
		// TODO: Analytics
		// paymentPendingScreenCloseButtonAnalytics();
		pending.heading = '';
		pending.subHeading = '';
		pending.visible = false;
		navigatToOrderSummary({
			orderId: pendingCaseOrderID,
			sipId: pendingCaseSipID
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

	const getSIPDate = () => {
		const firstSipPayment = true;
		return getCompleteSIPDateBasedonDD(calendarDate, new Date(), firstSipPayment ? 30 : 10);
	};

	const onPayment = async (inputId: string) => {
		// TODO: analytics
		// const itemList = await data.api.itemList;
		// if (showChangePayment) {
		// 	paymentModeScreenPayButtonClickAnalytics({
		// 		NoOfFunds: itemList?.shortenedFundList?.length,
		// 		CheckedFundsList: itemList?.shortenedFundList
		// 	});
		// } else {
		// 	clickCheckoutAnalytics({
		// 		NoOfFunds: itemList?.shortenedFundList?.length,
		// 		CheckedFundsList: itemList?.shortenedFundList
		// 	});
		// }

		assignNewRequestId();

		//source,
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
		} else if (
			paymentHandler?.paymentMode !== 'NET_BANKING' &&
			paymentHandler?.paymentMode !== 'UPI'
		) {
			walletSIPFlow({
				...commonSIPInput,
				paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode].name,
				paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode].apiName,
				gpayPaymentState,
				isFirstSip: true
			});
		}
	};

	// TODO: USE OF THIS INVALIDATE
	const onRefresh = async () => {
		invalidate('app:cart:confirmation');
	};

	const goBack = async () => {
		window.history.back();
	};

	const navigatToOrderSummary = async ({ orderId, sipId }) => {
		// cartStore.updateCartData(false);
		const params = encodeObject({
			amount: amount,
			isin: scheme?.isin,
			date: calendarDate,
			orderID: orderId,
			sipID: sipId
		});

		goto(`${base}/startfirstsip/summary?params=${params}`, {
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

	<!-- {#if true || bankPopupVisible}
		<BankSelectionPopup
			bankAccounts={profileData?.bankDetails}
			selectedAccount={paymentHandler?.selectedAccount}
			{onAccountChange}
			onClose={hideBankPopup}
		/>
	{/if} -->

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
	<!-- {:catch} -->
	<!-- <div class="flex h-full flex-col items-center self-center px-4 py-4">
			<div class="mb-4 text-center text-base font-medium text-black-title">
				We are facing some issue at our end. Please try again or contact field support
			</div>
			<Button variant="transparent" class="mt-6 w-max self-center" onClick={onRefresh}>
				REFRESH
			</Button>
		</div> -->
	<!-- {/await} -->
</article>
