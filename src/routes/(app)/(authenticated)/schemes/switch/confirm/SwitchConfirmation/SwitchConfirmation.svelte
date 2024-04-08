<script lang="ts">
	import { goto } from '$app/navigation';
	import SoSipContinuation from '$components/Switch/SOSipContinuation.svelte';
	import { addCommasToAmountString, getCappedUnitString } from '$lib/utils/helpers/formatAmount';
	import { SwitchOrderTile, SwitchOrderTitleCard } from 'svelte-components';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	import ButtonMedium from '$components/ButtonMedium.svelte';
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
	import LoadingPopup from '../../../../../InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import OtpVerification from '$components/OtpFlow/OtpVerification.svelte';
	import { finalSwitchConfirmationAnalytics } from '$lib/analytics/switch/switch';
	import type { FolioHoldingType, FolioObject } from '$lib/types/IInvestments';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { base } from '$app/paths';
	import InterAmcSwitchCue from './InterAmcSwitchCue.svelte';
	import type { IMandateDetails } from '$lib/types/IEmandate';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { onMount } from 'svelte';
	import { getEdisPoaStatus } from '$lib/api/getTpinStatusMf';

	let showTpinVerificationModal = false;
	let showOtpVerificationModal = false;
	let uuid = uuidv4();
	const loadingState = {
		heading: '',
		isLoading: false
	};
	let showInterAmcPopup = false;
	let isPoaActive = false;

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
		showTpinVerificationModal = false;
		showOtpVerificationModal = false;

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
		const optionHeaders = {
			'X-Request-Id': requestId || uuid,
			'X-SESSION-ID': uuid,
			'X-device-type': 'WEB'
		};
		if (appsource) {
			optionHeaders['X-Source'] = appsource;
		}
		if (interAmcFlag) {
			const switchRefNo = $profileStore?.clientId + Date.now();
			const redeemResult = await interAmcRedeemOrder(switchRefNo, orderPostData);
			let purchaseResult = null;
			if (redeemResult?.status !== 409) {
				purchaseResult = await interAmcPurchaseOrder(switchRefNo);
			}
			if (
				redeemResult?.ok &&
				purchaseResult?.ok &&
				redeemResult?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS &&
				purchaseResult?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS &&
				redeemResult?.data?.data?.orderId !== undefined
			) {
				const params = encodeObject({
					orderID: redeemResult?.data?.data?.orderId,
					isSwitch: true
				});

				goto(`${base}/ordersummary?params=${params}`, {
					replaceState: true
				});
			} else {
				error.visible = true;
				error.heading = 'Order Failed';
				error.subHeading = 'Something went wrong';
				stopLoading();
			}
		} else {
			const res = await useFetch(url, {
				method: 'POST',
				headers: optionHeaders,
				body: JSON.stringify({
					amount: fullAmountSelected ? selectedFolio?.redemableAmount : parseInt(amount),
					dpNumber: $profileStore?.dpNumber,
					folioNumber: selectedFolio?.folioNumber,
					quantity: fullAmountSelected
						? selectedFolio?.redemableUnits
						: parseFloat(getCappedUnitString(numberOfUnits?.toString(), 3)),
					redeemAll: fullAmountSelected,
					schemeCode: folioHolding?.schemeCode,
					toSchemeCode: switchInFund?.schemeCode,
					transactionType: 'SWITCH',
					edisExecuteDate: '',
					isin: folioHolding?.isin,
					toIsin: switchInFund?.isin,
					dpFlag: selectedFolio?.dpFlag,
					emailId: orderPostData?.emailId,
					mobileNo: orderPostData?.mobileNo?.slice(3),
					poaStatus: isPoaActive
				})
			});

			if (
				res?.ok &&
				res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS &&
				res?.data?.data?.orderId !== undefined
			) {
				const params = encodeObject({
					orderID: res?.data?.data?.orderId,
					isSwitch: true
				});

				goto(`${base}/ordersummary?params=${params}`, {
					replaceState: true
				});
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
		}
	};

	const handleConfirmSwitch = () => {
		if (interAmcFlag && !showInterAmcPopup) {
			showInterAmcPopup = true;
		} else {
			if (showInterAmcPopup) {
				toggleInterAMCPopup();
			}
			if (selectedFolio?.dpFlag?.toUpperCase() === 'Y') {
				if (isPoaActive) {
					postSwitchOrder();
				} else {
					toggleTpinVerificationModal();
				}
			} else if (selectedFolio?.dpFlag?.toUpperCase() === 'N') {
				toggleOtpVerificationModal();
			}
			const eventMetaData = {
				SwitchOutFund: folioHolding?.schemeName,
				SwitchinFund: switchInFund?.schemeName,
				SwitchAmount: amount,
				Units: numberOfUnits
			};
			finalSwitchConfirmationAnalytics(eventMetaData);
		}
	};
	const toggleInterAMCPopup = () => {
		showInterAmcPopup = !showInterAmcPopup;
	};

	const interAmcRedeemOrder = async (switchRefNo: string, orderPostData?: IOrderPostData) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;
		const res = await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': requestId,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				amount: fullAmountSelected ? selectedFolio?.redemableAmount : parseInt(amount),
				emailId: orderPostData?.emailId,
				mobileNo: orderPostData?.mobileNo?.slice(3),
				dpNumber: $profileStore?.dpNumber,
				folioNumber: selectedFolio?.folioNumber,
				quantity: fullAmountSelected
					? selectedFolio?.redemableUnits
					: parseFloat(getCappedUnitString(numberOfUnits?.toString(), 3)),
				redeemAll: fullAmountSelected,
				remarks: '',
				schemeCode: folioHolding?.schemeCode,
				subBrokerCode: '',
				transactionType: 'REDEEM',
				bankAccountNo: bankAccountNo,
				edisExecuteDate: orderPostData?.edisExecDate,
				bankName: bankName,
				poaStatus: isPoaActive,
				dpFlag: selectedFolio?.dpFlag,
				isin: selectedFolio?.isin,
				switchRefNumber: switchRefNo
			})
		});
		return res;
	};

	const interAmcPurchaseOrder = async (switchRefNo: string) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;

		const res = await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				amount: fullAmountSelected
					? Math.floor(selectedFolio?.redemableAmount)
					: Math.floor(parseInt(amount)),
				bankAccountNo: mandateDetails?.accountNo,
				bankName: mandateDetails?.bankName,
				mandateType: mandateDetails?.mandateType,
				mandateId: mandateDetails?.mandateId,
				dpNumber: $profileStore?.dpNumber,
				emailId: $profileStore?.clientDetails?.email,
				mobileNo: $profileStore?.mobile,
				poaStatus: isPoaActive,
				schemeCode: switchInFund?.schemeCode,
				subBrokerCode: $profileStore?.clientDetails?.subBroker,
				transactionType: 'PURCHASE',
				isAdditional: false,
				switchRefNumber: switchRefNo
			})
		});
		return res;
	};

	const setEdisPoaStatus = async () => {
		const url = `${window?.location?.origin}${base}/api/GetTPINStatusMF`;
		const body = JSON.stringify({
			ClientCode: $profileStore?.clientId
		});
		isPoaActive = await getEdisPoaStatus(url, body, uuid);
	};

	onMount(() => {
		setEdisPoaStatus();
	});

	export let folioHolding: FolioHoldingType;
	export let switchInFund: SchemeDetails;
	export let selectedFolio: FolioObject;
	export let folioListLength: number;
	export let numberOfUnits: number;
	export let amount: string;
	export let fullAmountSelected: boolean;
	export let appsource = '';
	export let requestId = '';
	export let interAmcFlag = false;
	export let bankAccountNo = '';
	export let bankName = '';
	export let mandateDetails: IMandateDetails;
