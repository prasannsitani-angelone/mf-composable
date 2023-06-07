<script lang="ts">
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import logger from '$lib/utils/logger';
	import { onDestroy, onMount } from 'svelte';
	import LoadingPopup from '../../../routes/(app)/InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import {
		PUBLIC_MANDATE_BASE_URL,
		PUBLIC_MANDATE_SOURCE,
		PUBLIC_MF_CORE_BASE_URL
	} from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { base } from '$app/paths';
	import { add } from 'date-fns';
	import { page } from '$app/stores';
	import { stringToFloat, stringToInteger } from '$lib/utils/helpers/numbers';
	import { getCompleteSIPDateBasedonDD } from '$lib/utils/helpers/date';
	import SuccessPopup from './components/SuccessPopup.svelte';
	import { browser } from '$app/environment';
	import {
		screenOpenAnalytics,
		accounChangeAnalytics,
		emandateProceedButtonAnalytics,
		netBankingPopupAnalytics,
		emandateCreatedSuccessfullyAnalytics,
		emandateCreatedSuccessDoneButtonAnalytics,
		emandateCreateFailedAnalytics,
		emandateCreateFailedDoneButtonAnalytics
	} from './analytics';

	export let sipID = '';
	export let amount = '';
	export let date = '';
	export let successButtonTitle = '';
	export let onSuccess = (): void => undefined;

	let bankPopupOpen = false;
	let selectedAccount = 0;
	let emandateWindow = null;
	let interval = null;
	const amountInNumber = stringToFloat(amount);
	const sipDate = date ? getCompleteSIPDateBasedonDD(stringToInteger(date)) : new Date();

	$: profileData = $page?.data?.profile;

	let isLoading = false;
	let isSuccess = false;
	const error = {
		visible: false,
		heading: '',
		subHeading: ''
	};

	const onBankPopupClose = (): void => {
		toggleBankPopup();
	};

	const toggleBankPopup = () => {
		bankPopupOpen = !bankPopupOpen;
	};

	const stopLoading = () => {
		isLoading = false;
	};

	const displayError = ({ heading = 'Autopay Setup Failed', errorSubHeading = '' }) => {
		error.visible = true;
		error.heading = heading;
		error.subHeading = errorSubHeading;
	};

	const closeErrorPopup = () => {
		emandateCreateFailedDoneButtonAnalytics();
		error.heading = '';
		error.subHeading = '';
		error.visible = false;
	};

	const resetEmandateInterval = () => {
		if (interval) {
			clearInterval(interval);
		}
	};

	const closeEmandateWindow = () => {
		if (emandateWindow) {
			emandateWindow.close();
		}
	};

	const orderPurchasePatchFunc = async (emandateId: string) => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/${sipID}`;
			await useFetch(url, {
				method: 'PATCH',
				body: JSON.stringify({
					emandateId
				})
			});
		} catch (e) {
			return;
		}
	};

	const orderPurchaseBulkPatchFunc = async (emandateId: string) => {
		try {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/sips/bulk`;
			await useFetch(url, {
				method: 'PATCH',
				body: JSON.stringify({
					emandateId
				})
			});
		} catch (e) {
			return;
		}
	};

	const listenerFunc = (event) => {
		if (location.origin === event?.origin && event?.data?.source === 'emandateCallback') {
			logger.info({
				type: 'Emandate Redirection Response',
				params: event?.data
			});
			stopLoading();
			resetEmandateInterval();
			closeEmandateWindow();
			if (event.data.status === 'success') {
				const emandateID = event.data.digio_doc_id;
				if (sipID) {
					orderPurchasePatchFunc(emandateID);
				} else {
					orderPurchaseBulkPatchFunc(emandateID);
				}
				isSuccess = true;
				emandateCreatedSuccessfullyAnalytics();
			} else if (event.data.status === 'failure') {
				emandateCreateFailedAnalytics();
				stopLoading();
				displayError({
					heading: 'Autopay Setup Failed',
					errorSubHeading:
						event.data.message ||
						'We were unable to process your request due a technical issue. Please try again'
				});
			} else {
				emandateCreateFailedAnalytics();
				stopLoading();
				displayError({
					heading: 'Autopay Setup Failed',
					errorSubHeading:
						event.data.message ||
						'You have cancelled the eMandate request for Autopay. Please try again or use another authorisation mode'
				});
			}
		}
	};

	onMount(() => {
		window.addEventListener('message', listenerFunc);
	});

	onDestroy(() => {
		if (browser) {
			resetEmandateInterval();
			window.removeEventListener('message', listenerFunc, false);
		}
	});

	const getSipStartDateWithoutFormat = () => {
		const now = new Date();
		return add(now, { days: 1 });
	};

	const getSipStartDate = () => {
		return getSipStartDateWithoutFormat().getTime();
	};

	const isValidDate = (date: Date): boolean => {
		if (isNaN(date)) {
			return false;
		}
		return true;
	};

	const getSipEndDate = () => {
		const date = isValidDate(sipDate) ? sipDate : getSipStartDateWithoutFormat();
		return add(date, {
			months: 9999
		}).getTime();
	};

	const getMandateAmount = (amount: number) => {
		if (amount <= 100000) {
			return 100000;
		} else if (amount <= 500000) {
			return 500000;
		} else if (amount > 500000) {
			return 1000000;
		}
		return 100000;
	};

	const getMandateBody = (authMode: string) => {
		return {
			client_full_name: profileData.clientDetails.shortName,
			client_mobile_number: profileData?.mobile,
			client_code: profileData?.clientId,
			bank_name: profileData?.bankDetails?.[selectedAccount]?.bankName,
			bank_account_number: profileData?.bankDetails?.[selectedAccount]?.accNO,
			bank_account_type: profileData?.bankDetails?.[selectedAccount]?.accountType || 'savings',
			bank_ifsc_code: profileData?.bankDetails?.[selectedAccount]?.ifscCode,
			type: authMode,
			frequency: 'monthly',
			product: 'mf',
			amount: getMandateAmount(amountInNumber),
			request_source: PUBLIC_MANDATE_SOURCE,
			start_date: getSipStartDate(),
			end_date: getSipEndDate()
		};
	};

	const callMandateAPI = async () => {
		try {
			const url = `${PUBLIC_MANDATE_BASE_URL}/mandate`;
			const response = await useFetch(url, {
				method: 'POST',
				body: JSON.stringify(getMandateBody('api'))
			});
			return response;
		} catch (e) {
			return {};
		}
	};

	const handleMandateResponse = (response) => {
		if (!emandateWindow || (emandateWindow && emandateWindow.closed)) {
			stopLoading();
			displayError({
				heading: 'AutoPay Setup Failed',
				errorSubHeading: 'You have cancelled the request for AutoPay. Please try again.'
			});
			throw new Error('');
		} else if (!response?.ok) {
			closeEmandateWindow();
			stopLoading();
			if (response?.data?.error_code === 'ERROR-API-MANDATE-NOT-SUPPORTED') {
				displayError({
					heading: 'AutoPay Currently Unavailable',
					errorSubHeading:
						'AutoPay is temporarily unavailable. Please try again later from the SIPs section.'
				});
			} else {
				displayError({
					heading: 'AutoPay Setup Failed',
					errorSubHeading:
						response?.data?.message || 'Failed to set up an AutoPay request. Please try again.'
				});
			}
			throw new Error('');
		}
	};

	const paymentWindowCloseLogic = (delay = 1) => {
		interval = setInterval(() => {
			if (emandateWindow && emandateWindow.closed) {
				resetEmandateInterval();
				stopLoading();
				displayError({
					heading: 'Autopay Setup Failed',
					errorSubHeading:
						'You have cancelled the eMandate request for Autopay. Please try again or use another authorisation mode'
				});
			}
		}, delay * 1000);
	};

	const startEmandateProcess = async () => {
		try {
			emandateProceedButtonAnalytics({
				Amount: amount,
				sipID,
				date
			});
			openWindow();
			netBankingPopupAnalytics();
			isLoading = true;
			const response = await callMandateAPI();
			handleMandateResponse(response);
			emandateWindow.location.replace(
				`${response?.data?.data?.redirect_url}?redirect_url=${window.location.origin}${base}/emandateCallback`
			);
			paymentWindowCloseLogic();
		} catch (e) {
			stopLoading();
		}
	};

	const openWindow = () => {
		emandateWindow = window.open(
			`${window.location.origin}${base}/intermediateLoading`,
			'EMANDATE_WINDOW'
		);
	};

	export const startProcess = () => {
		screenOpenAnalytics();
		if (profileData?.bankDetails.length > 1) {
			toggleBankPopup();
		} else {
			startEmandateProcess();
		}
	};

	const onAccountChange = (index: number) => {
		accounChangeAnalytics({
			BankAccount: profileData?.bankDetails?.[index]?.bankName
		});
		selectedAccount = index;
		startEmandateProcess();
	};
</script>

<div>
	{#if bankPopupOpen}
		<BankSelectionPopup
			bankAccounts={profileData?.bankDetails}
			{onAccountChange}
			{selectedAccount}
			onClose={onBankPopupClose}
		/>
	{/if}

	{#if isLoading}
		<LoadingPopup heading="Redirecting to your Bank" />
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
	{:else if isSuccess}
		<SuccessPopup
			mandateLimit={getMandateAmount(amountInNumber)?.toString()}
			buttonTitle={successButtonTitle}
			onSubmit={() => {
				emandateCreatedSuccessDoneButtonAnalytics();
				onSuccess();
			}}
		/>
	{/if}
</div>
