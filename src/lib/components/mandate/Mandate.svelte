<script lang="ts">
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import type { UserProfile } from '$lib/types/IUserProfile';
	import { onDestroy } from 'svelte';
	import LoadingPopup from '../../../routes/(app)/InvestmentPad/OrderPadComponents/LoadingPopup.svelte';

	import { EMANDATE_MODE } from './constants';
	import UpiTransactionPopup from '$components/Payment/UPITransactionPopup.svelte';
	import UpiClosePopup from '$components/Payment/UPIClosePopup.svelte';
	import SuccessPopup from './components/SuccessPopup.svelte';
	import EmandateMethod from './components/EmandateMethod.svelte';
	import { stringToFloat } from 'svelte-components';
	import { getMandateAmount, initializeUPIState, intializeNetBankingState } from './utils';
	import { netBankingFlow, upiFlow, walletFlow } from './flow';
	import { add } from 'date-fns';
	import { accounChangeAnalytics } from './analytics';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';

	export let profileData: UserProfile;
	export let amount: string;
	export let mode: string;
	export let defaultBankAccount: number;
	export let allowedPaymentMethods = Object.keys(EMANDATE_MODE);
	export let onStart = (): void => undefined;
	export let onSuccessCallback = (): void => undefined;
	export let onErrorCallback = (): void => undefined;
	export let onPendingCallback = (): void => undefined;
	export let onSuccessPopupClick = (): void => undefined;
	export let updateMode = (): void => undefined;
	export let onAccChange = (): void => undefined;

	// emandate
	const amountInNumber = stringToFloat(amount);
	let isSuccess = false;
	let paymentHandler = {
		selectedAccount: 0,
		emandateMode: mode,
		upiId: '',
		firstTimeUser: true
	};
	let inputPaymentError = '';
	let bankPopupVisible = false;
	let validateUPILoading = false;
	const error = {
		visible: false,
		heading: '',
		subHeading: ''
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

	onDestroy(() => {
		resetState();
	});

	//  ------- helpers functions -----------

	const updatePaymentHandler = (updateItem) => {
		paymentHandler = {
			...paymentHandler,
			...updateItem
		};
	};

	const onEmandateModeSelect = (emandateMode: string) => {
		updateMode(emandateMode);
		updatePaymentHandler({
			emandateMode,
			firstTimeUser: false
		});

		const eventMetaData = {
			mode: paymentHandler?.emandateMode
		};

		EMANDATE_MODE[emandateMode].analytics(eventMetaData);
	};

	const resetInputPaymentError = () => {
		inputPaymentError = '';
	};

	const onAccountChange = (index: number) => {
		onAccChange(index);
		accounChangeAnalytics({
			BankAccount: profileData?.bankDetails?.[index]?.bankName
		});
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

	const displayError = ({ heading = 'Autopay Setup Failed', errorSubHeading = '' }) => {
		error.visible = true;
		error.heading = heading;
		error.subHeading = errorSubHeading;
	};

	const displayPending = ({ heading = 'Autopay Setup Pending', pendingSubHeading = '' }) => {
		pending.visible = true;
		pending.heading = heading;
		pending.subHeading = pendingSubHeading;
	};

	const closeErrorPopup = () => {
		error.heading = '';
		error.subHeading = '';
		error.visible = false;
	};

	const closePendingPopup = () => {
		pending.heading = '';
		pending.subHeading = '';
		pending.visible = false;
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
		// initializeGPayState(gpayPaymentState);
	};
	// -------- **** ----------

	const upiValidationErrorHandler = (error) => {
		inputPaymentError = error;
	};

	const updateUPITimer = (time: number) => {
		upiState.timer = time;
	};

	const getSipStartDateWithoutFormat = () => {
		const now = new Date();
		return add(now, { days: 0 });
	};

	const getSipStartDate = () => {
		return getSipStartDateWithoutFormat().getTime();
	};

	const getSipEndDate = () => {
		return add(getSipStartDateWithoutFormat(), {
			months: 360
		}).getTime();
	};

	const onError = ({ heading = '', errorSubHeading = '' }) => {
		onErrorCallback();
		displayError({
			heading,
			errorSubHeading
		});
	};

	const onSuccess = (params) => {
		isSuccess = true;
		onSuccessCallback(params);
	};

	const onPending = ({ heading = '', pendingSubHeading = '' }) => {
		onPendingCallback();
		displayPending({
			heading,
			pendingSubHeading
		});
	};

	const onEmandateSubmit = async (inputId: string) => {
		onStart(paymentHandler.emandateMode);
		const commonInput = {
			amount: getMandateAmount(paymentHandler.emandateMode, amountInNumber),
			sipStartDate: getSipStartDate(),
			sipEndDate: getSipEndDate(),
			accNO: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO,
			ifscCode: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.ifscCode,
			bankName: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			shortName: profileData?.clientDetails?.shortName,
			clientId: profileData?.clientId,
			accountType: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accountType,
			mobile: profileData?.mobile,
			showLoading,
			stopLoading,
			onError,
			onSuccess,
			onPending
		};

		if (paymentHandler.emandateMode === 'NET_BANKING') {
			netBankingFlow({
				...commonInput,
				netBankingState
			});
		} else if (paymentHandler.emandateMode === 'UPI') {
			upiFlow({
				...commonInput,
				inputId,
				upiState,
				state,
				showUPILoading,
				stopUPILoading,
				updateUPITimer,
				onUPIValidationFailure: upiValidationErrorHandler
			});
		} else {
			walletFlow({
				emandateModeName: EMANDATE_MODE[paymentHandler.emandateMode].name,
				emandateModeAPIName: EMANDATE_MODE[paymentHandler.emandateMode].apiName,
				...commonInput,
				gpayPaymentState,
				state
			});
		}
	};

	$: updatePaymentHandler({
		selectedAccount: defaultBankAccount > 0 ? defaultBankAccount : 0,
		emandateMode: mode
	});
</script>

<EmandateMethod
	emandateModes={allowedPaymentMethods}
	selectedMode={paymentHandler?.emandateMode}
	onSelect={onEmandateModeSelect}
	onSubmit={onEmandateSubmit}
	amount={getMandateAmount(paymentHandler.emandateMode, amountInNumber)?.toString()}
	bankAccounts={profileData?.bankDetails}
	selectedAccount={paymentHandler?.selectedAccount}
	inputError={inputPaymentError}
	resetInputError={resetInputPaymentError}
	defaultInputVal={paymentHandler?.upiId || ''}
	onChangeBankClick={showBankPopup}
	isLoading={validateUPILoading || loadingState.isLoading}
	class="sm:px-8 sm:py-8"
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
		amount={getMandateAmount(paymentHandler.emandateMode, amountInNumber)?.toString()}
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
		class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
		handleButtonClick={closeErrorPopup}
		closeModal={closeErrorPopup}
		buttonTitle="TRY AGAIN"
		buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
		buttonVariant="contained"
	/>
{:else if pending.visible}
	<ResultPopup
		popupType={STATUS_ARR?.PENDING}
		title={pending.heading}
		text={pending.subHeading}
		class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
		handleButtonClick={closePendingPopup}
		closeModal={closePendingPopup}
		buttonTitle="DONE"
		buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
		buttonVariant="outlined"
	/>
{:else if isSuccess}
	<SuccessPopup
		mandateLimit={getMandateAmount(paymentHandler.emandateMode, amountInNumber)?.toString()}
		buttonTitle="DONE"
		onSubmit={onSuccessPopupClick}
	/>
{/if}