</script>

<SwitchOrderTitleCard
	switchOutSchemeName={folioHolding?.schemeName}
	switchOutLogo={folioHolding?.logoUrl}
	switchInSchemeName={switchInFund?.schemeName}
	switchInLogo={switchInFund?.logoUrl}
	class="md:flex-col"
	orderTileClass="md:w-full !bg-background-alt !border-border"
	switchInSchemeNameClass="!font-normal !text-title"
	switchOutSchemeNameClass="!font-normal !text-title"
>
	<svelte:fragment slot="switchOut">
		<SwitchOrderTile
			logoUrl={folioHolding?.logoUrl}
			schemeName={folioHolding?.schemeName}
			orderTypeText="SWITCH OUT"
			orderTypeBgColor="bg-tint12-secondary !text-title"
			schemeNameClass={'!font-normal !text-title'}
		/>
	</svelte:fragment>

	<svelte:fragment slot="switchIn">
		<SwitchOrderTile
			logoUrl={switchInFund?.logoUrl}
			schemeName={switchInFund?.schemeName}
			orderTypeText="SWITCH IN"
			orderTypeBgColor="bg-tint12-secondary-alt !text-title"
			schemeNameClass={'!font-normal !text-title'}
		/>
	</svelte:fragment>
	<svelte:fragment slot="switchIcon">
		<div class="z-20 -my-1 flex max-h-0 items-center self-center">
			<WMSIcon
				height={40}
				width={40}
				name="chevron-down"
				background="var(--BACKGROUND-ALT)"
				border="var(--BORDER)"
				storke="var(--PRIMARY)"
			/>
		</div>
	</svelte:fragment>
