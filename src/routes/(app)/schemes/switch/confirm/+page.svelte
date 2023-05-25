<script lang="ts">
	import { goto } from '$app/navigation';
	import SoSipContinuation from '$components/Switch/SOSipContinuation.svelte';
	import { addCommasToAmountString, getCappedUnitString } from '$lib/utils/helpers/formatAmount';
	import { SwitchOrderTitleCard } from 'wms-ui-component';
	import type { PageData } from './[scheme_name]/$types';
	import { Button } from 'wms-ui-component';
	import { v4 as uuidv4 } from 'uuid';
	import { profileStore } from '$lib/stores/ProfileStore';
	import TpinVerification from '$components/TpinFlow/TpinVerification.svelte';
	import {
		authFailedModalOpenAnalytics,
		authFailedRetryClickAnalytics,
		edisAboutModalCloseAnalytics,
		edisAboutModalOpenAnalytics,
		proceedButtonClickAfterRegenerateTpinAnalytics,
		redemptionResendOtpClickAnalytics,
		regenerateTpinButtonAnalytics,
		serverErrorModalOpenAnalytics,
		serverErrorRetryCloseClickAnalytics,
		tpinProceedAnalytics,
		tpinVerifiedModalGoBackClickAnalytics,
		tpinVerifiedModalOpenAnalytics,
		tpinVerifiedModalProceedClickAnalytics,
		verifyWithEdisModalOpenAnalytics,
		verifyWithOtpModalOpenAnalytics,
		verifyWithOtpProceedButtonAnalytics
	} from '$lib/analytics/redemption/redemption';
	import type { IOrderPostData } from '$lib/types/IOrderPostData';
	import LoadingPopup from '../../../InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { base } from '$app/paths';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	import OtpVerification from '$components/OtpFlow/OtpVerification.svelte';
	import { finalSwitchConfirmationAnalytics } from '$lib/analytics/switch/switch';

	let showTpinVerificationModal = false;
	let showOtpVerificationModal = false;
	let uuid = uuidv4();
	const appContext: AppContext = getContext('app');

	const loadingState = {
		heading: '',
		isLoading: false
	};

	const error = {
		visible: false,
		heading: '',
		subHeading: '',
		serverError: false
	};

	const toggleTpinVerificationModal = () => {
		showTpinVerificationModal = !showTpinVerificationModal;

		if (!showTpinVerificationModal) {
			tpinVerifiedModalGoBackClickAnalytics();
		}
	};

	const showLoading = (heading: string) => {
		loadingState.isLoading = true;
		loadingState.heading = heading;
	};

	const stopLoading = () => {
		loadingState.isLoading = false;
		loadingState.heading = '';
	};

	const closeErrorPopup = () => {
		error.visible = false;
		error.heading = '';
		error.subHeading = '';

		uuid = uuidv4();
	};

	const authFailedModalOpenAnalyticsFunc = () => {
		const eventMetadata = {
			Message: 'Your TPIN verification failed. Please try again'
		};

		authFailedModalOpenAnalytics(eventMetadata);
	};

	const serverErrorModalOpenAnalyticsFunc = () => {
		const eventMetadata = {
			Message: 'CDSL Servers are not responding, kindly try after sometime.'
		};

		serverErrorModalOpenAnalytics(eventMetadata);
	};

	const tpinVerifiedModalOpenAnalyticsFunc = () => {
		const eventMetadata = {
			Message: 'Your TPIN Verfied Successfully.'
		};

		tpinVerifiedModalOpenAnalytics(eventMetadata);
	};

	const toggleOtpVerificationModal = () => {
		showOtpVerificationModal = !showOtpVerificationModal;
	};

	const verifyWithOtpModalOpenAnalyticsFunc = (e: {
		detail: { maskedEmailId: string; maskedMobileNumber: string; folioNumber: string };
	}) => {
		const { maskedEmailId = '', maskedMobileNumber = '', folioNumber = '' } = e?.detail || {};

		const eventMetadata = {
			Message: `An OTP has been sent to ${maskedEmailId} and ${maskedMobileNumber} registered with the folio ${folioNumber}. Please enter the OTP to verify your order`
		};

		verifyWithOtpModalOpenAnalytics(eventMetadata);
	};

	const postSwitchOrder = async (orderPostData?: IOrderPostData) => {
		showLoading('Placing Switch Order');
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;
		const res = await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				amount: data?.fullAmountSelected
					? data?.selectedFolio?.redemableAmount
					: parseInt(data?.amount),
				dpNumber: $profileStore?.dpNumber,
				folioNumber: data?.selectedFolio?.folioNumber,
				quantity: data?.fullAmountSelected
					? data?.selectedFolio?.redemableUnits
					: parseFloat(getCappedUnitString(data?.numberOfUnits?.toString(), 3)),
				redeemAll: data?.fullAmountSelected,
				schemeCode: data?.folioHolding?.schemeCode,
				toSchemeCode: data?.switchInFund?.schemeCode,
				transactionType: 'SWITCH',
				edisExecuteDate: '',
				isin: data?.folioHolding?.isin,
				toIsin: data?.switchInFund?.isin,
				dpFlag: data?.selectedFolio?.dpFlag,
				emailId: orderPostData?.emailId,
				mobileNo: orderPostData?.mobileNo?.slice(3),
				poaStatus: $profileStore.poaStatus
			})
		});

		if (
			res?.ok &&
			res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS &&
			res?.data?.data?.orderId !== undefined
		) {
			const baseUrl = `${getNavigationBaseUrl(base, appContext?.scheme, appContext?.host)}`;
			const path = `/orders/redeem/${res?.data?.data?.orderId}?orderType=SWITCH`;
			goto(`${baseUrl}${path}`);
		} else {
			error.visible = true;
			error.heading = 'Order Failed';
			if (res?.data?.message === 'FAILED: SO QUANTITY INSUFFICIENT FOR SI SCHEME') {
				error.subHeading = 'Please try again with a higher switch out amount';
			} else {
				error.subHeading = res?.data?.message || 'Something went wrong';
			}
			stopLoading();
		}
	};

	const handleConfirmSwitch = () => {
		if (data?.selectedFolio?.dpFlag?.toUpperCase() === 'Y') {
			if ($profileStore?.poaStatus?.toUpperCase() === 'I') {
				toggleTpinVerificationModal();
			} else if ($profileStore?.poaStatus?.toUpperCase() === 'A') {
				postSwitchOrder();
			}
		} else if (data?.selectedFolio?.dpFlag?.toUpperCase() === 'N') {
			toggleOtpVerificationModal();
		}
		const eventMetaData = {
			SwitchOutFund: data?.folioHolding?.schemeName,
			SwitchinFund: data?.switchInFund?.schemeName,
			SwitchAmount: data?.amount,
			Units: data?.numberOfUnits
		};
		finalSwitchConfirmationAnalytics(eventMetaData);
	};
	export let data: PageData;
