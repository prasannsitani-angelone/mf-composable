<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import type { FolioHoldingType, FolioObject } from '$lib/types/IInvestments';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import { createEventDispatcher } from 'svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { addCommasToAmountString, getCappedUnitString } from '$lib/utils/helpers/formatAmount';
	import { goto } from '$app/navigation';
	import type { UtilsMetaData } from '$lib/types/IRedemption';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import Button from '$components/Button.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import BankAccountTile from '$components/BankAccountTile.svelte';
	import LoadingPopup from '../InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import TpinVerification from '$components/TpinFlow/TpinVerification.svelte';
	import { base } from '$app/paths';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import OtpVerification from '$components/OtpFlow/OtpVerification.svelte';
	import type { IOrderPostData } from '$lib/types/IOrderPostData';
	import {
		authFailedModalOpenAnalytics,
		authFailedRetryClickAnalytics,
		changeBankAccountAnalytics,
		confirmWithdrawButtonAnalytics,
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
		verifyWithOtpProceedButtonAnalytics,
		withdrawInfoAnalytics
	} from '$lib/analytics/redemption/redemption';
	import { page } from '$app/stores';
	import { encodeObject } from '$lib/utils/helpers/params';

	export let holdingDetails: FolioHoldingType;
	export let bankAccounts: Array<BankDetailsEntity>;
	export let selectedAccount: number;
	export let withdrawalAmount: string;
	export let numberOfUnits: number;
	export let folioData: FolioObject;
	export let utilsMetaData: UtilsMetaData;
	export let redeemAll: boolean;

	const dispatch = createEventDispatcher();

	const closeConfirmationScreen = () => {
		dispatch('closeWithdrawalConfirmationScreen');
	};

	const { requestId = '', isExternal = false } = $page.data.urlSource;

	let showBankDropdown = false;
	let selectedBankAccount = bankAccounts[selectedAccount];
	let showWithdrawableAmountTooltip = false;
	let expectedNavDateTooltip = false;
	let showTpinVerificationModal = false;
	let showOtpVerificationModal = false;

	let uuid = uuidv4();

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
		error.visible = false;
		error.heading = '';
		error.subHeading = '';

		uuid.value = uuidv4();
	};

	const showLoading = (heading: string) => {
		loadingState.isLoading = true;
		loadingState.heading = heading;
	};

	const stopLoading = () => {
		loadingState.isLoading = false;
		loadingState.heading = '';
	};

	const toggleBankDropdown = () => {
		showBankDropdown = !showBankDropdown;
	};

	const onAccountChange = (index: number) => {
		const previousBankAccount = selectedBankAccount;

		selectedAccount = index;
		selectedBankAccount = bankAccounts[selectedAccount];

		bankAccountChangeAnalyticsFunc(previousBankAccount, selectedBankAccount);
	};

	const withdrawableAmountInfoTagClick = () => {
		showWithdrawableAmountTooltip = !showWithdrawableAmountTooltip;

		if (showWithdrawableAmountTooltip) {
			withdrawInfoAnalytics();
		}
	};

	const expectedNavDateInfoTagClick = () => {
		expectedNavDateTooltip = !expectedNavDateTooltip;
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

	const postRedemptionOrder = async (orderPostData?: IOrderPostData) => {
		showLoading('Placing Withdrawal Order');
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;

		const res = await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': isExternal && requestId ? requestId : uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				amount: redeemAll ? folioData?.redemableAmount : parseInt(withdrawalAmount),
				emailId: orderPostData?.emailId,
				mobileNo: orderPostData?.mobileNo?.slice(3),
				dpNumber: $profileStore?.dpNumber,
				folioNumber: folioData?.folioNumber,
				quantity: redeemAll
					? folioData?.redemableUnits
					: parseFloat(getCappedUnitString(numberOfUnits?.toString(), 3)),
				redeemAll: redeemAll,
				remarks: '',
				schemeCode: folioData?.schemeCode,
				subBrokerCode: '',
				transactionType: 'REDEEM',
				bankAccountNo: selectedBankAccount?.accNO,
				edisExecuteDate: orderPostData?.edisExecDate,
				bankName: selectedBankAccount?.bankName,
				poaStatus: $profileStore?.poaStatus,
				dpFlag: folioData?.dpFlag,
				isin: folioData?.isin
			})
		});

		if (
			res?.ok &&
			res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS &&
			res?.data?.data?.orderId !== undefined
		) {
			const params = encodeObject({
				orderID: res?.data?.data?.orderId,
				isRedeem: true
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

	const handleConfirmAndWithdraw = () => {
		confirmWithdrawCtaAnalyticsFunc();

		if (folioData?.dpFlag?.toUpperCase() === 'Y') {
			if ($profileStore?.poaStatus?.toUpperCase() === 'I') {
				toggleTpinVerificationModal();
			} else if ($profileStore?.poaStatus?.toUpperCase() === 'A') {
				postRedemptionOrder();
			}
		} else if (folioData?.dpFlag?.toUpperCase() === 'N') {
			toggleOtpVerificationModal();
		}
	};

	const confirmWithdrawCtaAnalyticsFunc = () => {
		const eventMetadata = {
			FundName: holdingDetails?.schemeName,
			CurrentValue: parseFloat(holdingDetails?.currentValue?.toFixed(2)),
			TotalInvestment: parseFloat(holdingDetails?.investedValue?.toFixed(2)),
			TotalReturns: parseFloat(holdingDetails?.returnsValue?.toFixed(2)),
			ReturnsPercentage: parseFloat(holdingDetails?.returnsAbsolutePer?.toFixed(2)),
			Amount: parseFloat(withdrawalAmount),
			FolioNumber: folioData?.folioNumber,
			Value: parseFloat((folioData?.redemableAmount + folioData?.blockedAmount)?.toFixed(2)),
			Units: parseFloat((folioData?.redemableUnits + folioData?.blockedunits)?.toFixed(3)),
			WithdrawFullAmount: redeemAll ? 'Yes' : 'No'
		};

		confirmWithdrawButtonAnalytics(eventMetadata);
	};

	const bankAccountChangeAnalyticsFunc = (
		previousBankAccount: BankDetailsEntity,
		currentBankAccount: BankDetailsEntity
	) => {
		const eventMetadata = {
			CurrentBankSelected: previousBankAccount?.bankName,
			NextBankSelected: currentBankAccount?.bankName,
			isChangeBank: previousBankAccount?.accNO === currentBankAccount?.accNO ? 'No' : 'Yes'
		};

		changeBankAccountAnalytics(eventMetadata);
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
</script>

<section class="mt-0 {$$props?.class}">
	<section class="rounded-lg bg-background-alt shadow-csm md:border">
		<article class="hidden items-center justify-start border-b p-4 md:flex">
			<WMSIcon
				width={16}
				height={16}
				name="left-arrow"
				class="mr-2 cursor-default md:cursor-pointer"
				on:click={closeConfirmationScreen}
			/>
			<span class="text-base font-normal text-title"> Confirm Your Withdrawal </span>
		</article>
		<article class="mb-3 pb-1 md:mb-0 md:pb-0">
			<div class="mx-3 mb-2 mt-2 pt-2 text-sm font-normal text-title md:mt-4 md:pt-0">
				Credit to Account
			</div>

			<div class="m-3">
				<BankAccountTile
					bankLogo={selectedBankAccount?.bankLogo}
					bankName={selectedBankAccount?.bankName}
					bankAccount={selectedBankAccount?.accNO}
				>
					<svelte:fragment slot="rightSection">
						{#if bankAccounts?.length > 1}
							<Button
								variant="transparent"
								class="cursor-default text-sm font-medium !uppercase text-primary md:cursor-pointer"
								onClick={toggleBankDropdown}
							>
								Change
							</Button>
						{/if}
					</svelte:fragment>
				</BankAccountTile>
			</div>
		</article>
	</section>

	<section class="-mt-1 rounded-lg bg-background-alt pb-0.5 md:mt-4 md:border md:pb-0">
		<article class="border-b p-4 pl-3">
			<span class="text-base font-normal text-title"> Withdrawal Summary </span>
		</article>
		<article>
			<article class="mx-3 my-4 flex items-center justify-between">
				<div class="flex items-center justify-start">
					<span class="mr-1 text-sm font-normal text-body"> Withdrawal Amount (Approx) </span>
					<WMSIcon
						width={16}
						height={16}
						name="info-in-circle"
						fill="var(--BODY)"
						stroke="var(--BODY)"
						class="cursor-default md:cursor-pointer"
						on:click={withdrawableAmountInfoTagClick}
					/>
				</div>
				<div class="text-base font-normal text-title">
					₹{addCommasToAmountString(withdrawalAmount)}
				</div>
			</article>
			<article class="mx-3 my-4 flex items-center justify-between">
				<div>
					<span class="mr-1 text-sm font-normal text-body"> Number of Units </span>
				</div>
				<div class="text-base font-normal text-title">
					{numberOfUnits?.toFixed(3)}
				</div>
			</article>
			<article class="mx-3 my-4 flex items-center justify-between">
				<div class="flex items-center justify-start">
					<span class="mr-1 text-sm font-normal text-body"> Expected NAV Date </span>
					<WMSIcon
						width={16}
						height={16}
						name="info-in-circle"
						fill="var(--BODY)"
						stroke="var(--BODY)"
						class="cursor-default md:cursor-pointer"
						on:click={expectedNavDateInfoTagClick}
					/>
				</div>
				<div class="text-base font-normal text-title">
					{getDateTimeString(utilsMetaData?.expectedNavDate * 1000, 'DATE', true)}
				</div>
			</article>
		</article>
	</section>

	<section class="mt-3 flex flex-col items-center justify-center pb-5">
		<article class="mb-1 flex items-center justify-start text-xs font-normal text-body">
			<WMSIcon width={16} height={16} name="clock-bold" stroke="var(--TITLE)" class="mr-1" />
			<span> Estimated Credit Date </span>
		</article>
		<article class="text-base font-normal text-title">
			{getDateTimeString(utilsMetaData?.estimatedCompletionDate * 1000, 'DATE', true)}
		</article>
	</section>

	<article class="mt-3 hidden md:block">
		<Button class="w-full rounded" onClick={handleConfirmAndWithdraw}>CONFIRM AND WITHDRAW</Button>
	</article>

	<!-- Withdraw button for Mobile UI -->
	<article class="mx-3 mt-4 block md:hidden">
		<section class="fixed inset-0 top-auto bg-background-alt px-4 py-3">
			<Button class="bottom-0 h-12 w-full rounded" onClick={handleConfirmAndWithdraw}>
				CONFIRM WITHDRAW
			</Button>
		</section>
	</article>

	{#if showBankDropdown}
		<!-- Bank Account selection popup -->
		<BankSelectionPopup
			{bankAccounts}
			{selectedAccount}
			{onAccountChange}
			onClose={toggleBankDropdown}
		/>
	{/if}

	{#if showWithdrawableAmountTooltip}
		<!-- Withdrawable Amount Tooltip Modal -->
		<InfoModal
			showModal={showWithdrawableAmountTooltip}
			heading="Withdrawable Amount"
			detailText="Withdrawal amount may differ as exit load might be applicable as per AMC rules"
			on:crossClicked={withdrawableAmountInfoTagClick}
		/>
	{/if}

	{#if expectedNavDateTooltip}
		<!-- Expected NAV Date Tooltip Modal -->
		<InfoModal
			showModal={expectedNavDateTooltip}
			heading="Expected NAV Date"
			detailText="NAV date for withdrawal is subject to order being successful on BSE STAR before cut-off. Your actual NAV date may differ."
			on:crossClicked={expectedNavDateInfoTagClick}
		/>
	{/if}

	<!-- TPIN Verification Process -->
	{#if showTpinVerificationModal && !error?.visible}
		<TpinVerification
			{uuid}
			folio={folioData}
			quantity={numberOfUnits}
			{redeemAll}
			on:tpinVerificationSuccessful={(e) => postRedemptionOrder({ edisExecDate: e?.detail })}
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
			amount={withdrawalAmount}
			schemeName={holdingDetails?.schemeName}
			on:otpVerificationSuccessful={(e) =>
				postRedemptionOrder({ emailId: e?.detail?.emailId, mobileNo: e?.detail?.mobileNo })}
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
</section>
