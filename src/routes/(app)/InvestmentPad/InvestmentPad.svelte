<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { headerStore } from '$lib/stores/HeaderStore';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import Button from '$components/Button.svelte';
	import NumPad from '$components/Keyboard/NumPad.svelte';
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import CheckboxCheckedIcon from '$lib/images/icons/CheckboxCheckedIcon.svelte';
	import CheckboxUncheckedIcon from '$lib/images/icons/CheckboxUncheckedIcon.svelte';
	import { addCommasToAmountString, formatAmount } from '$lib/utils/helpers/formatAmount';
	import TabNotSupported from './OrderPadComponents/TabNotSupported.svelte';
	import {
		getCompleteSIPDateBasedonDD,
		getDateSuperscript,
		getSIPMonthBasedOnDate,
		getSIPYearBasedOnDate
	} from '$lib/utils/helpers/date';
	import CalendarComponent from '$components/Calendar/CalendarComponent.svelte';
	import NextSipDate from '$components/Calendar/NextSipDate.svelte';
	import Modal from '$components/Modal.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import type { dateArrayTypes } from '$lib/types/Calendar/ICalendar';
	import type { decodedParamsTypes } from '$lib/types/IOrderPad';
	import TncModal from '$components/TnC/TncModal.svelte';
	import NotAllowed from './OrderPadComponents/NotAllowed.svelte';
	import { PAYMENT_MODE } from './constants';
	import PaymentSleeve from './OrderPadComponents/PaymentSleeve.svelte';
	import ChangePaymentContainer from './OrderPadComponents/ChangePaymentContainer.svelte';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import LoadingPopup from './OrderPadComponents/LoadingPopup.svelte';
	import UpiTransactionPopup from './OrderPadComponents/UPITransactionPopup.svelte';
	import UpiClosePopup from './OrderPadComponents/UPIClosePopup.svelte';
	import getEmandateData from '$lib/api/emandate';
	import { stringToFloat } from '$lib/utils/helpers/numbers';
	import { useFetch } from '$lib/utils/useFetch';
	import { PUBLIC_MF_CORE_BASE_URL, PUBLIC_PAYMENT_BASE_URL } from '$env/static/public';
	import { format } from 'date-fns';
	import { getPrimaryAccountMandateData } from '$lib/utils/helpers/emandate';
	import { base } from '$app/paths';
	import logger from '$lib/utils/logger';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { browser } from '$app/environment';
	import { profileStore } from '$lib/stores/ProfileStore';
	import type { IPreviousPaymentDetails } from '$lib/types/IPreviousPaymentDetails';
	import {
		changeBankButtonClickAnalytics,
		changeBankConfirmButtonClickAnalytics,
		paymentModeScreenPayButtonClickAnalytics
	} from './analytics/changePayment';
	import {
		upiInitiateScreenAnalytics,
		paymentPendingScreenAnalytics,
		paymentPendingScreenCloseButtonAnalytics,
		paymentFailedScreenAnalytics,
		paymentFailedScreenCloseButtonAnalytics
	} from './analytics/paymentFlow';
	import {
		startSipButtonClickAnalytics,
		payNowLumpsumButtonClickAnalytics,
		changePaymentMethodButtonClickAnalytics,
		changePaymentMethodScreenImpressionAnalytics
	} from './analytics/orderpad';
	import { debounce } from '$lib/utils/helpers/debounce';

	export let schemeData: SchemeDetails;
	export let previousPaymentDetails: IPreviousPaymentDetails;
	export let fromInvestmentDetailsPage: boolean;
	export let params: decodedParamsTypes = {};
	export let investmentNotAllowedText = '';

	const {
		investmentType,
		investmentAmount,
		sipDate,
		ftp,
		skipOrderPad,
		redirectedFrom,
		orderId: previousOrderId,
		pgTxnId,
		requestId,
		sipId,
		sipRegistrationNumber,
		sipDueDate,
		source
	} = params || {};

	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;

	const sipPrefillAmount = 100;
	const lumpsumPrefillAmount = 100;
	const maximumAmountLimit = 999999999;
	const upiPaymentAmountLimit = 100000;
	const minimumNetBankingAmountLimit = 50;

	let activeTab =
		(schemeData?.isSipAllowed === 'Y' && schemeData?.sipMaxAmount > 0 && 'SIP') ||
		(schemeData?.isLumpsumAllowed === 'Y' && schemeData?.lumpsumMaxAmount > 0 && 'ONETIME') ||
		'SIP';
	let amount = '';
	let showCalendar = false;
	let sipAllowedDaysArray = schemeData?.sipAllowedDays?.length
		? schemeData?.sipAllowedDays?.trim()?.split(',') || []
		: [];
	let dateSuperscript = 'th';
	let calendarDate = new Date(schemeData?.sipDate)?.getDate();
	let calendarMonth = new Date(schemeData?.sipDate)?.toLocaleString('default', { month: 'short' });
	let calendarYear = new Date(schemeData?.sipDate)?.getFullYear();
	let tempCalendarDate = calendarDate;
	let tempCalendarMonth = calendarMonth;
	let tempCalendarYear = calendarYear;
	let errorMessage = '';
	let firstSipPayment = true;
	let showTncModal = false;

	// payment
	let xRequestId = '';
	let showChangePayment = false;
	let paymentHandler = {
		selectedAccount: 0,
		paymentMode: '',
		upiId: ''
	};
	let inputPaymentError = '';
	let bankPopupVisible = false;
	let interval = null;
	let validateUPILoading = false;
	let pendingCaseOrderID: number;
	let pendingCaseSipID: number;
	let firstTimeUser = false;
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

	$: amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	$: showTabNotSupported = false;
	$: tabNotSupportedType = '';
	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: profileData = $page?.data?.profile;

	let dateArray: Array<dateArrayTypes> = [{ value: 1, disabled: false }];

	$: {
		dateArray.pop();

		for (let i = 1; i <= 28; i++) {
			dateArray.push({
				value: i,
				disabled: (sipAllowedDaysArray || []).findIndex((d: string) => parseInt(d) === i) === -1
			});
		}
	}

	const isSelectedInvestmentTypeAllowed = () => {
		if (activeTab === 'SIP') {
			return schemeData?.isSipAllowed === 'Y' && schemeData?.sipMaxAmount > 0;
		} else if (activeTab === 'ONETIME') {
			return schemeData?.isLumpsumAllowed === 'Y' && schemeData?.lumpsumMaxAmount > 0;
		}

		return false;
	};

	const toggleFirstSipPayment = () => {
		if (!isSelectedInvestmentTypeAllowed()) {
			return;
		}

		firstSipPayment = !firstSipPayment;
		setNextSipDate();
	};

	const setErrorMessage = () => {
		if (!amount?.length || !Number(amount)) {
			errorMessage = 'Amount should be more than 0';
			return;
		}

		if (activeTab === 'SIP') {
			if (parseInt(amount) < schemeData?.minSipAmount) {
				errorMessage =
					'Min SIP Amount: ₹' +
					(addCommasToAmountString(schemeData?.minSipAmount?.toString()) ||
						schemeData?.minSipAmount);
			} else if (parseInt(amount) > schemeData?.sipMaxAmount) {
				errorMessage =
					'Max SIP Amount: ₹' +
					(addCommasToAmountString(schemeData?.sipMaxAmount?.toString()) ||
						schemeData?.sipMaxAmount);
			} else if (parseInt(parseInt(amount) % schemeData?.sipMultiplierAmount)) {
				errorMessage = `Please invest in multiples of ₹${schemeData?.sipMultiplierAmount}`;
			} else {
				errorMessage = '';
			}
		} else if (activeTab === 'ONETIME') {
			if (
				redirectedFrom !== 'INVESTMENT_DETAILS' &&
				!fromInvestmentDetailsPage &&
				parseInt(amount) < schemeData?.minLumpsumAmount
			) {
				errorMessage =
					'Min Investment Amount: ₹' +
					(addCommasToAmountString(schemeData?.minLumpsumAmount?.toString()) ||
						schemeData?.minLumpsumAmount);
			} else if (
				(redirectedFrom === 'INVESTMENT_DETAILS' || fromInvestmentDetailsPage) &&
				parseInt(amount) < schemeData?.additionalPurchaseAmount
			) {
				errorMessage =
					'Min Investment Amount: ₹' +
					(addCommasToAmountString(schemeData?.additionalPurchaseAmount?.toString()) ||
						schemeData?.additionalPurchaseAmount);
			} else if (
				schemeData?.lumpsumMaxAmount > 0 &&
				parseInt(amount) > schemeData?.lumpsumMaxAmount
			) {
				errorMessage =
					'Max Investment Amount: ₹' +
					(addCommasToAmountString(schemeData?.lumpsumMaxAmount?.toString()) ||
						schemeData?.lumpsumMaxAmount);
			} else if (parseInt(parseInt(amount) % schemeData?.lumpsumMultiplierAmount)) {
				errorMessage = `Please invest in multiples of ₹${schemeData?.lumpsumMultiplierAmount}`;
			} else {
				errorMessage = '';
			}
		}
	};

	const handleShowTabNotSupported = () => {
		if (activeTab === 'SIP') {
			showTabNotSupported = schemeData?.isSipAllowed !== 'Y';
			tabNotSupportedType = 'SIP';
		} else if (activeTab === 'ONETIME') {
			showTabNotSupported = schemeData?.isLumpsumAllowed !== 'Y';
			tabNotSupportedType = 'One time';
		}
	};

	const setDefaultSipDate = () => {
		let areAllDaysAllowed = true;
		for (let i = 1; i <= 28; i++) {
			if (parseInt(sipAllowedDaysArray[i - 1]) !== i) {
				areAllDaysAllowed = false;
			}
		}

		if (areAllDaysAllowed) {
			calendarDate = 4;
		} else if (sipAllowedDaysArray?.length) {
			calendarDate = parseInt(sipAllowedDaysArray[0]);
		} else {
			calendarDate = 1;
		}
		dateSuperscript = getDateSuperscript(calendarDate);
	};

	setDefaultSipDate();

	const setNextSipDate = () => {
		const now = new Date();
		const month = getSIPMonthBasedOnDate(calendarDate, now, firstSipPayment ? 30 : 10);
		calendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});
		calendarYear = getSIPYearBasedOnDate(calendarDate, now, firstSipPayment ? 30 : 10);
	};

	setNextSipDate();

	const handleAmountInputFocus = () => {
		const amountInputElement = document?.getElementById('amountInput');
		amountInputElement?.focus();
	};

	const resetAmountVal = () => {
		amountVal = '0';
		amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	};

	const onInputChange = (val: string | object) => {
		let inputValue = val;

		if (isMobile) {
			if (!val || typeof val === 'object') {
				resetAmountVal();
				return;
			}
		} else {
			if (val && typeof val === 'object') {
				inputValue = val?.target?.value;
				inputValue = formatAmount(inputValue); // trim, remove alphabets and remove leading zeroes

				if (inputValue === amount) {
					resetAmountVal();
					return;
				}
			}
		}

		amount = formatAmount(inputValue); // trim, remove alphabets and remove leading zeroes

		setErrorMessage();
	};

	const removeAmountInputFocus = () => {
		const amountInputElement = document?.getElementById('amountInput');
		amountInputElement?.blur();
	};

	const handleAmountInputBlur = () => {
		if (isMobile && os === 'Android') {
			const debouncedRemoveAmountInputFocus = debounce(removeAmountInputFocus, 250);
			debouncedRemoveAmountInputFocus();
		}
	};

	$: onInputChange(amount); // for on-screen numpad amount input

	const changePaymentMethodScreenImpressionAnalyticsFunc = () => {
		const eventMetaData = {
			InvestmentType: activeTab,
			DefaultPaymentMethod: paymentHandler?.paymentMode,
			DefaultBank: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			ChangeBankAvailable: profileData?.bankDetails?.length > 1
		};
		changePaymentMethodScreenImpressionAnalytics(eventMetaData);
	};

	const showPaymentMethodScreen = () => {
		changePaymentMethodButtonClickAnalytics();
		showChangePayment = true;
		changePaymentMethodScreenImpressionAnalyticsFunc();
	};

	const prefillParamsData = () => {
		if (investmentType) {
			activeTab = investmentType === 'LUMPSUM' ? 'ONETIME' : 'SIP';
		}
		if (investmentAmount) {
			amount = investmentAmount?.toFixed(0);
			setErrorMessage();
		}
		if (typeof ftp === 'boolean') {
			firstSipPayment = ftp;
		}
		if (sipDate) {
			calendarDate = sipDate;
			dateSuperscript = getDateSuperscript(sipDate);
			setNextSipDate();
		}
		if (skipOrderPad && (ftp || activeTab === 'ONETIME')) {
			showPaymentMethodScreen();
		}
	};

	const prefillAmount = () => {
		if (activeTab === 'SIP') {
			if (schemeData?.minSipAmount > sipPrefillAmount) {
				amount = schemeData?.minSipAmount?.toFixed(0);
			} else {
				amount = sipPrefillAmount?.toFixed(0);
			}
		} else if (activeTab === 'ONETIME') {
			if (
				redirectedFrom !== 'INVESTMENT_DETAILS' &&
				!fromInvestmentDetailsPage &&
				schemeData?.minLumpsumAmount > lumpsumPrefillAmount
			) {
				amount = schemeData?.minLumpsumAmount?.toFixed(0);
			} else if (
				(redirectedFrom === 'INVESTMENT_DETAILS' || fromInvestmentDetailsPage) &&
				schemeData?.additionalPurchaseAmount > lumpsumPrefillAmount
			) {
				amount = schemeData?.additionalPurchaseAmount?.toFixed(0);
			} else {
				amount = lumpsumPrefillAmount?.toFixed(0);
			}
		}
	};

	prefillAmount();
	prefillParamsData();

	const switchTabs = (val: string) => {
		if (val !== activeTab) {
			amount = '';
			activeTab = val;

			prefillAmount();
			setErrorMessage();
			handleShowTabNotSupported();
			handleAmountInputFocus();
		}
	};

	const handleInvestClick = (inputId: string) => {
		// add logic
		onPaymentTypeSubmit(inputId);
	};

	const toggleTncModal = () => {
		showTncModal = !showTncModal;
	};

	const listenerFunc = (event) => {
		if (location.origin === event?.origin && event?.data?.source === 'paymentCallback') {
			logger.info({
				type: 'Payment Redirection Response',
				params: event?.data
			});
			closeNetBankingPaymentWindow();
		}
	};

	onMount(() => {
		handleShowTabNotSupported();

		if (isMobile) {
			handleAmountInputFocus();

			$headerStore.showMobileHeader = false;
		}
		window.addEventListener('message', listenerFunc);
	});

	onDestroy(() => {
		if (isMobile) {
			$headerStore.showMobileHeader = true;
		}
		resetTransactionInterval();
		if (browser) {
			window.removeEventListener('message', listenerFunc, false);
		}
	});

	const toggleCalendar = () => {
		if (!showCalendar && !isSelectedInvestmentTypeAllowed()) {
			return;
		}

		showCalendar = !showCalendar;

		tempCalendarDate = calendarDate;
		tempCalendarMonth = calendarMonth;
		tempCalendarYear = calendarYear;
		dateSuperscript = getDateSuperscript(tempCalendarDate);

		if (!showCalendar) {
			handleAmountInputFocus();
		}
	};

	const handleDateSelect = (value: unknown) => {
		tempCalendarDate = value?.detail;

		const now = new Date();
		const month = getSIPMonthBasedOnDate(tempCalendarDate, now, firstSipPayment ? 30 : 10);
		tempCalendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});

		tempCalendarYear = getSIPYearBasedOnDate(tempCalendarDate, now, firstSipPayment ? 30 : 10);
	};

	const handleDateChange = (value: unknown) => {
		calendarDate = value?.detail;
		dateSuperscript = getDateSuperscript(calendarDate);

		setNextSipDate();
		toggleCalendar();
	};

	//  ---------- payment flow code ---------------

	// --------- analytics functions -----------
	const paymentFailedScreenAnalyticsWithData = () => {
		paymentFailedScreenAnalytics({
			InvestmentType: activeTab === 'SIP' ? 'SIP' : 'OTI',
			Amount: amount,
			PaymentMethod: paymentHandler?.paymentMode,
			PaymentBank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName,
			PaymentPending:
				'If the money has been debited from your bank account, please do not worry, it will be refunded automatically'
		});
	};

	const submitButtonLumpsumClickAnalyticsFunc = () => {
		const eventMetadata = {
			Fundname: schemeData?.schemeName,
			Amount: amount,
			InvestmentType: activeTab,
			PaymentMethod: paymentHandler?.paymentMode,
			Bank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName
		};
		payNowLumpsumButtonClickAnalytics(eventMetadata);
	};

	const submitButtonSIPClickAnalyticsFunc = () => {
		const eventMetadata = {
			Fundname: schemeData?.schemeName,
			Amount: amount,
			InvestmentType: activeTab,
			PaymentMethod: paymentHandler?.paymentMode,
			Bank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName,
			SipDate: getFormattedSIPDate(),
			FirstSipPayment: firstSipPayment ? 'Y' : 'N'
		};
		startSipButtonClickAnalytics(eventMetadata);
	};

	// ------------ ***** ---------------

	//  ------- helpers functions -----------
	const assignNewRequestId = () => {
		xRequestId = uuidv4();
	};

	const onPaymentModeSelect = (paymentMode: string) => {
		PAYMENT_MODE[paymentMode].analytics();
		paymentHandler.paymentMode = paymentMode;
		firstTimeUser = false;
	};

	const resetInputPaymentError = () => {
		inputPaymentError = '';
	};

	const hidePaymentMethodScreen = () => {
		if (skipOrderPad) {
			history.back();
		} else {
			showChangePayment = false;
		}
	};

	const onAccountChange = (index: number) => {
		paymentHandler.selectedAccount = index;
		changeBankConfirmButtonClickAnalytics({
			ChangedBankAccount: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName
		});
	};

	const hideBankPopup = () => {
		bankPopupVisible = false;
	};

	const showBankPopup = () => {
		changeBankButtonClickAnalytics({
			InvestmentType: activeTab === 'SIP' ? 'SIP' : 'OTI',
			PaymentMethod: paymentHandler?.paymentMode,
			CurrentBank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName
		});
		bankPopupVisible = true;
	};

	const stopLoading = () => {
		loadingState.isLoading = false;
		loadingState.heading = '';
	};

	const displayError = ({ heading = 'Error', errorSubHeading = '' }) => {
		error.visible = true;
		error.heading = heading;
		error.subHeading = errorSubHeading;
	};

	const closeErrorPopup = () => {
		paymentFailedScreenCloseButtonAnalytics();
		error.heading = '';
		error.subHeading = '';
		error.visible = false;
	};

	const closePendingPopup = () => {
		paymentPendingScreenCloseButtonAnalytics();
		pending.heading = '';
		pending.subHeading = '';
		pending.visible = false;
		if (activeTab === 'ONETIME' || redirectedFrom === 'SIP_PAYMENTS') {
			navigateToLumpsumCompletePage();
		} else if (activeTab === 'SIP') {
			navigateToSipCompletePage();
		}
	};

	const displayPendingPopup = ({ heading = 'Payment Pending', errorSubHeading = '' }) => {
		paymentPendingScreenAnalytics({
			InvestmentType: activeTab === 'SIP' ? 'SIP' : 'OTI',
			Amount: amount,
			PaymentMethod: paymentHandler?.paymentMode,
			PaymentBank: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			PaymentPending:
				'we are confirming the status of your payment. This Usually takes few minutes. We will notify you once we have an update'
		});
		pending.visible = true;
		pending.heading = heading;
		pending.subHeading = errorSubHeading;
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

	const getSIPDate = () => {
		return getCompleteSIPDateBasedonDD(calendarDate, new Date(), firstSipPayment ? 30 : 10);
	};

	const getFormattedSIPDate = () => {
		return format(getSIPDate(), 'yyyy-MM-dd');
	};

	const closeNetBankingPaymentWindow = () => {
		if (netBankingState.paymentWindow) {
			netBankingState.paymentWindow.close();
			netBankingState.paymentWindow = null;
		}
	};

	const intializeNetBankingState = (closePaymentWindow = true) => {
		if (netBankingState.paymentWindowInterval) {
			clearInterval(netBankingState.paymentWindowInterval);
			netBankingState.paymentWindowInterval = null;
		}
		if (closePaymentWindow) {
			closeNetBankingPaymentWindow();
		}
	};

	const initializeUPIState = () => {
		upiState.flow = 0;
		upiState.timer = 0;
		if (upiState.timerInterval) {
			clearInterval(upiState.timerInterval);
			upiState.timerInterval = null;
		}
		if (upiState.paymentWindowInterval) {
			clearInterval(upiState.paymentWindowInterval);
			upiState.paymentWindowInterval = null;
		}
	};

	const initializeGPayState = () => {
		if (gpayPaymentState.paymentWindowInterval) {
			clearInterval(gpayPaymentState.paymentWindowInterval);
			gpayPaymentState.paymentWindowInterval = null;
		}
	};

	const resetTransactionInterval = () => {
		if (interval) {
			clearInterval(interval);
		}
		intializeNetBankingState();
		initializeUPIState();
		initializeGPayState();
	};

	const isNetBakingPaymentWindowClosed = () => {
		return (
			!netBankingState.paymentWindow ||
			(netBankingState.paymentWindow && netBankingState.paymentWindow.closed)
		);
	};

	const transactionRetryLogic = (
		transactionID: number,
		retryNumber = 0,
		retries = 100,
		retryDelay = 3
	) => {
		let transactionPending = false;
		let transactionResponse = {};
		return new Promise((resolve) => {
			interval = setInterval(async () => {
				if (!transactionPending) {
					transactionPending = true;
					transactionResponse = await fetchTransactionDataFunc(transactionID);
					if (
						transactionResponse.ok &&
						(transactionResponse.data?.data?.status === 'success' ||
							transactionResponse.data?.data?.status === 'failure')
					) {
						resetTransactionInterval();
						resolve(transactionResponse);
					}
					transactionPending = false;
				}
				retryNumber = retryNumber + 1;
				if (retryNumber >= retries) {
					resetTransactionInterval();
					resolve(transactionResponse);
				}
			}, retryDelay * 1000);
		});
	};

	const netBankingWindowCloseLogic = (delay = 1) => {
		return new Promise((resolve) => {
			netBankingState.paymentWindowInterval = setInterval(() => {
				if (isNetBakingPaymentWindowClosed()) {
					resetTransactionInterval();
					resolve(true);
				}
			}, delay * 1000);
		});
	};

	const upiWindowCloseLogic = (delay = 1) => {
		return new Promise((resolve) => {
			upiState.paymentWindowInterval = setInterval(() => {
				if (!upiState.flow) {
					resetTransactionInterval();
					resolve('WINDOW_CLOSED');
				}
			}, delay * 1000);
		});
	};

	const googlePayCloseLogic = (delay = 1) => {
		let counter = 0;
		return new Promise((resolve) => {
			gpayPaymentState.paymentWindowInterval = setInterval(() => {
				if (document.hasFocus()) {
					showLoading(
						`This window will close in the next ${
							gpayPaymentState.waitTime - counter
						} seconds. Please complete the transaction from your ${
							paymentHandler?.paymentMode
						}. Ignore if you have already completed the payment.`
					);
					counter++;
					if (counter >= gpayPaymentState.waitTime) {
						resetTransactionInterval();
						resolve('WINDOW_CLOSED');
					}
				} else {
					showLoading('Waiting for payment');
					counter = 0;
				}
			}, delay * 1000);
		});
	};

	const navigateToSipCompletePage = async (orderID?: number, sipID?: number) => {
		const params = encodeObject({
			amount: amount,
			isin: schemeData?.isin,
			date: calendarDate,
			firstTimePayment: firstSipPayment,
			orderID: orderID || pendingCaseOrderID,
			sipID: sipID || pendingCaseSipID
		});

		goto(`${base}/ordersummary?params=${params}`, {
			replaceState: true
		});
	};

	const navigateToLumpsumCompletePage = async (orderID?: number) => {
		const params = encodeObject({
			orderID: orderID || pendingCaseOrderID,
			firstTimePayment: true
		});

		goto(`${base}/ordersummary?params=${params}`, {
			replaceState: true
		});
	};

	const defaultValueToPaymentHandler = () => {
		paymentHandler.paymentMode = '';
		paymentHandler.upiId = '';
		paymentHandler.selectedAccount = 0;
		firstTimeUser = true;
	};

	const updatePaymentMode = (amount: string) => {
		if (
			(paymentHandler?.paymentMode === 'GOOGLEPAY' ||
				paymentHandler?.paymentMode === 'PHONEPE' ||
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

	const assignPreviousPaymentDetails = async () => {
		if (previousPaymentDetails?.ok) {
			const data = previousPaymentDetails?.data;
			const bankDetails = $page?.data?.profile?.bankDetails;
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
			if (
				(paymentMode === 'GOOGLEPAY' || paymentMode === 'PHONEPE') &&
				os !== 'Android' &&
				os !== 'iOS'
			) {
				paymentHandler.paymentMode = 'UPI';
			} else if (redirectedFrom === 'SIP_PAYMENTS' && (os === 'Android' || os === 'iOS')) {
				paymentHandler.paymentMode = 'GOOGLEPAY';
			} else if (redirectedFrom === 'SIP_PAYMENTS') {
				paymentHandler.paymentMode = 'UPI';
			} else {
				paymentHandler.paymentMode = paymentMode;
			}
		} else {
			defaultValueToPaymentHandler();
		}
	};
	assignPreviousPaymentDetails();

	$: updatePaymentMode(amount);
	// -------- **** ----------

	//  ------- api calls functions --------

	const orderDeletePatchFunc = async () => {
		try {
			if (previousOrderId) {
				const url = `${PUBLIC_MF_CORE_BASE_URL}/orders/${previousOrderId}`;
				await useFetch(url, {
					method: 'PATCH',
					body: JSON.stringify({
						paymentReferenceNumber: pgTxnId,
						paymentRemarks: 'Payment cancel',
						paymentStatus: 'cancel',
						pgTxnId,
						purchaseType: 'SIP'
					})
				});
			}
		} catch (e) {
			return;
		}
	};

	const sipOrderPatchFunc = async (transactionData, orderPostData) => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/${orderPostData?.data?.sipId}`;
			const response = await useFetch(url, {
				method: 'PATCH',
				body: JSON.stringify({
					paymentReferenceNumber: transactionData?.data?.reference_number,
					paymentRemarks: transactionData?.data?.response_description,
					paymentStatus: transactionData?.data?.status,
					pgTxnId: transactionData?.data?.transaction_id
				}),
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	const lumpsumOrderPatchFunc = async (transactionData, orderPostData) => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/orders/${orderPostData?.data?.orderId}`;
			const response = await useFetch(url, {
				method: 'PATCH',
				body: JSON.stringify({
					paymentReferenceNumber: transactionData?.data?.reference_number,
					paymentRemarks: transactionData?.data?.response_description,
					paymentStatus: transactionData?.data?.status,
					pgTxnId: transactionData?.data?.transaction_id,
					purchaseType: 'LUMPSUM'
				}),
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	const orderPatchFunc = async (transactionData, orderPostData) => {
		if (activeTab === 'ONETIME' || redirectedFrom === 'SIP_PAYMENTS') {
			return lumpsumOrderPatchFunc(transactionData, orderPostData);
		} else if (activeTab === 'SIP') {
			return sipOrderPatchFunc(transactionData, orderPostData);
		}
	};

	const fetchTransactionDataFunc = async (transactionID: number) => {
		try {
			const url = `${PUBLIC_PAYMENT_BASE_URL}/transaction?transaction_id=${transactionID}`;
			const response = await useFetch(url, {
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	const initiateNetBankingPaymentFunc = async () => {
		const url = `${PUBLIC_PAYMENT_BASE_URL}/net-banking-initiate-payment`;
		try {
			const response = await useFetch(url, {
				method: 'POST',
				body: JSON.stringify({
					amount: stringToFloat(amount),
					bank_account_number: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.accNO,
					bank_ifsc_code: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.ifscCode,
					bank_name: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName,
					client_name: profileData?.clientDetails?.fullName,
					product: 'mf',
					request_source: 'mf-web',
					redirect_url: `${window.location.origin}${base}/paymentCallback`
				}),
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	const lumpsumOrderPostFunction = async (transactionRefNumber = '') => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;
		try {
			const response = await useFetch(url, {
				method: 'POST',
				body: JSON.stringify({
					amount: stringToFloat(amount),
					bankAccountNo: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.accNO,
					bankName: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName,
					dpNumber: profileData?.dpNumber,
					emailId: profileData?.clientDetails?.email,
					mobileNo: profileData?.mobile,
					poaStatus: profileData?.poaStatus,
					schemeCode: schemeData?.schemeCode,
					subBrokerCode: profileData?.clientDetails?.subBroker,
					transactionType: redirectedFrom === 'SIP_PAYMENTS' ? 'SIP_INSTALLMENT' : 'PURCHASE',
					transactionRefNumber,
					sipId,
					sipDueDate,
					isAdditional: redirectedFrom === 'INVESTMENT_DETAILS' || fromInvestmentDetailsPage
				}),
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	const sipOrderPostFunction = async (transactionRefNumber = '', emandateId = '') => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/sips`;
		try {
			const response = await useFetch(url, {
				method: 'POST',
				body: JSON.stringify({
					emandateId,
					installmentAmount: stringToFloat(amount),
					dpNumber: profileData?.dpNumber,
					schemeCode: schemeData?.schemeCode,
					type: 'SIP',
					startDate: getFormattedSIPDate(),
					frequency: schemeData?.sipFrequency,
					noOfInstallment: schemeData?.sipMaxInstallmentNo,
					firstOrderToday: firstSipPayment,
					folioNumber: '',
					transactionRefNumber
				}),
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	const getEmandateDataFunc = () => {
		return getEmandateData(getSIPDate(), stringToFloat(amount));
	};

	const upiValidateFunc = async (id: string) => {
		try {
			validateUPILoading = true;
			const url = `${PUBLIC_PAYMENT_BASE_URL}/upi-validate-vpa`;
			const response = await useFetch(url, {
				method: 'POST',
				body: JSON.stringify({
					bank_name:
						profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName?.toLowerCase() ||
						'',
					product: 'mf',
					vpa: id
				}),
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			validateUPILoading = false;
			return response;
		} catch (e) {
			validateUPILoading = false;
			return {};
		}
	};

	const initiateUPIPayment = async () => {
		try {
			const url = `${PUBLIC_PAYMENT_BASE_URL}/upi-initiate-payment`;
			const response = await useFetch(url, {
				method: 'POST',
				body: JSON.stringify({
					amount: stringToFloat(amount),
					bank_account_number: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO,
					bank_ifsc_code: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.ifscCode,
					bank_name: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
					client_name: profileData.clientDetails.fullName,
					vpa: paymentHandler.upiId,
					product: 'mf',
					request_source: 'mf-web',
					request_type: 'COLLECT',
					mf_order_reference_number: sipRegistrationNumber,
					mf_order_type: redirectedFrom === 'SIP_PAYMENTS' ? 'sip' : undefined
				}),
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	const initiateWalletPayment = async (name: string) => {
		try {
			const url = `${PUBLIC_PAYMENT_BASE_URL}/upi-initiate-payment`;
			const response = await useFetch(url, {
				method: 'POST',
				body: JSON.stringify({
					amount: stringToFloat(amount),
					bank_account_number: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO,
					bank_ifsc_code: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.ifscCode,
					bank_name: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
					client_name: profileData.clientDetails.fullName,
					product: 'mf',
					request_source: 'mf-web',
					request_type: 'INTENT',
					app_name: name,
					mf_order_reference_number: sipRegistrationNumber,
					mf_order_type: redirectedFrom === 'SIP_PAYMENTS' ? 'sip' : undefined
				}),
				headers: {
					'X-Request-Id': xRequestId,
					'X-Source': source || 'diy'
				}
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	// --------------- **** ----------------

	// ------------ handlers -----------

	const handleTransactionResponse = (transactionResponse, orderPostResponse) => {
		if (transactionResponse.ok) {
			if (transactionResponse.data?.data?.status === 'failure') {
				paymentFailedScreenAnalyticsWithData();
				stopLoading();
				orderPatchFunc(transactionResponse.data, orderPostResponse.data);
				displayError({
					heading: 'Payment Failed',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						'If money has been debited from your bank account, please do not worry. It will be refunded automatically'
				});
				throw new Error('');
			} else if (transactionResponse.data?.data?.status === 'pending') {
				pendingCaseOrderID = orderPostResponse.data?.data?.orderId;
				pendingCaseSipID = orderPostResponse.data?.data?.sipId;
				stopLoading();
				displayPendingPopup({
					heading: 'Payment Pending',
					errorSubHeading:
						transactionResponse?.data?.data?.response_description ||
						"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
				});
				throw new Error('');
			}
		} else {
			pendingCaseOrderID = orderPostResponse.data?.data?.orderId;
			pendingCaseSipID = orderPostResponse.data?.data?.sipId;
			stopLoading();
			displayPendingPopup({
				heading: 'Payment Pending',
				errorSubHeading:
					transactionResponse?.data?.data?.response_description ||
					"We're confirming the status of your payment. This usually takes a few minutes. We will notify you once we have an update."
			});
			throw new Error('');
		}
	};

	const handleNetBankingPaymentWindowClosure = () => {
		intializeNetBankingState();
		stopLoading();
		displayError({
			heading: 'Payment Cancelled',
			errorSubHeading:
				'You have cancelled your payment for this order. Please try again, or use another payment method'
		});
		throw new Error('');
	};

	const handleUPIValidationResponse = (upiValidationResponse) => {
		if (upiValidationResponse.ok && !upiValidationResponse.data?.data?.valid) {
			inputPaymentError = 'Please enter valid UPI ID';
			throw new Error('');
		} else if (!upiValidationResponse.ok) {
			inputPaymentError =
				upiValidationResponse.data?.message || upiValidationResponse.data?.data?.message;
			showPaymentMethodScreen();
			throw new Error('');
		}
	};

	const handleEmandateResponse = (emandateResponse) => {
		if (!emandateResponse.ok) {
			stopLoading();
			resetTransactionInterval();
			displayError({
				heading: 'Error',
				errorSubHeading:
					'We are facing some issue at our end. Please try again or contact field support'
			});
			throw new Error('');
		}
	};

	const handleUPIResponse = (upiResponse) => {
		if (!upiResponse.ok) {
			stopLoading();
			displayError({
				heading: 'Error',
				errorSubHeading: upiResponse.data?.message
			});
			throw new Error('');
		}
	};

	const handleNetBankingResponse = (netBankingResponse) => {
		if (isNetBakingPaymentWindowClosed()) {
			handleNetBankingPaymentWindowClosure();
		} else if (!netBankingResponse.ok) {
			intializeNetBankingState();
			stopLoading();
			displayError({
				heading: 'Error',
				errorSubHeading: netBankingResponse.data?.message || netBankingResponse.data?.data?.message
			});
			throw new Error('');
		}
	};

	const handleOrderPostResponse = (orderPostResponse) => {
		if (orderPostResponse.ok) {
			orderDeletePatchFunc();
		} else {
			resetTransactionInterval();
			stopLoading();
			displayError({
				heading: 'Error',
				errorSubHeading: orderPostResponse?.data?.message
			});
			throw new Error('');
		}
	};

	const handleOrderPatchResponse = (orderPatchResponse) => {
		if (!orderPatchResponse.ok) {
			stopLoading();
			displayError({
				heading: 'Order Creation Error',
				errorSubHeading: orderPatchResponse?.data?.message
			});
			throw new Error('');
		}
	};

	// -------- **** ----------

	// --------- flow functions -----------
	const noPaymentFlow = async () => {
		try {
			showLoading('Getting Mandate Data');
			const emandateResponse = await getEmandateDataFunc();
			handleEmandateResponse(emandateResponse);
			showLoading('Creating your order');
			const orderPostResponse = await sipOrderPostFunction(
				'',
				getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || ''
			);
			handleOrderPostResponse(orderPostResponse);
			navigateToSipCompletePage(
				orderPostResponse.data?.data?.orderId,
				orderPostResponse.data?.data?.sipId
			);
		} catch (e) {
			stopLoading();
		}
	};

	const netBankingLumpsumFlow = async () => {
		try {
			netBankingState.paymentWindow = window.open(
				`${window.location.origin}${base}/intermediateLoading`,
				'PAYMENT_WINDOW'
			);
			showLoading('Redirecting to your Bank');
			const netBankingResponse = await initiateNetBankingPaymentFunc();
			handleNetBankingResponse(netBankingResponse);
			showLoading('Creating your order');
			const orderPostResponse = await lumpsumOrderPostFunction(
				netBankingResponse.data?.data?.transaction_id
			);
			handleOrderPostResponse(orderPostResponse);
			if (isNetBakingPaymentWindowClosed()) {
				handleNetBankingPaymentWindowClosure();
			}
			netBankingState.paymentWindow.location.replace(netBankingResponse.data?.data?.redirect_url);
			showLoading('Waiting for payment');
			await netBankingWindowCloseLogic();
			showLoading('Checking Payment status');
			const transactionResponse = await transactionRetryLogic(
				netBankingResponse.data?.data?.transaction_id,
				0,
				5,
				1
			);
			handleTransactionResponse(transactionResponse, orderPostResponse);
			showLoading('Waiting for order status');
			const orderPatchResponse = await lumpsumOrderPatchFunc(
				transactionResponse?.data,
				orderPostResponse.data
			);
			handleOrderPatchResponse(orderPatchResponse);
			navigateToLumpsumCompletePage(orderPostResponse.data?.data?.orderId);
		} catch (e) {
			stopLoading();
		}
	};

	const netBankingSIPFlow = async () => {
		try {
			netBankingState.paymentWindow = window.open(
				`${window.location.origin}${base}/intermediateLoading`,
				'PAYMENT_WINDOW'
			);
			showLoading('Getting Mandate Data');
			const emandateResponse = await getEmandateDataFunc();
			handleEmandateResponse(emandateResponse);
			showLoading('Redirecting to your Bank');
			const netBankingResponse = await initiateNetBankingPaymentFunc();
			handleNetBankingResponse(netBankingResponse);
			showLoading('Creating your order');
			const orderPostResponse = await sipOrderPostFunction(
				netBankingResponse.data?.data?.transaction_id,
				getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || ''
			);
			handleOrderPostResponse(orderPostResponse);
			if (isNetBakingPaymentWindowClosed()) {
				handleNetBankingPaymentWindowClosure();
			}
			netBankingState.paymentWindow.location.replace(netBankingResponse.data?.data?.redirect_url);
			showLoading('Waiting for payment');
			await netBankingWindowCloseLogic();
			showLoading('Checking Payment status');
			const transactionResponse = await transactionRetryLogic(
				netBankingResponse.data?.data?.transaction_id,
				0,
				5,
				1
			);
			handleTransactionResponse(transactionResponse, orderPostResponse);
			showLoading('Waiting for order status');
			const orderPatchResponse = await sipOrderPatchFunc(
				transactionResponse?.data,
				orderPostResponse.data
			);
			handleOrderPatchResponse(orderPatchResponse);
			navigateToSipCompletePage(
				orderPostResponse.data?.data?.orderId,
				orderPostResponse.data?.data?.sipId
			);
		} catch (e) {
			stopLoading();
		}
	};

	const upiLumpsumFlow = async (inputId: string) => {
		try {
			paymentHandler.upiId = inputId;
			const response = await upiValidateFunc(inputId);
			handleUPIValidationResponse(response);
			showLoading('Initiating UPI Payment');
			const upiResponse = await initiateUPIPayment();
			handleUPIResponse(upiResponse);
			showLoading('Creating your order');
			const orderPostResponse = await lumpsumOrderPostFunction(
				upiResponse.data?.data?.transaction_id
			);
			handleOrderPostResponse(orderPostResponse);
			stopLoading();
			upiState.flow = 2;
			upiState.timer = upiResponse.data?.data?.transaction_validity * 60;
			upiState.timerInterval = setInterval(() => {
				if (upiState.timer <= 0) {
					clearInterval(upiState.timerInterval);
				}
				upiState.timer = upiState.timer - 1;
			}, 1000);
			const promiseResponse = await Promise.any([
				transactionRetryLogic(
					upiResponse.data?.data?.transaction_id,
					0,
					Math.ceil(upiState.timer / 3),
					3
				),
				upiWindowCloseLogic()
			]);
			let transactionResponse = {};
			if (promiseResponse === 'WINDOW_CLOSED') {
				showLoading('Waiting for payment');
				transactionResponse = await transactionRetryLogic(
					upiResponse.data?.data?.transaction_id,
					0,
					5,
					1
				);
			} else {
				transactionResponse = promiseResponse;
			}
			handleTransactionResponse(transactionResponse, orderPostResponse);
			showLoading('Waiting for order status');
			const orderPatchResponse = await lumpsumOrderPatchFunc(
				transactionResponse?.data,
				orderPostResponse.data
			);
			handleOrderPatchResponse(orderPatchResponse);
			navigateToLumpsumCompletePage(orderPostResponse.data?.data?.orderId);
		} catch (e) {
			stopLoading();
		}
	};

	const upiSIPFlow = async (inputId: string) => {
		try {
			paymentHandler.upiId = inputId;
			const response = await upiValidateFunc(inputId);
			handleUPIValidationResponse(response);
			showLoading('Getting Mandate Data');
			const emandateResponse = await getEmandateDataFunc();
			handleEmandateResponse(emandateResponse);
			showLoading('Initiating UPI Payment');
			const upiResponse = await initiateUPIPayment();
			handleUPIResponse(upiResponse);
			showLoading('Creating your order');
			const orderPostResponse = await sipOrderPostFunction(
				upiResponse.data?.data?.transaction_id,
				getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || ''
			);
			handleOrderPostResponse(orderPostResponse);
			stopLoading();
			upiState.flow = 2;
			upiState.timer = upiResponse.data?.data?.transaction_validity * 60;
			upiState.timerInterval = setInterval(() => {
				if (upiState.timer <= 0) {
					clearInterval(upiState.timerInterval);
				}
				upiState.timer = upiState.timer - 1;
			}, 1000);
			const promiseResponse = await Promise.any([
				transactionRetryLogic(
					upiResponse.data?.data?.transaction_id,
					0,
					Math.ceil(upiState.timer / 3),
					3
				),
				upiWindowCloseLogic()
			]);
			let transactionResponse = {};
			if (promiseResponse === 'WINDOW_CLOSED') {
				showLoading('Waiting for payment');
				transactionResponse = await transactionRetryLogic(
					upiResponse.data?.data?.transaction_id,
					0,
					5,
					1
				);
			} else {
				transactionResponse = promiseResponse;
			}
			handleTransactionResponse(transactionResponse, orderPostResponse);
			showLoading('Waiting for order status');
			const orderPatchResponse = await sipOrderPatchFunc(
				transactionResponse?.data,
				orderPostResponse.data
			);
			handleOrderPatchResponse(orderPatchResponse);
			navigateToSipCompletePage(
				orderPostResponse.data?.data?.orderId,
				orderPostResponse.data?.data?.sipId
			);
		} catch (e) {
			stopLoading();
		}
	};

	const walletLumpsumFlow = async () => {
		try {
			showLoading(`Redirecting to ${PAYMENT_MODE[paymentHandler.paymentMode].name}`);
			const walletResponse = await initiateWalletPayment(
				PAYMENT_MODE[paymentHandler.paymentMode].apiName
			);
			handleUPIResponse(walletResponse);
			showLoading('Creating your order');
			const orderPostResponse = await lumpsumOrderPostFunction(
				walletResponse.data?.data?.transaction_id
			);
			handleOrderPostResponse(orderPostResponse);
			const redirectUrl = walletResponse.data?.data?.ios_deeplink_url;
			showLoading('Waiting for payment');
			window.open(redirectUrl, '_self');
			const promiseResponse = await Promise.any([
				transactionRetryLogic(
					walletResponse.data?.data?.transaction_id,
					0,
					Math.ceil((walletResponse.data?.data?.transaction_validity * 60) / 3),
					3
				),
				googlePayCloseLogic()
			]);
			let transactionResponse = {};
			if (promiseResponse === 'WINDOW_CLOSED') {
				showLoading('Waiting for payment');
				transactionResponse = await transactionRetryLogic(
					walletResponse.data?.data?.transaction_id,
					0,
					5,
					1
				);
			} else {
				transactionResponse = promiseResponse;
			}
			handleTransactionResponse(transactionResponse, orderPostResponse);
			showLoading('Waiting for order status');
			const orderPatchResponse = await lumpsumOrderPatchFunc(
				transactionResponse?.data,
				orderPostResponse.data
			);
			handleOrderPatchResponse(orderPatchResponse);
			navigateToLumpsumCompletePage(orderPostResponse.data?.data?.orderId);
		} catch (e) {
			stopLoading();
		}
	};

	const walletSIPFlow = async () => {
		try {
			showLoading('Getting Mandate Data');
			const emandateResponse = await getEmandateDataFunc();
			handleEmandateResponse(emandateResponse);
			showLoading(`Redirecting to ${PAYMENT_MODE[paymentHandler.paymentMode].name}`);
			const walletResponse = await initiateWalletPayment(
				PAYMENT_MODE[paymentHandler.paymentMode].apiName
			);
			handleUPIResponse(walletResponse);
			showLoading('Creating your order');
			const orderPostResponse = await sipOrderPostFunction(
				walletResponse.data?.data?.transaction_id,
				getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || ''
			);
			handleOrderPostResponse(orderPostResponse);
			const redirectUrl = walletResponse.data?.data?.ios_deeplink_url;
			showLoading('Waiting for payment');
			window.open(redirectUrl, '_self');
			const promiseResponse = await Promise.any([
				transactionRetryLogic(
					walletResponse.data?.data?.transaction_id,
					0,
					Math.ceil((walletResponse.data?.data?.transaction_validity * 60) / 3),
					3
				),
				googlePayCloseLogic()
			]);
			let transactionResponse = {};
			if (promiseResponse === 'WINDOW_CLOSED') {
				showLoading('Waiting for payment');
				transactionResponse = await transactionRetryLogic(
					walletResponse.data?.data?.transaction_id,
					0,
					5,
					1
				);
			} else {
				transactionResponse = promiseResponse;
			}
			handleTransactionResponse(transactionResponse, orderPostResponse);
			showLoading('Waiting for order status');
			const orderPatchResponse = await sipOrderPatchFunc(
				transactionResponse?.data,
				orderPostResponse.data
			);
			handleOrderPatchResponse(orderPatchResponse);
			navigateToSipCompletePage(
				orderPostResponse.data?.data?.orderId,
				orderPostResponse.data?.data?.sipId
			);
		} catch (e) {
			stopLoading();
		}
	};
	// -------- **** ----------

	const onPaymentTypeSubmit = async (inputId: string) => {
		if ($page?.data?.isGuest) {
			await goto(`${base}/login?redirect=${$page.url.href}`, {
				replaceState: true
			});
			return;
		}

		const NO_SIP_PAYMENT = !firstSipPayment && activeTab === 'SIP';
		// analytics when payment method screen is open
		if (showChangePayment) {
			paymentModeScreenPayButtonClickAnalytics({
				Fundname: schemeData?.schemeName,
				ISIN: schemeData?.isin,
				Amount: amount,
				SIPDate: activeTab === 'SIP' ? getFormattedSIPDate() : '',
				firstSIPpayment: activeTab === 'SIP' ? firstSipPayment : '',
				InvestmentType: activeTab === 'SIP' ? 'SIP' : 'OTI',
				PaymentMethod: paymentHandler?.paymentMode,
				Bank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName
			});
		}

		// when first time user and first time payment true then navigate to payment method screen
		if (firstTimeUser && !NO_SIP_PAYMENT) {
			showPaymentMethodScreen();
			return;
		}

		// generating request id
		if (requestId) {
			xRequestId = requestId;
		} else {
			assignNewRequestId();
		}

		if (NO_SIP_PAYMENT) {
			submitButtonSIPClickAnalyticsFunc();
			noPaymentFlow();
		} else if (
			paymentHandler?.paymentMode === 'NET_BANKING' &&
			activeTab === 'SIP' &&
			redirectedFrom !== 'SIP_PAYMENTS'
		) {
			submitButtonSIPClickAnalyticsFunc();
			netBankingSIPFlow();
		} else if (paymentHandler?.paymentMode === 'NET_BANKING') {
			submitButtonLumpsumClickAnalyticsFunc();
			netBankingLumpsumFlow();
		} else if (
			paymentHandler?.paymentMode === 'UPI' &&
			activeTab === 'SIP' &&
			redirectedFrom !== 'SIP_PAYMENTS'
		) {
			submitButtonSIPClickAnalyticsFunc();
			upiInitiateScreenAnalytics();
			upiSIPFlow(inputId);
		} else if (paymentHandler?.paymentMode === 'UPI') {
			submitButtonLumpsumClickAnalyticsFunc();
			upiInitiateScreenAnalytics();
			upiLumpsumFlow(inputId);
		} else if (activeTab === 'SIP' && redirectedFrom !== 'SIP_PAYMENTS') {
			submitButtonSIPClickAnalyticsFunc();
			walletSIPFlow();
		} else {
			submitButtonLumpsumClickAnalyticsFunc();
			walletLumpsumFlow();
		}
	};

	// -------- **** ----------
</script>

{#if !showChangePayment}
	<section
		class="h-fit w-full rounded-lg shadow-csm {$$props?.class} {!investmentNotAllowedText?.length
			? 'bg-grey'
			: 'bg-white'}"
	>
		<slot name="header">
			<section class="hidden rounded-t-lg bg-white px-3 py-5 font-medium text-black-title md:block">
				Your Investment Pad
			</section>
		</slot>
		{#if isMobile && !$headerStore?.showMobileHeader}
			<slot name="customMobileHeader">
				<MobileHeader
					title={schemeData?.schemeName}
					showSearchIcon={false}
					showBackIcon={true}
					showCloseIcon={false}
					class="-mx-2 -mt-2 mb-2 bg-white"
				/>
			</slot>
		{/if}
		{#if !investmentNotAllowedText?.length}
			<article class="mb-4 rounded-lg bg-white text-black-title md:mx-3 md:mt-2">
				<!-- Tab Section (SIP | ONE TIME) -->
				<section class="bg-whites flex rounded-lg rounded-b-none text-black-title">
					<button
						class={`h-12 w-40 flex-1 cursor-default rounded-t md:cursor-pointer ${
							activeTab === 'SIP'
								? 'border-t-4 border-t-green-buy'
								: 'rounded-tr-none border-t border-l bg-grey'
						}`}
						on:click={() => switchTabs('SIP')}
					>
						SIP
					</button>
					<button
						class={`h-12 w-40 flex-1 cursor-default rounded-t md:cursor-pointer ${
							activeTab === 'ONETIME'
								? 'border-t-4 border-t-green-buy'
								: 'rounded-tl-none border-t border-r bg-grey'
						}`}
						on:click={() => switchTabs('ONETIME')}
					>
						ONE TIME
					</button>
				</section>

				<article class="flex">
					<!-- Amount input -->
					<article
						class={`flex flex-col items-start p-2 ${
							activeTab === 'SIP' ? 'w-7/12' : 'w-full pb-3'
						}`}
					>
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label class="mb-2 text-xs font-normal text-black-title">Amount</label>
						<button
							class="flex w-full cursor-text items-center justify-start rounded border border-gray-200 px-3 py-2"
							on:click={handleAmountInputFocus}
						>
							<input
								id="amountInput"
								inputmode="none"
								maxlength="13"
								placeholder="₹"
								value={amountVal}
								class="w-full bg-white text-base font-medium leading-none text-black-title outline-none"
								on:input={onInputChange}
								on:focus={handleAmountInputBlur}
							/>
						</button>
					</article>

					<!-- Date (Calendar) input -->
					{#if activeTab === 'SIP'}
						<article class="flex w-5/12 flex-col items-start p-2">
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="mb-2 text-xs font-normal text-black-title">Monthly SIP Date</label>
							<!-- TODO: add calendar date selection functionality -->
							<section
								class="flex items-center justify-between rounded border border-gray-200 md:cursor-pointer {isSelectedInvestmentTypeAllowed()
									? 'md:cursor-pointer'
									: 'md:cursor-not-allowed'}"
								on:click={toggleCalendar}
								on:keypress={() => {
									// add logic
								}}
							>
								<input
									id="dateSelector"
									inputmode="numeric"
									value={`${calendarDate}${dateSuperscript}`}
									readonly
									class="w-3/4 rounded bg-white px-3 py-2 text-base font-medium leading-none text-black-title outline-none {isSelectedInvestmentTypeAllowed()
										? 'md:cursor-pointer'
										: 'md:cursor-not-allowed'}"
								/>
								<section class="border-l p-2.5">
									<CalendarSmallIcon />
								</section>
							</section>
						</article>
					{/if}
				</article>

				{#if errorMessage?.length && isSelectedInvestmentTypeAllowed()}
					<article class="flex justify-center pb-1">
						<p class="text-xs font-light text-red-sell">
							{errorMessage}
						</p>
					</article>
				{/if}

				<!-- Checkbox for SIP payment now -->
				{#if activeTab === 'SIP'}
					<article
						class={`flex w-fit items-center justify-start pl-1 pt-2 pb-3 text-xs font-medium text-grey-body ${
							isSelectedInvestmentTypeAllowed() ? 'md:cursor-pointer' : 'md:cursor-not-allowed'
						}`}
						on:click={toggleFirstSipPayment}
						on:keypress={() => {
							// add logic
						}}
					>
						{#if firstSipPayment}
							<div class="ml-1 mr-2">
								<CheckboxCheckedIcon />
							</div>
						{:else}
							<div class="mr-1">
								<CheckboxUncheckedIcon />
							</div>
						{/if}
						<span class="text-black-neutral md:text-black-title"> Make first SIP payment now </span>
					</article>
				{/if}

				{#if showTabNotSupported}
					<div class="pb-1">
						<TabNotSupported {tabNotSupportedType} />
					</div>
				{/if}
			</article>

			<!-- Footer section for Mobile layout (PaymentMode/StartSipDate + TnC + Submit + Numpad) -->
			<article class="mx-3 md:mx-0">
				<section class="fixed inset-0 top-auto md:relative md:inset-auto">
					{#if activeTab === 'SIP' && !firstSipPayment}
						<NextSipDate {calendarDate} {calendarMonth} {calendarYear} />
					{/if}
					{#if (activeTab === 'ONETIME' || firstSipPayment) && !firstTimeUser && isSelectedInvestmentTypeAllowed()}
						<PaymentSleeve
							selectedMode={paymentHandler?.paymentMode}
							onPaymentMethodChange={showPaymentMethodScreen}
							bankName={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName}
							bankAccount={profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO}
							upiId={paymentHandler.upiId}
						/>
					{/if}
					<article class="rounded-b-lg bg-white px-4 pt-3 md:px-3">
						<!-- TnC Section -->
						<article class="flex items-center justify-center">
							<p class="text-center text-xs font-normal text-black-title">
								By proceeding, you accept Angel One's
								<button class="text-blue-primary md:cursor-pointer" on:click={toggleTncModal}>
									Terms and Conditions
								</button>
							</p>
						</article>

						<!-- Submit Button -->
						<Button
							class={`bottom-0 my-3 h-12 w-full rounded ${
								!amount?.length ||
								!!errorMessage?.length ||
								showTabNotSupported ||
								investmentNotAllowedText?.length
									? 'cursor-default !bg-grey-line !text-grey-disabled active:opacity-100'
									: 'bg-blue-primary'
							}`}
							disabled={!amount?.length ||
								!!errorMessage?.length ||
								showTabNotSupported ||
								!!investmentNotAllowedText?.length ||
								validateUPILoading ||
								loadingState.isLoading}
							onClick={() => handleInvestClick(paymentHandler.upiId)}
						>
							{activeTab === 'SIP' ? 'START SIP' : 'PAY NOW'}
						</Button>
					</article>

					<!-- On-screen numpad keyboard for Mobile layout -->
					<NumPad
						class="block md:hidden"
						maxNumberLimit={maximumAmountLimit}
						bind:number={amount}
						on:numpadKeyCick={handleAmountInputFocus}
					/>
				</section>
			</article>
		{:else}
			<NotAllowed titleText={investmentNotAllowedText} />
		{/if}
		{#if showCalendar}
			<Modal isModalOpen={showCalendar} on:backdropclicked={toggleCalendar}>
				<CalendarComponent
					visible={showCalendar}
					title={'Select SIP Instalment Date'}
					heading={'CONFIRM'}
					showClose={true}
					showSubmit={true}
					{dateArray}
					defaultValue={calendarDate}
					on:submit={handleDateChange}
					on:dateSelect={handleDateSelect}
					on:close={toggleCalendar}
					class="z-60 sm:w-120"
				>
					<svelte:fragment slot="dateSlot">
						<NextSipDate
							calendarDate={tempCalendarDate}
							calendarMonth={tempCalendarMonth}
							calendarYear={tempCalendarYear}
						/>
					</svelte:fragment>

					<svelte:fragment slot="footer">
						<section
							class="hidden flex-row justify-center rounded-b-lg bg-gray-50 py-4 px-8 md:flex"
						>
							<p class="text-center text-sm font-light text-grey-body">
								It is the day on which the amount payable towards your SIP order becomes due. The
								day on which SIP instalments are paid is called SIP day.
							</p>
						</section>
					</svelte:fragment>
				</CalendarComponent>
			</Modal>
		{/if}

		{#if showTncModal}
			<!-- T&C Modal -->
			<TncModal showModal={showTncModal} on:closeModal={toggleTncModal} />
		{/if}
	</section>
{:else if showChangePayment}
	<ChangePaymentContainer
		isSIP={activeTab === 'SIP'}
		{dateSuperscript}
		{calendarDate}
		{amount}
		schemeName={schemeData?.schemeName}
		onBackClick={hidePaymentMethodScreen}
		paymentModes={Object.keys(PAYMENT_MODE)}
		selectedMode={paymentHandler?.paymentMode}
		onSelect={onPaymentModeSelect}
		onSubmit={handleInvestClick}
		bankAccounts={profileData?.bankDetails}
		selectedAccount={paymentHandler?.selectedAccount}
		inputError={inputPaymentError}
		resetInputError={resetInputPaymentError}
		{redirectedFrom}
		defaultInputVal={paymentHandler?.upiId || ''}
		onChangeBank={showBankPopup}
		class={$$props.class}
		isLoading={loadingState.isLoading || validateUPILoading}
	>
		<svelte:fragment slot="header">
			<slot name="header">
				<section
					class="hidden rounded-t-lg bg-white px-3 py-5 font-medium text-black-title md:block"
				>
					Your Investment Pad
				</section>
			</slot>
		</svelte:fragment>
	</ChangePaymentContainer>
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
	<UpiTransactionPopup {amount} timer={upiState.timer} onClose={onUPITransactionPopupClose} />
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
		closeModal={closeErrorPopup}
		buttonTitle="TRY AGAIN"
		buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
		buttonVariant="contained"
	/>
{/if}