</SwitchOrderTitleCard>
<section class="mt-3 rounded-lg bg-background-alt px-4 py-6 font-normal shadow-csm">
	<article class="pb-2 text-sm text-title">Switch Details</article>
	<article class="flex-col rounded-lg border">
		{#if folioListLength > 1}
			<article class="flex items-center justify-between border-b bg-background p-2">
				<div class="flex items-center justify-start">
					<span class="mr-1 text-xs text-body"> Folio </span>
				</div>
				<div class="text-sm text-title">
					#{selectedFolio?.folioNumber}
				</div>
			</article>
		{/if}
		<article class="flex items-center justify-between border-b p-2">
			<div class="flex items-center justify-start">
				<span class="mr-1 text-xs text-body"> Amount (Approximate) </span>
			</div>
			<div class="text-base text-title">
				₹{addCommasToAmountString(amount || 0)}
			</div>
		</article>
		<article class="flex items-center justify-between p-2">
			<div>
				<span class="mr-1 text-xs text-body"> Units </span>
			</div>
			<div class="text-base text-title">
				{numberOfUnits?.toFixed(3)}
			</div>
		</article>
	</article>
	{#if folioHolding?.sipEnabled === true}
		<article class="mt-2 pt-2">
			<SoSipContinuation switchOutFundName={folioHolding?.schemeName} />
		</article>
	{/if}
	<article class="mt-3 hidden sm:block">
		<ButtonMedium class="w-full" on:click={handleConfirmSwitch}>CONFIRM SWITCH</ButtonMedium>
	</article>
</section>

<article class="fixed inset-0 top-auto mx-2 my-4 block justify-end md:hidden">
	<ButtonMedium class="w-full" on:click={handleConfirmSwitch}>CONFIRM SWITCH</ButtonMedium>
</article>

{#if showTpinVerificationModal && !error.visible}
	<TpinVerification
		{uuid}
		folio={selectedFolio}
		quantity={numberOfUnits}
		redeemAll={fullAmountSelected}
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
		folio={selectedFolio}
		{amount}
		schemeName={folioHolding?.schemeName}
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
		class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
		handleButtonClick={closeErrorPopup}
		closeModal={closeErrorPopup}
		buttonTitle="TRY AGAIN"
		buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
		buttonVariant="contained"
	/>
{/if}

{#if interAmcFlag && showInterAmcPopup}
	<ModalWithAnimation isModalOpen={showInterAmcPopup} closeModal={toggleInterAMCPopup}>
		<div
			class="flex w-screen flex-col items-center rounded-b-none rounded-t-2xl bg-background-alt px-4 py-4 shadow-csm sm:!w-[875px] md:rounded-lg"
		>
			<InterAmcSwitchCue />
			<div class="w-full pt-4 sm:w-[375px]">
				<ButtonMedium class="w-full sm:w-[375px]" on:click={handleConfirmSwitch}
					>PROCEED</ButtonMedium
				>
			</div>
		</div>
	</ModalWithAnimation>
{/if}
