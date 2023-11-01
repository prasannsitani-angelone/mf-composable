<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { headerStore } from '$lib/stores/HeaderStore';
	import { userStore } from '$lib/stores/UserStore';
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import Button from '$components/Button.svelte';
	import NumPad from '$components/Keyboard/NumPad.svelte';
	import CalendarSmallIcon from '$lib/images/icons/CalendarSmallIcon.svelte';
	import CheckboxCheckedIcon from '$lib/images/icons/CheckboxCheckedIcon.svelte';
	import CheckboxUncheckedIcon from '$lib/images/icons/CheckboxUncheckedIcon.svelte';
	import {
		addCommasToAmountString,
		formatAmount,
		roundUpAmountToNearestThousand
	} from '$lib/utils/helpers/formatAmount';
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
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import { format } from 'date-fns';
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
		paymentFailedScreenAnalytics,
		paymentFailedRetrySameMethodCtaClickAnalytics,
		upiInitiateScreenAnalytics,
		paymentFailedUseDifferentMethodCtaClickAnalytics,
		wrongBankPaymentFailedCautionModalImpressionAnalytics,
		wrongBankPaymentFailedCautionModalCtaClickAnalytics,
		onIntegeratedFlowPopupImpressionAnalytics,
		onIntegeratedFlowPopupClickAnalytics,
		onIntegeratedFlowFailureClickAnalytics,
		onIntegeratedFlowFailureImpressionAnalytics
	} from './analytics/paymentFlow';
	import {
		changePaymentMethodButtonClickAnalytics,
		changePaymentMethodScreenImpressionAnalytics,
		investmentPadScreenOpenAnalytics,
		investmentPadTabSwitchAnalytics,
		calendarIconClickAnalytics,
		lumspsumToSipSleeveAnalytics,
		lumspsumToSipSleeveContinueOtiCtaClickAnalytics,
		lumspsumToSipSleeveCreateSipCtaClickAnalytics,
		orderpadFundCardClickAnalytics,
		startSipButtonClickAnalytics,
		tncButtonClickAnalytics
	} from './analytics/orderpad';
	import { debounce } from '$lib/utils/helpers/debounce';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import LumpsumToSip from './OrderPadComponents/LumpsumToSip.svelte';
	import {
		noPaymentFlow,
		netBankingLumpsumFlow,
		netBankingSIPFlow,
		upiSIPFlow,
		upiLumpsumFlow,
		walletSIPFlow,
		walletLumpsumFlow,
		upiIntegeratedFlow,
		walletIntegeratedFlow
	} from '$components/Payment/flow';
	import {
		closeNetBankingPaymentWindow,
		initializeGPayState,
		initializeUPIState,
		intializeNetBankingState
	} from '$components/Payment/util';
	import UpiClosePopup from '$components/Payment/UPIClosePopup.svelte';
	import UpiTransactionPopup from '$components/Payment/UPITransactionPopup.svelte';
	import LoadingPopup from '$components/Payment/LoadingPopup.svelte';
	import PaymentSleeve from '$components/Payment/PaymentSleeve.svelte';
	import {
		PAYMENT_MODE,
		PAYMENT_MODE_STATUS,
		WRONG_BANK_ERROR_CODE
	} from '$components/Payment/constants';
	import { getDeeplinkForUrl } from '$lib/utils/helpers/deeplinks';
	import { stringToInteger } from '$lib/utils/helpers/numbers';
	import OrderpadReturns from './OrderPadComponents/OrderpadReturns.svelte';
	import {
		checkPreviousWrongBankFailedPayment,
		checkRequestIdExpired
	} from '$lib/api/investmentPad';
	import PeopleIcon from '$lib/images/PeopleIcon.svg';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import ChangePaymentContainer from '$components/Payment/ChangePaymentContainer.svelte';
	import { paymentAppStore } from '$lib/stores/IntentPaymentAppsStore';
	import type { PaymentMethodsStatusTypes } from '$lib/types/IPayments';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import { PUBLIC_MANDATE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { getEmandateDataFunc } from '$components/Payment/api';
	import { upiValidateFunc } from '$components/mandate/api';
	import { versionStore } from '$lib/stores/VersionStore';
	import { getPrimaryAccountMandateData } from '$lib/utils/helpers/emandate';
	import IntegeratedFlowPopup from './OrderPadComponents/IntegeratedFlowPopup.svelte';
	import SelectedBankDetails from '$components/Payment/SelectedBankDetails.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import KycProgressPopup from '$components/Payment/KYCProgressPopup.svelte';

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
		pgTxnId: previousPGTxnId,
		requestId,
		sipId,
		sipRegistrationNumber,
		sipDueDate,
		source,
		paymentMandatory,
		mandateId,
		folioNumber
	} = params || {};

	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;

	const sipPrefillAmount = 100;
	const lumpsumPrefillAmount = 100;
	const maximumAmountLimit = 999999999;
	const upiPaymentAmountLimit = 100000;
	const minimumNetBankingAmountLimit = 50;
	const lumpsumThreshold = 10_000;

	let isSipInvestmentAllowed = schemeData?.isSipAllowed === 'Y' && schemeData?.sipMaxAmount > 0;
	let isLumpsumInvestmentAllowed =
		schemeData?.isLumpsumAllowed === 'Y' && schemeData?.lumpsumMaxAmount > 0;
	let activeTab =
		(isSipInvestmentAllowed && 'SIP') || (isLumpsumInvestmentAllowed && 'ONETIME') || 'SIP';
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
	let isLumpsumToSipEligible = false;
	let lumpsumToSipAmount = '';
	let showLumpsumToSipModal = false;
	let showBeforePaymentAckModal = false;
	let beforePaymentAckDone = false;

	const nextSipDateBufferDaysWithFtp = 30;
	const nextSipDateBufferDaysWithoutFtp = 10;

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
	let validateUPILoading = false;
	let firstTimeUser = false;
	let version = '';
	let isKYCInProgress = false;
	let previousWrongBankFailedPayment = false;

	let integeratedFlow = {
		visible: false,
		integeratedFlowFunc: () => undefined,
		normalFlowFunc: () => undefined
	};
	const error = {
		visible: false,
		heading: '',
		subHeading: '',
		type: '',
		code: ''
	};
	const integeratedFlowError = {
		visible: false,
		heading: '',
		subHeading: '',
		occured: false
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

	const schemeDetailsUrl = `${$page.url.origin}${base}/schemes/${normalizeFundName(
		schemeData?.schemeName,
		schemeData?.isin,
		schemeData?.schemeCode
	)}`;

	$: amountVal = amount?.length ? `₹${addCommasToAmountString(amount)}` : '';
	$: showTabNotSupported = false;
	$: tabNotSupportedType = '';
	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;
	$: profileData = $page?.data?.profile;
	$: userData = $page?.data?.userDetails;

	$: showOrderPadHeader = isMobile || isTablet;
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

	// deeplink validity
	let oneLinkExpired = false;

	const isSelectedInvestmentTypeAllowed = () => {
		if (activeTab === 'SIP') {
			return isSipInvestmentAllowed;
		} else if (activeTab === 'ONETIME') {
			return isLumpsumInvestmentAllowed;
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
		const month = getSIPMonthBasedOnDate(
			calendarDate,
			now,
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);
		calendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});
		calendarYear = getSIPYearBasedOnDate(
			calendarDate,
			now,
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);
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

	const resetLumpsumToSipData = () => {
		isLumpsumToSipEligible = false;
		lumpsumToSipAmount = '';
		showLumpsumToSipModal = false;
	};

	const toggleShowLumpsumToSipModal = () => {
		showLumpsumToSipModal = !showLumpsumToSipModal;

		if (showLumpsumToSipModal) {
			lumspsumToSipSleeveAnalytics();
		}
	};

	const wrongBankPaymentFailedCautionModalImpressionAnalyticsFunc = () => {
		const eventMetaData = {
			message: 'Your Last payment failed as you selected a different bank account in your UPI'
		};
		wrongBankPaymentFailedCautionModalImpressionAnalytics(eventMetaData);
	};

	const wrongBankPaymentFailedCautionModalCtaClickAnalyticsFunc = () => {
		const eventMetaData = {
			Fundname: schemeData?.schemeName,
			ISIN: schemeData?.isin,
			Amount: amount,
			SIPData: calendarDate?.toString(),
			firstTimePayment: firstSipPayment,
			InvestmentType: activeTab === 'SIP' ? 'SIP' : 'OTI',
			PaymentMethod: paymentHandler?.paymentMode,
			Bank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName
		};
		wrongBankPaymentFailedCautionModalCtaClickAnalytics(eventMetaData);
	};

	const toggleShowBeforePaymentAckModal = () => {
		showBeforePaymentAckModal = !showBeforePaymentAckModal;

		if (showBeforePaymentAckModal) {
			wrongBankPaymentFailedCautionModalImpressionAnalyticsFunc();
		}
	};

	const setBeforePaymentAckDone = () => {
		beforePaymentAckDone = true;
		wrongBankPaymentFailedCautionModalCtaClickAnalyticsFunc();

		toggleShowBeforePaymentAckModal();
		handleInvestClick(paymentHandler?.upiId);
	};

	const redirectToSip = () => {
		activeTab = 'SIP';
		amount = lumpsumToSipAmount;

		if (showChangePayment) {
			showChangePayment = false;
		}

		toggleShowLumpsumToSipModal();
		resetLumpsumToSipData();
		lumspsumToSipSleeveCreateSipCtaClickAnalytics();
	};

	const lumpsumToSipAmountValidation = () => {
		if (Number(lumpsumToSipAmount) > schemeData?.sipMaxAmount) {
			lumpsumToSipAmount = schemeData?.sipMaxAmount?.toString();
		} else if (Number(lumpsumToSipAmount) < schemeData?.minSipAmount) {
			lumpsumToSipAmount = schemeData?.minSipAmount?.toString();
		}
	};

	const setLumpsumToSipAmountValue = () => {
		const perMonthAmount = Number(amount) / 10;
		lumpsumToSipAmount = roundUpAmountToNearestThousand(perMonthAmount)?.toString();

		lumpsumToSipAmountValidation();
	};

	const lumpsumToSipProcess = () => {
		if (Number(amount) >= lumpsumThreshold) {
			if (userStore?.userType() === 'B2C' && isSipInvestmentAllowed && isLumpsumInvestmentAllowed) {
				isLumpsumToSipEligible = true;
			} else {
				isLumpsumToSipEligible = false;
				return;
			}
			setLumpsumToSipAmountValue();
		} else {
			resetLumpsumToSipData();
		}
	};

	const onInputChange = (val: string | object) => {
		let inputValue = val;

		if (isMobile || isTablet) {
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

		if (activeTab === 'ONETIME') {
			lumpsumToSipProcess();
		}

		setErrorMessage();
	};

	const removeAmountInputFocus = () => {
		const amountInputElement = document?.getElementById('amountInput');
		amountInputElement?.blur();
	};

	const handleAmountInputBlur = () => {
		if ((isMobile || isTablet) && os === 'Android') {
			const debouncedRemoveAmountInputFocus = debounce(removeAmountInputFocus, 250);
			debouncedRemoveAmountInputFocus();
		}
	};

	$: onInputChange(amount); // for on-screen numpad amount input

	const changePaymentMethodScreenImpressionAnalyticsFunc = () => {
		const eligiblePaymentMethods: string[] = [];
		const allowedPaymentmethods = ['PHONEPE', 'GOOGLEPAY', 'PAYTM', 'UPI', 'NET_BANKING'];

		allowedPaymentmethods?.forEach((method) => {
			if (PAYMENT_MODE[method]?.enabled(Number(amount), os, redirectedFrom)) {
				eligiblePaymentMethods.push(method);
			}
		});

		const eventMetaData = {
			Fundname: schemeData?.schemeName,
			ISIN: schemeData?.isin,
			InvestmentType: activeTab,
			SipDate: activeTab === 'SIP' ? getFormattedSIPDate() : '',
			Amount: amount,
			DefaultPaymentMethod: paymentHandler?.paymentMode,
			DefaultBank: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			ChangeBankAvailable: profileData?.bankDetails?.length > 1,
			AllPaymentMethods: allowedPaymentmethods
		};
		changePaymentMethodScreenImpressionAnalytics(eventMetaData);
	};

	const isInvestTypeVisible = () => {
		return investmentType !== 'SIP' ? true : false;
	};

	const getSIPDate = () => {
		return getCompleteSIPDateBasedonDD(
			calendarDate,
			new Date(),
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);
	};

	const getFormattedSIPDate = () => {
		return format(getSIPDate(), 'yyyy-MM-dd');
	};

	const showPaymentMethodScreen = () => {
		changePaymentMethodButtonClickAnalytics({
			Fundname: schemeData?.schemeName,
			ISIN: schemeData?.isin,
			isinvesttypevisible: isInvestTypeVisible() ? 'Y' : 'N',
			ismakefirstpmtvisible: paymentMandatory ? 'N' : 'Y',
			numberofuservisible: schemeData?.noOfClientInvested ? 'Y' : 'N',
			InvestmentType: activeTab,
			FirstSipPayment: firstSipPayment ? 'Y' : 'N',
			CTA:
				activeTab === 'SIP'
					? !firstSipPayment
						? 'START SIP'
						: firstTimeUser
						? 'PROCEED'
						: 'PAY'
					: firstTimeUser
					? 'PROCEED'
					: 'PAY',
			Amount: amount,
			SipDate: activeTab === 'SIP' ? getFormattedSIPDate() : '',
			PaymentMethod: paymentHandler?.paymentMode,
			Bank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName,
			URL: getDeeplinkForUrl(schemeDetailsUrl)
		});
		showChangePayment = true;
		changePaymentMethodScreenImpressionAnalyticsFunc();
	};

	const prefillParamsData = async () => {
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
			resetLumpsumToSipData();
		}

		investmentPadTabSwitchAnalyticsFunc();
	};

	const handleLumpsumToSipOtiClick = () => {
		lumspsumToSipSleeveContinueOtiCtaClickAnalytics();

		handleInvestClick(paymentHandler?.upiId);
	};

	const handleInvestClick = (inputId: string) => {
		if (
			previousWrongBankFailedPayment &&
			!beforePaymentAckDone &&
			firstSipPayment &&
			paymentHandler?.paymentMode !== 'NET_BANKING'
		) {
			toggleShowBeforePaymentAckModal();
			return;
		}

		paymentHandler.upiId = inputId;

		if (activeTab === 'ONETIME' && isLumpsumToSipEligible && lumpsumToSipAmount?.length) {
			if (!showLumpsumToSipModal) {
				toggleShowLumpsumToSipModal();
				return;
			} else {
				toggleShowLumpsumToSipModal();
			}
		}

		// add logic
		onPaymentTypeSubmit(inputId);
	};

	const toggleTncModal = () => {
		showTncModal = !showTncModal;

		if (showTncModal) {
			tncButtonClickAnalytics();
		}
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

	const investmentPadScreenOpenAnalyticsFunc = () => {
		const eventMetaData = {
			ISIN: schemeData?.isin,
			Fundname: schemeData?.schemeName,
			FundType: schemeData?.reInvestmentPlan,
			AssetType: schemeData?.categoryName,
			SubAssetType: schemeData?.subcategoryName,
			isinvesttypevisible: isInvestTypeVisible() ? 'Y' : 'N',
			ismakefirstpmtvisible: paymentMandatory ? 'N' : 'Y',
			numberofuservisible: schemeData?.noOfClientInvested ? 'Y' : 'N',
			DefaultPayment: paymentHandler?.paymentMode,
			schemeURL: getDeeplinkForUrl(schemeDetailsUrl)
		};

		investmentPadScreenOpenAnalytics(eventMetaData);
	};

	const investmentPadTabSwitchAnalyticsFunc = () => {
		const eventMetaData = {
			InvestmentType: activeTab,
			ISIN: schemeData?.isin
		};

		investmentPadTabSwitchAnalytics(eventMetaData);
	};

	const getPreviousWrongBankFailedPayment = async () => {
		previousWrongBankFailedPayment = await checkPreviousWrongBankFailedPayment();
	};

	onMount(async () => {
		handleShowTabNotSupported();

		if (isMobile || isTablet) {
			handleAmountInputFocus();

			$headerStore.showMobileHeader = false;

			investmentPadScreenOpenAnalyticsFunc();
		}
		window.addEventListener('message', listenerFunc);

		await getPreviousWrongBankFailedPayment();

		await tick();
		checkIfOrderIsValidFromDeeplink();

		paymentAppStore.subscribe(() => {
			paymentHandler.paymentMode =
				paymentAppStore.checkIfPaymentAppInstalledElseGetFallback(paymentHandler.paymentMode) || '';
		});

		versionStore.subscribe((value) => {
			version = value.version;
		});
	});

	onDestroy(() => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = true;
		}
		resetState();
		if (browser) {
			window.removeEventListener('message', listenerFunc, false);
		}
	});

	async function checkIfOrderIsValidFromDeeplink() {
		const source = params.source;
		const requestId = params.requestId;
		oneLinkExpired = await checkRequestIdExpired(source, requestId);
	}

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
		} else {
			calendarIconClickAnalytics();
		}
	};

	const handleDateSelect = (value: unknown) => {
		tempCalendarDate = value?.detail;

		const now = new Date();
		const month = getSIPMonthBasedOnDate(
			tempCalendarDate,
			now,
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);
		tempCalendarMonth = new Date(now?.getFullYear(), month, 0)?.toLocaleString('default', {
			month: 'short'
		});

		tempCalendarYear = getSIPYearBasedOnDate(
			tempCalendarDate,
			now,
			firstSipPayment ? nextSipDateBufferDaysWithFtp : nextSipDateBufferDaysWithoutFtp
		);
	};

	const handleDateChange = (value: unknown) => {
		calendarDate = value?.detail;
		dateSuperscript = getDateSuperscript(calendarDate);

		setNextSipDate();
		toggleCalendar();
	};

	const goToFundDetailsPage = async () => {
		const eventMetaData = {
			ISIN: schemeData?.isin,
			isinvesttypevisible: isInvestTypeVisible() ? 'Y' : 'N',
			ismakefirstpmtvisible: paymentMandatory ? 'N' : 'Y',
			numberofuservisible: schemeData?.noOfClientInvested ? 'Y' : 'N',
			Fundname: schemeData?.schemeName
		};

		orderpadFundCardClickAnalytics(eventMetaData);

		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			schemeData?.schemeName,
			schemeData?.isin,
			schemeData?.schemeCode
		)}`;
		await goto(schemeDetailsPath);
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
				'If the money has been debited from your bank account, please do not worry, it will be refunded automatically',
			SchemeURL: getDeeplinkForUrl(schemeDetailsUrl),
			PGErrorCode: error?.code
		});
	};

	const submitButtonSIPClickAnalyticsFunc = () => {
		const eventMetadata = {
			ISIN: schemeData?.isin,
			Fundname: schemeData?.schemeName,
			Amount: amount,
			InvestmentType: activeTab,
			PaymentMethod: paymentHandler?.paymentMode,
			Bank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName,
			SipDate: getFormattedSIPDate(),
			FirstSipPayment: firstSipPayment ? 'Y' : 'N',
			URL: getDeeplinkForUrl($page.url),
			isinvesttypevisible: isInvestTypeVisible() ? 'Y' : 'N',
			ismakefirstpmtvisible: paymentMandatory ? 'N' : 'Y',
			numberofuservisible: schemeData?.noOfClientInvested ? 'Y' : 'N',
			CTA:
				activeTab === 'SIP'
					? !firstSipPayment
						? 'START SIP'
						: firstTimeUser
						? 'PROCEED'
						: `PAY`
					: firstTimeUser
					? 'PROCEED'
					: `PAY`
		};
		startSipButtonClickAnalytics(eventMetadata);
	};

	// ------------ ***** ---------------

	//  ------- helpers functions -----------
	const assignNewRequestId = () => {
		xRequestId = uuidv4();
	};

	const onPaymentModeSelect = (paymentMode: string) => {
		paymentHandler.paymentMode = paymentMode;
		firstTimeUser = false;

		const eventMetaData = {
			mode: paymentHandler?.paymentMode
		};

		PAYMENT_MODE[paymentMode].analytics(eventMetaData);
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

	const showUPILoading = () => {
		validateUPILoading = true;
	};

	const stopUPILoading = () => {
		validateUPILoading = false;
	};

	const toggleKYCProgressPopup = () => {
		isKYCInProgress = !isKYCInProgress;
	};

	const displayError = ({ heading = 'Error', errorSubHeading = '', type = '', code = '' }) => {
		error.visible = true;
		error.heading = heading;
		error.subHeading = errorSubHeading;
		error.type = type;
		error.code = code;

		if (error?.code === WRONG_BANK_ERROR_CODE) {
			error.heading = 'Incorrect Bank Account Selected on UPI App';
		}

		if (error.type === 'PAYMENT_FAILED') {
			paymentFailedScreenAnalyticsWithData();
		}
	};

	const displayIntegeratedFlowError = ({ heading = 'Error', errorSubHeading = '' }) => {
		integeratedFlowError.visible = true;
		integeratedFlowError.heading = heading;
		integeratedFlowError.subHeading = errorSubHeading;
		integeratedFlowError.occured = true;
		onIntegeratedFlowFailureImpressionAnalytics();
	};

	const closeErrorPopup = (fetchPreviousWrongBankFailedPayment = false) => {
		if (fetchPreviousWrongBankFailedPayment) {
			getPreviousWrongBankFailedPayment();
		}

		error.heading = '';
		error.subHeading = '';
		error.visible = false;
		error.type = '';
		error.code = '';
	};

	const closeIntegeratedFlowErrorPopup = () => {
		integeratedFlowError.heading = '';
		integeratedFlowError.subHeading = '';
		integeratedFlowError.visible = false;
		onIntegeratedFlowFailureClickAnalytics();
	};

	const paymentFailedRetrySameMethodCtaClickAnalyticsFunc = () => {
		const eventMetaData = {
			Fundname: schemeData?.schemeName,
			ISIN: schemeData?.isin,
			Amount: amount,
			SIPData: calendarDate?.toString(),
			firstTimePayment: firstSipPayment,
			InvestmentType: activeTab === 'SIP' ? 'SIP' : 'OTI',
			PaymentMethod: paymentHandler?.paymentMode,
			Bank: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.bankName
		};

		paymentFailedRetrySameMethodCtaClickAnalytics(eventMetaData);
	};

	const retryWithSamePaymentMethod = () => {
		closeErrorPopup();

		paymentFailedRetrySameMethodCtaClickAnalyticsFunc();

		handleInvestClick(paymentHandler?.upiId);
	};

	const handleChangePaymentMethodRetryClick = () => {
		paymentFailedUseDifferentMethodCtaClickAnalytics();

		closeErrorPopup(true);
		showChangePayment = true;
	};

	const displayPendingPopup = ({ orderId, sipId, isIntegeratedFlow = false }) => {
		if (activeTab === 'ONETIME' || redirectedFrom === 'SIP_PAYMENTS') {
			navigateToLumpsumCompletePage({
				orderId
			});
		} else if (activeTab === 'SIP') {
			navigateToSipCompletePage({
				orderId,
				sipId,
				isIntegeratedFlow
			});
		}
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

	const navigateToSipCompletePage = async ({ orderId, sipId, isIntegeratedFlow = false }) => {
		const params = encodeObject({
			amount: amount,
			isin: schemeData?.isin,
			date: calendarDate,
			firstTimePayment: firstSipPayment,
			orderID: orderId,
			sipID: sipId,
			isIntegeratedFlow
		});

		goto(`${base}/ordersummary?params=${params}`, {
			replaceState: true
		});
	};

	const navigateToLumpsumCompletePage = async ({ orderId }) => {
		const params = encodeObject({
			orderID: orderId,
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
				paymentHandler?.paymentMode === 'PAYTM' ||
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
				(paymentMode === 'GOOGLEPAY' || paymentMode === 'PHONEPE' || paymentMode === 'PAYTM') &&
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

			const paymentModesStatus: PaymentMethodsStatusTypes =
				$page?.data?.userPaymentMethodsStatus?.payment_modes[
					`${bankDetails[paymentHandler?.selectedAccount]?.ifscCode}`
				] || {};

			if (paymentHandler?.paymentMode === 'NET_BANKING') {
				if (paymentModesStatus?.net_banking?.status === PAYMENT_MODE_STATUS?.disabled) {
					defaultValueToPaymentHandler();
				}
			} else {
				if (paymentModesStatus?.upi?.status === PAYMENT_MODE_STATUS?.disabled) {
					defaultValueToPaymentHandler();
				}
			}
		} else {
			defaultValueToPaymentHandler();
		}
	};
	assignPreviousPaymentDetails();

	$: updatePaymentMode(amount);
	// -------- **** ----------

	const upiValidationErrorHandler = (error) => {
		inputPaymentError = error;
		showPaymentMethodScreen();
	};

	const updateUPITimer = (time: number) => {
		upiState.timer = time;
	};

	const onPaymentTypeSubmit = async (inputId: string) => {
		if (userData?.isKycInProgress) {
			toggleKYCProgressPopup();
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

		const commonSIPLumpSumInput = {
			amount,
			accNO: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accNO,
			ifscCode: profileData?.bankDetails?.[paymentHandler.selectedAccount]?.ifscCode,
			bankName: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.bankName,
			dpNumber: profileData?.dpNumber,
			fullName: profileData?.clientDetails?.fullName,
			schemeCode: schemeData?.schemeCode,
			xRequestId,
			source,
			previousOrderId,
			previousPGTxnId,
			state,
			showLoading,
			stopLoading,
			displayPendingPopup,
			displayError
		};

		const commonLumpsumInput = {
			...commonSIPLumpSumInput,
			email: profileData?.clientDetails?.email,
			subBroker: profileData?.clientDetails?.subBroker,
			mobile: profileData?.mobile,
			poaStatus: profileData?.poaStatus,
			onSuccess: navigateToLumpsumCompletePage,
			redirectedFrom,
			fromInvestmentDetailsPage,
			isAdditional:
				redirectedFrom === 'INVESTMENT_DETAILS' ||
				fromInvestmentDetailsPage ||
				!!folioNumber?.length
		};

		const commonSIPInput = {
			...commonSIPLumpSumInput,
			sipFrequency: schemeData?.sipFrequency,
			sipMaxInstallmentNo: schemeData?.sipMaxInstallmentNo,
			sipDate: getSIPDate(),
			sipType: investmentType,
			mandateId,
			onSuccess: navigateToSipCompletePage
		};

		const sipInstallmentInput = {
			sipId,
			sipDueDate,
			sipRegistrationNumber
		};

		if (NO_SIP_PAYMENT) {
			submitButtonSIPClickAnalyticsFunc();
			noPaymentFlow({
				amount,
				dpNumber: profileData?.dpNumber,
				schemeCode: schemeData?.schemeCode,
				sipFrequency: schemeData?.sipFrequency,
				sipMaxInstallmentNo: schemeData?.sipMaxInstallmentNo,
				sipDate: getSIPDate(),
				xRequestId,
				source,
				previousOrderId,
				previousPGTxnId,
				stopLoading,
				displayError,
				showLoading,
				onSuccess: navigateToSipCompletePage
			});
		} else if (
			paymentHandler?.paymentMode === 'NET_BANKING' &&
			activeTab === 'SIP' &&
			redirectedFrom !== 'SIP_PAYMENTS'
		) {
			submitButtonSIPClickAnalyticsFunc();
			netBankingSIPFlow({
				...commonSIPInput,
				netBankingState
			});
		} else if (paymentHandler?.paymentMode === 'NET_BANKING') {
			netBankingLumpsumFlow({
				...commonLumpsumInput,
				netBankingState
			});
		} else if (
			paymentHandler?.paymentMode === 'UPI' &&
			activeTab === 'SIP' &&
			redirectedFrom !== 'SIP_PAYMENTS'
		) {
			submitButtonSIPClickAnalyticsFunc();
			paymentHandler.upiId = inputId;
			const response = await isUPIIntegeratedFlow(inputId);
			const normalFlowFunc = () => {
				upiSIPFlow({
					...commonSIPInput,
					inputId,
					upiState,
					updateUPITimer,
					upiIdValid: true,
					mandateId: response.mandateId
				});
				onIntegeratedFlowPopupClickAnalytics({
					cta: 'onlyPayment'
				});
			};

			const integeratedFlowFunc = () => {
				upiIntegeratedFlow({
					...commonSIPInput,
					inputId,
					upiState,
					updateUPITimer,
					mandateId: response.mandateId,
					mobile: profileData?.mobile,
					clientId: profileData?.clientId,
					accountType: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accountType,
					amount: stringToInteger(amount),
					displayError: displayIntegeratedFlowError
				});
				onIntegeratedFlowPopupClickAnalytics({
					cta: 'autopay'
				});
			};
			if (response.isIntegeratedFlow) {
				showIntegeratedFlowPopup(integeratedFlowFunc, normalFlowFunc);
			} else if (response.normalFlow) {
				upiInitiateScreenAnalytics();
				normalFlowFunc();
			}
		} else if (paymentHandler?.paymentMode === 'UPI') {
			upiInitiateScreenAnalytics();
			paymentHandler.upiId = inputId;
			upiLumpsumFlow({
				...commonLumpsumInput,
				...sipInstallmentInput,
				inputId,
				upiState,
				showUPILoading,
				stopUPILoading,
				onUPIValidationFailure: upiValidationErrorHandler,
				updateUPITimer
			});
		} else if (activeTab === 'SIP' && redirectedFrom !== 'SIP_PAYMENTS') {
			submitButtonSIPClickAnalyticsFunc();
			const response = await isWalletIntegeratedFlow();
			const normalFlowFunc = () =>
				walletSIPFlow({
					...commonSIPInput,
					paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode]?.name,
					paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode]?.apiName,
					gpayPaymentState,
					mandateId: response.mandateId
				});
			const integeratedFlowFunc = () =>
				walletIntegeratedFlow({
					...commonSIPInput,
					paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode]?.name,
					paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode]?.apiName,
					gpayPaymentState,
					mandateId: response.mandateId,
					os,
					mobile: profileData?.mobile,
					clientId: profileData?.clientId,
					accountType: profileData?.bankDetails?.[paymentHandler?.selectedAccount]?.accountType,
					amount: stringToInteger(amount),
					displayError: displayIntegeratedFlowError
				});
			if (response.isIntegeratedFlow) {
				showIntegeratedFlowPopup(integeratedFlowFunc, normalFlowFunc);
			} else if (response.normalFlow) {
				normalFlowFunc();
			}
		} else {
			walletLumpsumFlow({
				...commonLumpsumInput,
				...sipInstallmentInput,
				paymentModeName: PAYMENT_MODE[paymentHandler.paymentMode]?.name,
				paymentModeAPIName: PAYMENT_MODE[paymentHandler.paymentMode]?.apiName,
				gpayPaymentState
			});
		}
	};

	// -------- **** ----------

	// Integerated flow

	const getMandateOptions = async () => {
		const acc = profileData?.bankDetails?.[paymentHandler.selectedAccount].accNO;
		const bankDetails = profileData?.bankDetails?.find((element: BankDetailsEntity) =>
			element.accNO?.endsWith(acc)
		);
		let res = {};
		if (bankDetails) {
			const url = `${PUBLIC_MANDATE_BASE_URL}/mandate/options?product=mf&ifsc=${bankDetails?.ifscCode}`;
			res = await useFetch(url, {}, fetch);
		}
		return res;
	};

	const getMandateDetails = async () => {
		const emandateResponse = await getEmandateDataFunc({
			amount,
			sipDate: getSIPDate(),
			source
		});
		return emandateResponse;
	};

	const validateVPA = async (inputId = '') => {
		const upiValidationResponse = await upiValidateFunc({
			bankName: profileData?.bankDetails?.[paymentHandler.selectedAccount].bankName,
			inputId,
			showLoading: showUPILoading,
			stopLoading: stopUPILoading
		});
		return upiValidationResponse;
	};

	const isWalletIntegeratedFlow = async () => {
		let isIntegeratedFlow = false;
		let normalFlow = true;
		if (version === 'B' && !mandateId && !integeratedFlowError.occured) {
			showLoading('Gathering Info');
			const response = await Promise.all([getMandateOptions(), getMandateDetails()]);
			stopLoading();
			const mandateResponse = response[0];
			const emandateResponse = response[1];
			let mandateOptionsCheck = false;
			let mandateId = '';
			if (mandateResponse.ok) {
				const upiMethod = mandateResponse.data?.data?.['upi'];
				if (
					upiMethod?.status === 'supported' &&
					stringToInteger(amount) >= upiMethod?.min_amount &&
					stringToInteger(amount) <= upiMethod?.max_amount
				) {
					mandateOptionsCheck = true;
				}
			}
			if (emandateResponse.ok) {
				mandateId = getPrimaryAccountMandateData(emandateResponse?.data)?.mandateId || '';
				isIntegeratedFlow = !mandateId && mandateOptionsCheck;
				normalFlow = true;
			} else {
				displayError({
					heading: 'Error',
					errorSubHeading:
						'We are facing some issue at our end. Please try again or contact field support'
				});
				isIntegeratedFlow = false;
				normalFlow = false;
			}
			return {
				isIntegeratedFlow,
				normalFlow,
				mandateId
			};
		}
		return {
			isIntegeratedFlow,
			normalFlow,
			mandateId
		};
	};

	const isUPIIntegeratedFlow = async (inputId = '') => {
		const upiValidationResponse = await validateVPA(inputId);
		if (upiValidationResponse.ok && !upiValidationResponse.data?.data?.valid) {
			upiValidationErrorHandler('Please enter valid UPI ID');
			return {
				normalFlow: false,
				isIntegeratedFlow: false,
				mandateId: ''
			};
		} else if (upiValidationResponse.ok && !upiValidationResponse.data?.data?.auto_pay_eligible) {
			return {
				normalFlow: true,
				isIntegeratedFlow: false,
				mandateId: ''
			};
		} else if (!upiValidationResponse.ok) {
			upiValidationErrorHandler(
				upiValidationResponse.data?.message ||
					upiValidationResponse.data?.data?.message ||
					'Something went wrong'
			);
			return {
				normalFlow: false,
				isIntegeratedFlow: false,
				mandateId: ''
			};
		}

		const response = await isWalletIntegeratedFlow();
		return response;
	};

	const showIntegeratedFlowPopup = (integeratedFlowFunc, normalFlowFunc) => {
		integeratedFlow.integeratedFlowFunc = integeratedFlowFunc;
		integeratedFlow.normalFlowFunc = normalFlowFunc;
		integeratedFlow.visible = true;
		onIntegeratedFlowPopupImpressionAnalytics({
			previousScreen: showChangePayment ? 'paymentSelection' : 'orderpad'
		});
	};

	const closeIntegeratedFlowPopup = () => {
		integeratedFlow.integeratedFlowFunc = () => undefined;
		integeratedFlow.normalFlowFunc = () => undefined;
		integeratedFlow.visible = false;
	};

	// -------- **** ----------
</script>

{#if !showChangePayment}
	<section
		class="mb-[294px] mt-14 h-fit w-full rounded-lg shadow-csm md:mb-0 md:mt-[52px] {$$props?.class} {!investmentNotAllowedText?.length
			? 'bg-grey'
			: 'bg-white'}"
	>
		<slot name="header">
			<section class="hidden rounded-t-lg bg-white px-3 py-5 font-normal text-black-title md:block">
				{activeTab === 'SIP' ? 'Start SIP' : 'One Time Investment'}
			</section>
		</slot>
		{#if showOrderPadHeader}
			<slot name="customMobileHeader">
				<MobileHeader
					title={activeTab === 'SIP' ? 'Start SIP' : 'One Time Investment'}
					showSearchIcon={false}
					showBackIcon={true}
					showCloseIcon={false}
					class="fixed left-0 right-0 top-0 bg-white"
				/>
			</slot>
		{/if}
		{#if !investmentNotAllowedText?.length}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<article
				class="mb-2 rounded-lg bg-white p-3 shadow-csm md:hidden"
				on:click={goToFundDetailsPage}
			>
				<div class="flex flex-row justify-between">
					<div class="flex flex-row">
						<SchemeLogo size="xs" src={schemeData?.logoUrl} alt="schemelogo" />
						<div class="mr-3 text-sm font-normal text-black-title">{schemeData.schemeName}</div>
					</div>
					{#if schemeData?.returns3yr > 0}
						<div class="whitespace-nowrap">
							<div class="text-xs font-normal text-grey-body">Returns p.a</div>
							<div class="text-right text-base font-normal text-black-title">
								{schemeData?.returns3yr?.toFixed(1)}%
							</div>
						</div>
					{/if}
				</div>
				{#if schemeData?.noOfClientInvested}
					<div class="mt-3 flex flex-row items-center rounded bg-purple-glow px-3 py-2">
						<img
							src={PeopleIcon}
							class="mr-2 p-1"
							decoding="async"
							alt="Number of people invested"
							width="24"
							height="24"
						/>
						<div class="text-xs text-black-title">
							<span class="font-medium"
								>{addCommasToAmountString(schemeData?.noOfClientInvested)}</span
							> people have invested in this fund
						</div>
					</div>
				{/if}
			</article>

			<article class="rounded-lg bg-white text-black-title md:mx-3 md:mb-4 md:mt-2">
				<!-- Tab Section (SIP | ONE TIME) -->
				{#if isInvestTypeVisible()}
					<section class="bg-whites flex rounded-lg rounded-b-none text-black-title">
						<button
							class={`h-12 w-40 flex-1 cursor-default rounded-t md:cursor-pointer ${
								activeTab === 'SIP'
									? 'border-t-4 border-t-green-buy'
									: 'rounded-tr-none border-l border-t bg-grey'
							}`}
							on:click={() => switchTabs('SIP')}
						>
							SIP
						</button>
						<button
							class={`h-12 w-40 flex-1 cursor-default rounded-t md:cursor-pointer ${
								activeTab === 'ONETIME'
									? 'border-t-4 border-t-green-buy'
									: 'rounded-tl-none border-r border-t bg-grey'
							}`}
							on:click={() => switchTabs('ONETIME')}
						>
							ONE TIME
						</button>
					</section>
				{/if}

				<article class="flex flex-col p-3">
					<!-- Amount input -->
					<article class="flex flex-col items-center rounded border border-grey-line py-2.5">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label class="mb-2 text-xs font-normal text-grey-body">ENTER AMOUNT</label>
						<button
							class="flex w-full cursor-text items-center justify-start"
							on:click={handleAmountInputFocus}
						>
							<input
								id="amountInput"
								inputmode="none"
								maxlength="13"
								placeholder="₹"
								value={amountVal}
								class="w-full bg-white text-center text-2xl font-medium leading-none text-black-title outline-none"
								on:input={onInputChange}
								on:focus={handleAmountInputBlur}
							/>
						</button>
					</article>

					{#if errorMessage?.length && isSelectedInvestmentTypeAllowed()}
						<article class="flex justify-center pb-1">
							<p class="text-xs font-light text-red-sell">
								{errorMessage}
							</p>
						</article>
					{/if}

					<!-- Date (Calendar) input -->
					{#if activeTab === 'SIP'}
						<article class="mt-3 flex w-full flex-row items-center justify-between">
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="text-xs font-normal text-black-title">Monthly SIP Date</label>
							<section
								class="flex items-center md:cursor-pointer {isSelectedInvestmentTypeAllowed()
									? 'md:cursor-pointer'
									: 'md:cursor-not-allowed'}"
								on:click={toggleCalendar}
								on:keypress={() => {
									// add logic
								}}
							>
								<div class="text-xs font-normal text-black-title">
									{`${calendarDate}${dateSuperscript}`}
								</div>
								<section class="pl-1">
									<CalendarSmallIcon height={16} width={16} />
								</section>
							</section>
						</article>
					{/if}

					{#if activeTab === 'ONETIME' && isLumpsumToSipEligible && !errorMessage?.length}
						<article class="border-t px-2 py-3">
							<section
								class="to flex items-center justify-between rounded bg-gradient-to-r from-green-buy/40 to-white px-1 py-2"
							>
								<div class="flex items-start">
									<WMSIcon class="mr-1 mt-1" name="double-tick" width={15} height={9} />
									<p class="w-[80%] text-xs font-normal text-black-title">
										To reduce the risk of market fluctuations, consider investing this amount as SIP
									</p>
								</div>
								<Button
									variant="transparent"
									class="!h-fit !min-h-0 !px-0 !text-[11px] !font-normal"
									onClick={toggleShowLumpsumToSipModal}
								>
									Learn How
								</Button>
							</section>
						</article>
					{/if}

					<!-- Checkbox for SIP payment now -->
					{#if activeTab === 'SIP' && !paymentMandatory}
						<article
							class={`mt-4 flex w-fit items-center justify-start text-xs font-normal text-grey-body ${
								isSelectedInvestmentTypeAllowed() ? 'md:cursor-pointer' : 'md:cursor-not-allowed'
							}`}
							on:click={toggleFirstSipPayment}
							on:keypress={() => {
								// add logic
							}}
						>
							{#if firstSipPayment}
								<div class="mr-2">
									<CheckboxCheckedIcon />
								</div>
							{:else}
								<div class="mr-1">
									<CheckboxUncheckedIcon />
								</div>
							{/if}
							<span class="text-black-title"> Make first SIP payment now </span>
						</article>
					{/if}

					{#if activeTab === 'SIP' && isSipInvestmentAllowed && amount?.length && !errorMessage?.length}
						<OrderpadReturns
							investedAmount={Number(amount)}
							threeYearReturns={schemeData?.returns3yr}
							class="mt-4 !border-b-0 border-t !px-0 pb-0 pt-3"
							amountClass="text-xl"
							textClass="flex flex-row items-center"
						>
							<span slot="supporting-text" class="ml-1">Expected 3Y Returns</span>
						</OrderpadReturns>
					{/if}

					{#if showTabNotSupported}
						<div class="pb-1">
							<TabNotSupported {tabNotSupportedType} />
						</div>
					{/if}
				</article>
			</article>
			<!-- Footer section for Mobile layout (PaymentMode/StartSipDate + TnC + Submit + Numpad) -->
			<article class="mx-3 md:mx-0">
				<section class="fixed inset-0 top-auto md:relative md:inset-auto">
					{#if activeTab === 'SIP' && !firstSipPayment}
						<NextSipDate {calendarDate} {calendarMonth} {calendarYear} />
					{/if}
					<article class="rounded-b-lg bg-white px-4 py-3 md:px-3">
						<!-- TnC Section -->
						<article class="flex items-center justify-center">
							<p class="text-center text-xs font-normal text-black-title">
								By proceeding, you accept Angel One's
								<button class="text-blue-primary md:cursor-pointer" on:click={toggleTncModal}>
									Terms and Conditions
								</button>
							</p>
						</article>

						<section class="mt-3 flex flex-row">
							{#if (activeTab === 'ONETIME' || firstSipPayment) && !firstTimeUser && isSelectedInvestmentTypeAllowed() && stringToInteger(amount) > 0}
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
							<!-- Submit Button -->
							<div class="flex flex-1">
								<Button
									class={`flex h-12 flex-1 rounded ${
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
									{activeTab === 'SIP'
										? !firstSipPayment
											? 'START SIP'
											: firstTimeUser
											? 'PROCEED'
											: `PAY ₹${addCommasToAmountString(amount)}`
										: firstTimeUser
										? 'PROCEED'
										: `PAY ₹${addCommasToAmountString(amount)}`}
								</Button>
							</div>
						</section>
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
							class="hidden flex-row justify-center rounded-b-lg bg-gray-50 px-8 py-4 md:flex"
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
		{amount}
		onBackClick={hidePaymentMethodScreen}
		allowedPaymentmethods={$paymentAppStore.allPaymentApps}
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
		isSchemeDisabled={!isSelectedInvestmentTypeAllowed()}
		asModal={isMobile ? true : false}
	>
		<div slot="schemeTile" class="m-4 mb-0 rounded-lg border border-grey-line bg-white p-3">
			<div class="mb-2 flex flex-row items-center rounded-full text-xs font-normal text-grey-body">
				<span>{activeTab === 'SIP' ? 'SIP' : 'ONE TIME INVESTMENT'}</span>
				{#if activeTab === 'SIP'}
					<div class="mx-1 h-1 w-1 min-w-[4px] rounded-full bg-grey-body" />
					<span>
						{calendarDate}{dateSuperscript} of every month
					</span>
				{/if}
			</div>
			<div class=" flex flex-row justify-between">
				<div class="flex flex-row">
					<SchemeLogo size="xs" src={schemeData?.logoUrl} alt="schemelogo" />
					<div class="trucateTo2Line mr-2.5 text-sm font-normal text-black-title">
						{schemeData?.schemeName}
					</div>
				</div>
				<div class="whitespace-nowrap text-sm font-medium text-black-title">
					₹{addCommasToAmountString(amount)}
				</div>
			</div>
		</div>
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
	<UpiTransactionPopup
		{amount}
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
		closeModal={() => closeErrorPopup(true)}
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
{:else if integeratedFlowError.visible}
	<ResultPopup
		popupType="FAILURE"
		title={integeratedFlowError.heading}
		text={integeratedFlowError.subHeading}
		class="w-full rounded-b-none rounded-t-2xl p-6 px-4 sm:p-12 md:rounded-lg"
		isModalOpen
		handleButtonClick={closeIntegeratedFlowErrorPopup}
		closeModal={closeIntegeratedFlowErrorPopup}
		buttonTitle={`PAY ₹${addCommasToAmountString(amount)}`}
		buttonClass="mt-5 w-full rounded cursor-default md:cursor-pointer"
		buttonVariant="contained"
	>
		<svelte:fragment slot="middleSection">
			<section class="item-center mt-2 flex rounded bg-grey p-2">
				<div class="my-auto flex-1">
					<WMSIcon name="info-in-circle-dark" class="p-1" stroke="#3F5BD9" />
				</div>
				<div class="ml-3 text-left text-sm font-normal text-grey-body">
					Please complete your first SIP payment for ₹{addCommasToAmountString(amount)} now. You can
					set up autopay later
				</div>
			</section>
		</svelte:fragment>
	</ResultPopup>
{/if}

{#if showLumpsumToSipModal}
	<Modal isModalOpen={showLumpsumToSipModal} on:backdropclicked={toggleShowLumpsumToSipModal}>
		<LumpsumToSip
			class="z-60 sm:w-120"
			sipAmount={lumpsumToSipAmount}
			on:primaryCtaClick={redirectToSip}
			on:secondaryCtaClick={handleLumpsumToSipOtiClick}
		/>
	</Modal>
{/if}

{#if showBeforePaymentAckModal}
	<Modal
		isModalOpen={showBeforePaymentAckModal}
		on:backdropclicked={toggleShowBeforePaymentAckModal}
	>
		<section class="rounded-t-2xl bg-white px-4 py-6 shadow-clg sm:w-120 sm:rounded-lg sm:p-6">
			<section class="flex w-full flex-col items-start justify-center overflow-y-auto">
				<div class="px-2">
					<div class="text-left text-lg font-normal text-black-title">
						Important: For Successful Payment
					</div>
					<div class="mt-2 text-sm font-normal text-grey-body">
						Please complete the transaction in your UPI app with only <span class="text-black"
							>the registered bank account on Angel One</span
						>
					</div>

					<SelectedBankDetails
						bankAccountDetails={profileData?.bankDetails?.[paymentHandler?.selectedAccount]}
						class="!mt-2 ml-3 flex justify-start"
					/>

					<section class="item-center mt-2 flex rounded bg-grey p-2">
						<div class="my-auto flex-1">
							<WMSIcon name="info-in-circle-dark" class="p-1" stroke="#3F5BD9" />
						</div>
						<div class="ml-3 text-left text-sm font-normal text-grey-body">
							Your last transaction failed as you selected a different bank account in your UPI app
						</div>
					</section>
				</div>
			</section>

			<Button variant="contained" class="mt-5 w-full" onClick={setBeforePaymentAckDone}>
				PAY ₹{addCommasToAmountString(amount)}
			</Button>
		</section>
	</Modal>
{/if}

{#if oneLinkExpired}
	<ResultPopup
		popupType="FAILURE"
		title={'Link Expired'}
		text={'The link you clicked has expired. You can search for the same Mutual Fund from the homepage.'}
		class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen={true}
		handleButtonClick={() => goto(`${base}/discoverfunds`, { replaceState: true })}
		buttonTitle="GO TO HOMEPAGE"
		buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
		buttonVariant="contained"
	/>
{/if}

{#if integeratedFlow.visible}
	<IntegeratedFlowPopup
		onClose={closeIntegeratedFlowPopup}
		normalFlowFunc={integeratedFlow.normalFlowFunc}
		integeratedFlowFunc={integeratedFlow.integeratedFlowFunc}
	/>
{/if}

{#if isKYCInProgress}
	<KycProgressPopup onClose={toggleKYCProgressPopup} onSubmit={toggleKYCProgressPopup} />
{/if}

<style>
	.trucateTo2Line {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; /* number of lines to show */
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
