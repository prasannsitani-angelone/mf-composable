<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import type { FolioObject } from '$lib/types/IInvestments';
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';
	import { createEventDispatcher, getContext } from 'svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { addCommasToAmountString, getCappedUnitString } from '$lib/utils/helpers/formatAmount';
	import { goto } from '$app/navigation';
	import type { UtilsMetaData } from '$lib/types/IRedemption';
	import { WMSIcon } from 'wms-ui-component';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import Button from '$components/Button.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import BankSelectionPopup from '$components/BankSelectionPopup.svelte';
	import BankAccountTile from '$components/BankAccountTile.svelte';
	import LoadingPopup from '../InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import TpinVerification from '$components/TpinFlow/TpinVerification.svelte';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { base } from '$app/paths';
	import type { AppContext } from '$lib/types/IAppContext';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';

	// export let holdingDetails: FolioHoldingType;
	export let bankAccounts: Array<BankDetailsEntity>;
	export let selectedAccount: number;
	export let withdrawalAmount: string;
	export let numberOfUnits: number;
	export let folioData: FolioObject;
	export let utilsMetaData: UtilsMetaData;
	export let redeemAll: boolean;

	const dispatch = createEventDispatcher();

	const appContext: AppContext = getContext('app');

	const closeConfirmationScreen = () => {
		dispatch('closeWithdrawalConfirmationScreen');
	};

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
		selectedAccount = index;
		selectedBankAccount = bankAccounts[selectedAccount];
	};

	const withdrawableAmountInfoTagClick = () => {
		showWithdrawableAmountTooltip = !showWithdrawableAmountTooltip;
	};

	const expectedNavDateInfoTagClick = () => {
		expectedNavDateTooltip = !expectedNavDateTooltip;
	};

	const toggleTpinVerificationModal = () => {
		showTpinVerificationModal = !showTpinVerificationModal;
	};

	const toggleOtpVerificationModal = () => {
		showOtpVerificationModal = !showOtpVerificationModal;
	};

	const postRedemptionOrder = async (edisExecDate?: string) => {
		showLoading('Placing Withdrawal Order');
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;

		const res = await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				amount: redeemAll ? folioData?.redemableAmount : parseInt(withdrawalAmount),
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
				edisExecuteDate: edisExecDate,
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
			const baseUrl = `${getNavigationBaseUrl(base, appContext?.scheme, appContext?.host)}`;
			const path = `/orders/redeem/${res?.data?.data?.orderId}`;
			goto(`${baseUrl}${path}`);
		} else {
			error.visible = true;
			error.heading = 'Order Failed';
			error.subHeading = res?.data?.message || 'Something went wrong';
			stopLoading();
		}
	};

	const handleConfirmAndWithdraw = () => {
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
</script>

<section class="mt-0 {$$props?.class}">
	<section class="rounded-lg bg-white shadow-csm md:border">
		<article class="hidden items-center justify-start border-b p-4 md:flex">
			<WMSIcon
				width={16}
				height={16}
				name="left-arrow"
				class="mr-2 cursor-default md:cursor-pointer"
				on:click={closeConfirmationScreen}
			/>
			<span class="text-base font-medium text-black-title"> Confirm Your Withdrawal </span>
		</article>
		<article class="mb-3 pb-1 md:mb-0 md:pb-0">
			<div class="mx-3 mt-2 mb-2 pt-2 text-sm font-medium text-black-title md:mt-4 md:pt-0">
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
								class="cursor-default text-sm font-semibold !uppercase text-blue-primary md:cursor-pointer"
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

	<section class="-mt-1 rounded-lg bg-white pb-0.5 md:mt-4 md:border md:pb-0">
		<article class="border-b p-4 pl-3">
			<span class="text-base font-medium text-black-title"> Withdrawal Summary </span>
		</article>
		<article>
			<article class="mx-3 my-4 flex items-center justify-between">
				<div class="flex items-center justify-start">
					<span class="mr-1 text-sm font-medium text-grey-body"> Withdrawal Amount (Approx) </span>
					<WMSIcon
						width={16}
						height={16}
						name="info-in-circle"
						class="cursor-default md:cursor-pointer"
						on:click={withdrawableAmountInfoTagClick}
					/>
				</div>
				<div class="text-base font-medium text-black-title">
					₹{addCommasToAmountString(withdrawalAmount)}
				</div>
			</article>
			<article class="mx-3 my-4 flex items-center justify-between">
				<div>
					<span class="mr-1 text-sm font-medium text-grey-body"> Number of Units </span>
				</div>
				<div class="text-base font-medium text-black-title">
					{numberOfUnits?.toFixed(3)}
				</div>
			</article>
			<article class="mx-3 my-4 flex items-center justify-between">
				<div class="flex items-center justify-start">
					<span class="mr-1 text-sm font-medium text-grey-body"> Expected NAV Date </span>
					<WMSIcon
						width={16}
						height={16}
						name="info-in-circle"
						class="cursor-default md:cursor-pointer"
						on:click={expectedNavDateInfoTagClick}
					/>
				</div>
				<div class="text-base font-medium text-black-title">
					{getDateTimeString(utilsMetaData?.expectedNavDate * 1000, 'DATE', true)}
				</div>
			</article>
		</article>
	</section>

	<section class="mt-3 flex flex-col items-center justify-center pb-5">
		<article class="mb-1 flex items-center justify-start text-xs font-medium text-grey-body">
			<WMSIcon width={16} height={16} name="clock-bold" class="mr-1" />
			<span> Estimated Credit Date </span>
		</article>
		<article class="text-base font-medium text-black-title">
			{getDateTimeString(utilsMetaData?.estimatedCompletionDate * 1000, 'DATE', true)}
		</article>
	</section>

	<article class="mt-3 hidden md:block">
		<Button class="w-full rounded" onClick={handleConfirmAndWithdraw}>CONFIRM AND WITHDRAW</Button>
	</article>

	<!-- Withdraw button for Mobile UI -->
	<article class="mx-3 mt-4 block md:hidden">
		<section class="fixed inset-0 top-auto bg-white px-4 py-3">
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
	{#if showTpinVerificationModal}
		<TpinVerification
			{uuid}
			folio={folioData}
			quantity={numberOfUnits}
			{redeemAll}
			on:tpinVerificationSuccessful={(e) => postRedemptionOrder(e?.detail)}
			on:closeModal={toggleTpinVerificationModal}
		/>
	{/if}

	<!-- 2FA (OTP) Verification Process -->
	<!-- <InvestRedeemRedemptionPadOtpVerificationVerifyOrderWithOtp
    v-if="showOtpVerificationModal"
    :uuid="uuid"
    :amount="withdrawalAmount"
    :folio="folioData"
    :quantity="numberOfUnits"
    :redeem-all="redeemAll"
    :selected-bank-account="selectedBankAccount"
    :scheme-name="holdingDetails?.schemeName"
    @close-otp-modal="toggleOtpVerificationModal"
  /> -->

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
</section>