</script>

<SwitchOrderTitleCard
	switchOutSchemeName={data?.folioHolding?.schemeName}
	switchOutLogo={data?.folioHolding?.logoUrl}
	switchInSchemeName={data?.switchInFund?.schemeName}
	switchInLogo={data?.switchInFund?.logoUrl}
/>
<section class="mt-3 rounded-lg bg-white px-4 py-6 font-medium shadow-csm">
	<article class="pb-2 text-sm text-black-title">Switch Details</article>
	<article class="flex-col rounded-lg border">
		{#if data?.folioList?.length > 1}
			<article class="flex items-center justify-between border-b bg-grey p-2">
				<div class="flex items-center justify-start">
					<span class="mr-1 text-xs text-grey-body"> Folio </span>
				</div>
				<div class="text-sm text-black-title">
					#{data?.selectedFolio?.folioNumber}
				</div>
			</article>
		{/if}
		<article class="flex items-center justify-between border-b p-2">
			<div class="flex items-center justify-start">
				<span class="mr-1 text-xs text-grey-body"> Amount (Approximate) </span>
			</div>
			<div class="text-base text-black-title">
				₹{addCommasToAmountString(data?.amount || 0)}
			</div>
		</article>
		<article class="flex items-center justify-between p-2">
			<div>
				<span class="mr-1 text-xs text-grey-body"> Units </span>
			</div>
			<div class="text-base text-black-title">
				{data?.numberOfUnits?.toFixed(3)}
			</div>
		</article>
	</article>
	{#if data?.folioHolding?.sipEnabled === true}
		<article class="mt-2 pt-2">
			<SoSipContinuation switchOutFundName={data?.folioHolding?.schemeName} />
		</article>
	{/if}
</section>
<article class="fixed inset-0 top-auto mx-2 my-4 justify-end">
	<Button class="w-full" on:click={handleConfirmSwitch}>CONFIRM SWITCH</Button>
</article>

{#if showTpinVerificationModal && !error.visible}
	<TpinVerification
		{uuid}
		folio={data?.selectedFolio}
		quantity={data?.numberOfUnits}
		redeemAll={data?.fullAmountSelected}
		on:tpinVerificationSuccessful={(e) => postSwitchOrder({ edisExecDate: e?.detail })}
		on:closeModal={toggleTpinVerificationModal}
		on:tpinProcessStart={verifyWithEdisModalOpenAnalytics}
		on:regenerateTpinClick={regenerateTpinButtonAnalytics}
		on:tpinProceedClick={tpinProceedAnalytics}
		on:edisAboutModalOpen={edisAboutModalOpenAnalytics}
		on:edisAboutModalClose={edisAboutModalCloseAnalytics}
		on:showAuthFailedModal={authFailedModalOpenAnalyticsFunc}
		on:authFailedRetryClick={authFailedRetryClickAnalytics}
		on:showServerErrorModal={serverErrorModalOpenAnalyticsFunc}
		on:serverErrorRetryClick={serverErrorRetryCloseClickAnalytics}
		on:tpinVerifiedModalOpen={tpinVerifiedModalOpenAnalyticsFunc}
		on:tpinVerifiedModalProceedClick={tpinVerifiedModalProceedClickAnalytics}
		on:proceedAfterRegenerateTpin={proceedButtonClickAfterRegenerateTpinAnalytics}
	/>
{/if}

{#if showOtpVerificationModal && !error.visible}
	<OtpVerification
		{uuid}
		folio={data?.selectedFolio}
		amount={data?.amount}
		schemeName={data?.folioHolding?.schemeName}
		on:otpVerificationSuccessful={(e) =>
			postSwitchOrder({ emailId: e?.detail?.emailId, mobileNo: e?.detail?.mobileNo })}
		on:closeOtpModal={toggleOtpVerificationModal}
		on:otpVerificationModalOpen={verifyWithOtpModalOpenAnalyticsFunc}
		on:otpVerificationProceedClick={verifyWithOtpProceedButtonAnalytics}
		on:otpResendClick={redemptionResendOtpClickAnalytics}
	/>
{/if}

{#if loadingState.isLoading}
	<LoadingPopup heading={loadingState.heading} />
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
