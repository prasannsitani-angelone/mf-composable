<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import BankAccountTile from '$components/BankAccountTile.svelte';
	import OtpVerification from '$components/OtpFlow/OtpVerification.svelte';
	import TpinVerification from '$components/TpinFlow/TpinVerification.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { NAV_DETAILS_WITHDRAWAL } from '$lib/constants/order';
	import DotIcon from '$lib/images/icons/DotIcon.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import type { FolioHoldingType } from '$lib/types/IInvestments';
	import type { UtilsMetaData } from '$lib/types/IRedemption';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { useFetch } from '$lib/utils/useFetch';
	import { Button, WMSIcon, addCommasToAmountString } from 'svelte-components';
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
	import { getCappedUnitString } from '$lib/utils/helpers/formatAmount';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import LoadingPopup from '$components/Payment/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import TncModal from '$components/TnC/TncModal.svelte';
	import { format } from 'date-fns';
	import { encodeObject } from '$lib/utils/helpers/params';

	let schemeData: SchemeDetails;
	let holdingDetails: FolioHoldingType;
	let params = {};
	export { schemeData, holdingDetails, params };

	let utilsMetaData: UtilsMetaData;
	let amount = params?.orderDetails?.amount;
	let swpType = params?.orderDetails?.swpType;
	let unit = params?.orderDetails?.unit;
	let noOfInstallment = params?.orderDetails?.noOfInstallment;
	let nextSwpDate = params?.orderDetails?.nextSwpDate;
	let startDate = params?.orderDetails?.startDate;
	let bankName = params?.bankDetails?.bankName;
	let bankAccountNo = params?.bankDetails?.bankAccountNo;
	let bankLogo = params?.bankDetails?.bankLogo;
	let redeemAll = false;
	let folioData = params?.folioDetails;
	folioData = { ...folioData, isin: params?.orderDetails?.isin };

	let showTncModal = false;
	let showExNavDateModal = false;
	let showSWPAmountTooltip = false;
	let showSWPUnitTooltip = false;
	let showTpinVerificationModal = false;
	let showOtpVerificationModal = false;

	let uuid = uuidv4();

	let is2FAClient = false;
	$: if (folioData?.dpFlag?.toUpperCase() === 'Y') {
		if ($profileStore?.poaStatus?.toUpperCase() === 'I') {
			is2FAClient = false;
		}
	} else if (folioData?.dpFlag?.toUpperCase() === 'N') {
		is2FAClient = true;
	}

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

	const closeErrorPopup = () => {
		showTpinVerificationModal = false;
		showOtpVerificationModal = false;

		error.visible = false;
		error.heading = '';
		error.subHeading = '';

		uuid = uuidv4();
	};

	const showLoading = (heading: string) => {
		loadingState.isLoading = true;
		loadingState.heading = heading;
	};

	const stopLoading = () => {
		loadingState.isLoading = false;
		loadingState.heading = '';
	};

	const toggleTncModal = () => {
		showTncModal = !showTncModal;
	};
	const toggleExpectedNavDateModal = () => {
		showExNavDateModal = !showExNavDateModal;
	};
	const toggleshowSWPAmountTooltip = () => {
		showSWPAmountTooltip = !showSWPAmountTooltip;
	};
	const toggleshowSWPUnitTooltip = () => {
		showSWPUnitTooltip = !showSWPUnitTooltip;
	};
	const toggleTpinVerificationModal = () => {
		showTpinVerificationModal = !showTpinVerificationModal;

		if (!showTpinVerificationModal) {
			tpinVerifiedModalGoBackClickAnalytics();
		}
	};
	const toggleOtpVerificationModal = () => {
		showOtpVerificationModal = !showOtpVerificationModal;
	};

	const verifyWithOtpModalOpenAnalyticsFunc = (e) => {
		const { maskedEmailId = '', maskedMobileNumber = '', folioNumber = '' } = e?.detail || {};

		const eventMetadata = {
			Message: `An OTP has been sent to ${maskedEmailId} and ${maskedMobileNumber} registered with the folio ${folioNumber}. Please enter the OTP to verify your order`
		};

		verifyWithOtpModalOpenAnalytics(eventMetadata);
	};
	const tpinVerifiedModalOpenAnalyticsFunc = () => {
		const eventMetadata = {
			Message: 'Your TPIN Verfied Successfully.'
		};

		tpinVerifiedModalOpenAnalytics(eventMetadata);
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

	const postSwpOrder = async (orderPostData?: IOrderPostData) => {
		showLoading('Placing SWP Order');
		const url = `${PUBLIC_MF_CORE_BASE_URL}/swps`;

		const res = await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': params?.orderDetails?.requestID,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				amount: Number(amount),
				installmentNo: params?.orderDetails?.noOfInstallment,
				quantity: parseFloat(getCappedUnitString(unit?.toString())),
				frequency: 'Monthly',
				schemeCode: schemeData?.schemeCode,
				isin: params?.orderDetails?.isin,
				redeemAll: false,
				bankAccountNo: bankAccountNo,
				bankName: bankName,
				folioNumber: params?.folioDetails?.folioNumber,
				dpNumber: $profileStore?.dpNumber,
				dpFlag: params?.folioDetails?.dpFlag,
				mobileNo: orderPostData?.mobileNo?.slice(3),
				emailId: orderPostData?.emailId,
				poaStatus: $profileStore?.poaStatus,
				edisExecuteDate: orderPostData?.edisExecDate,
				startDate: format(new Date(params?.orderDetails?.nextSwpDate), 'yyyy-MM-dd'),
				firstOrderToday: 'Y'
			})
		});

		if (
			res?.ok &&
			res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS &&
			res?.data?.data?.orderId !== undefined
		) {
			const params = encodeObject({
				orderID: res?.data?.data?.orderId,
				isSwp: true
			});

			goto(`${base}/ordersummary?params=${params}`, {
				replaceState: true
			});
		} else {
			error.visible = true;
			error.heading = 'Order Failed';
			error.subHeading = res?.data?.message || 'Something went wrong';
			stopLoading();
		}
	};

	const handleConfirmAndPlaceSwp = () => {
		if (folioData?.dpFlag?.toUpperCase() === 'Y') {
			if ($profileStore?.poaStatus?.toUpperCase() === 'I') {
				toggleTpinVerificationModal();
			} else if ($profileStore?.poaStatus?.toUpperCase() === 'A') {
				postSwpOrder();
			}
		} else if (folioData?.dpFlag?.toUpperCase() === 'N') {
			toggleOtpVerificationModal();
		}
	};
	const getUtilsMetaData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/utils/meta`;
		if (holdingDetails) {
			await useFetch(
				url +
					`?settlementType=${holdingDetails?.settlementType}` +
					`&schemeCode=${holdingDetails?.schemeCode}`
			).then(({ data }) => {
				utilsMetaData = data?.data;
			});
		}
	};

	getUtilsMetaData();
</script>

<section class="bg-background-alt md:rounded-lg">
	<div class="border-b px-6 py-4">SWP Details</div>
	<ResultItem data={schemeData}>
		<svelte:fragment slot="schemeInfo">
			{#if schemeData?.categoryName}
				<div class="flex items-center text-xs uppercase text-gray-500">
					{schemeData?.categoryName}
					{#if schemeData?.subcategoryName}
						<DotIcon class="mx-1" />
						<span class="h-4 w-36 truncate md:w-56">
							{schemeData?.subcategoryName}
						</span>
					{/if}
				</div>
			{/if}
		</svelte:fragment>
		<span slot="returns" />
	</ResultItem>
	<div class="border-y px-6 py-4">SWP Summary</div>
	<section class="px-6">
		<div class="flex items-center justify-between py-[10px]">
			<div class="text-sm text-body">Request Date</div>
			<div class="text-title">{format(new Date(), 'dd MMM yyyy')}</div>
		</div>
		<div class="flex items-center justify-between py-[10px]">
			<div class="text-sm text-body">SWP Type</div>
			<div class="capitalize text-title">{swpType}</div>
		</div>
		<div class="flex items-center justify-between py-[10px]">
			{#if swpType === 'amount'}
				<div class="flex items-center text-sm text-body">
					SWP Amount <WMSIcon
						width={16}
						height={16}
						name="info-in-circle"
						class="ml-1 cursor-default md:cursor-pointer"
						on:click={toggleshowSWPAmountTooltip}
					/>
				</div>
				<div class="text-title">₹{addCommasToAmountString(amount)}</div>
			{:else}
				<div class="flex items-center text-sm text-body">
					SWP Units <WMSIcon
						width={16}
						height={16}
						name="info-in-circle"
						class="ml-1 cursor-default md:cursor-pointer"
						on:click={toggleshowSWPUnitTooltip}
					/>
				</div>
				<div class="text-title">{unit?.toFixed(2)}</div>
			{/if}
		</div>
		<div class="flex items-center justify-between py-[10px]">
			<div class="flex items-center text-sm text-body">No. of Instalments</div>
			<div class="text-title">{noOfInstallment}</div>
		</div>
		<div class="flex items-center justify-between py-[10px]">
			<div class="flex items-center text-sm text-body">SWP Date</div>
			<div class="flex items-center text-title">
				<WMSIcon
					width={16}
					height={16}
					name="calander-icon"
					stroke="#2A394E"
					class="mr-1 cursor-default md:cursor-pointer"
				/>{startDate}
			</div>
		</div>
		{#if !is2FAClient}
			<div class="flex items-center justify-between py-[10px]">
				<div class="flex items-center text-sm text-body">Next SWP Date</div>
				<div class="flex items-center text-title">
					{nextSwpDate}
				</div>
			</div>
			<div class="flex items-center justify-between py-[10px]">
				<div class="flex items-center text-sm text-body">
					Expected NAV Date
					<WMSIcon
						height={16}
						width={16}
						class="ml-1 cursor-pointer"
						name="info-in-circle"
						on:click={toggleExpectedNavDateModal}
					/>
				</div>
				<div class="flex items-center text-title">
					{getDateTimeString(utilsMetaData?.expectedNavDate * 1000, 'DATE', true)}
				</div>
			</div>
		{/if}
	</section>
	<section class="border-t px-6 py-4">
		<div class="pb-4 font-normal text-title">Credit to Account</div>

		<div>
			<BankAccountTile {bankLogo} {bankName} bankAccount={String(bankAccountNo)} />
		</div>
		<section class="mt-3 flex flex-col items-center justify-center">
			<article class="mb-1 flex items-center justify-start text-xs font-normal text-body">
				<WMSIcon width={16} height={16} name="clock-bold" stroke="var(--TITLE)" class="mr-1" />
				<span> Estimated Credit Date </span>
			</article>
			<article class="text-base font-normal text-title">
				{getDateTimeString(utilsMetaData?.estimatedCompletionDate * 1000, 'DATE', true)}
			</article>
		</section>
	</section>

	<section
		class="fixed inset-0 top-auto bg-background-alt px-4 py-2 shadow-csm md:static md:relative md:inset-auto md:border-t md:border-border md:px-6 md:py-4 md:shadow-none"
	>
		<Button class="mb-2 w-full md:mb-4" onClick={handleConfirmAndPlaceSwp}>VERIFY ORDER</Button>
		<p class="text-center text-sm font-normal text-body">
			By proceeding, you accept AngelOne's <button
				class="font-medium text-primary md:cursor-pointer"
				on:click={toggleTncModal}>T&C</button
			>
		</p>
	</section>
</section>
<div class="h-24 md:hidden" />

{#if showSWPAmountTooltip}
	<!-- SWP Amount Tooltip Modal -->
	<InfoModal
		showModal={showSWPAmountTooltip}
		heading="SWP Amount"
		detailText="SWP amount may differ as exit load might be applicable as per AMC rules"
		on:crossClicked={toggleshowSWPAmountTooltip}
	/>
{/if}
{#if showSWPUnitTooltip}
	<!-- SWP Unit Tooltip Modal -->
	<InfoModal
		showModal={showSWPUnitTooltip}
		heading="SWP Units"
		detailText="SWP units may differ as exit load might be applicable as per AMC rules"
		on:crossClicked={toggleshowSWPUnitTooltip}
	/>
{/if}

{#if showExNavDateModal}
	<!-- Expected NAV Date Tooltip Modal -->
	<InfoModal
		showModal={showExNavDateModal}
		heading="Expected NAV Date"
		detailText={NAV_DETAILS_WITHDRAWAL}
		on:crossClicked={toggleExpectedNavDateModal}
	/>
{/if}

{#if showTncModal}
	<!-- T&C Modal -->
	<TncModal showModal={showTncModal} on:closeModal={toggleTncModal} />
{/if}

<!-- TPIN Verification Process -->
{#if showTpinVerificationModal && !error?.visible}
	<TpinVerification
		{uuid}
		folio={folioData}
		quantity={unit}
		{redeemAll}
		on:tpinVerificationSuccessful={(e) => postSwpOrder({ edisExecDate: e?.detail })}
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

<!-- 2FA (OTP) Verification Process -->
{#if showOtpVerificationModal && !error?.visible}
	<OtpVerification
		{uuid}
		folio={folioData}
		{amount}
		schemeName={holdingDetails?.schemeName}
		on:otpVerificationSuccessful={(e) =>
			postSwpOrder({ emailId: e?.detail?.emailId, mobileNo: e?.detail?.mobileNo })}
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
