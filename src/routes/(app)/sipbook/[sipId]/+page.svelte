<script lang="ts">
	import InvalidUrl from '$components/Error/InvalidUrl.svelte';
	import NudgeComponent from '$components/Nudge/NudgeComponent.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getBankLogoUrl } from '$lib/utils';
	import SipBankDetails from '../SipDetails/SipBankDetails.svelte';
	import SipDetailsBasic from '../SipDetails/SipDetailsBasic.svelte';
	import SipHistory from '../SipDetails/SipHistory.svelte';
	import SipSchedule from '../SipDetails/SipSchedule.svelte';
	import type { PageData } from './$types';
	import HexagonalYellowWarningIcon from '$lib/images/icons/HexagonalYellowWarningIcon.svelte';
	import Button from '$components/Button.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import ConfirmationPopup from '$components/Popup/ConfirmationPopup.svelte';
	import { getDateTimeProperties, getNextMonthDate } from '$lib/utils/helpers/date';
	$: bankDetails = $profileStore?.bankDetails;
	let showCancelSipActionModal = false;
	let showSuccessModal = false;
	let showFailureModal = false;
	let showSkipModal = false;
	let showSkipSuccessModal = false;
	let showSkipFailureModal = false;
	const maxTransactionsCap = 6;

	const toggleShowCancelSipActionModal = () => {
		showCancelSipActionModal = !showCancelSipActionModal;
	};

	const toggleShowSuccessModal = () => {
		showSuccessModal = !showSuccessModal;
	};

	const toggleSkipSuccessModal = () => {
		showSkipSuccessModal = !showSkipSuccessModal;
	};

	const toggleSkipFailureModal = () => {
		showSkipFailureModal = !showSkipFailureModal;
	};

	const toggleShowFailureModal = () => {
		showFailureModal = !showFailureModal;
	};

	const toggleShowSkipModal = () => {
		showSkipModal = !showSkipModal;
	};

	const handleCancelSip = async () => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${data?.sipId}`;
		const res = await useFetch(sipUrl, { method: 'DELETE' });
		toggleShowCancelSipActionModal();
		if (res.ok && res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			toggleShowSuccessModal();
		} else {
			toggleSkipFailureModal();
		}
	};

	const handleSkipSip = async () => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${data?.sipId}`;
		const res = await useFetch(sipUrl);
		toggleShowSkipModal();
		if (res.ok && res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			toggleSkipSuccessModal();
		} else {
			toggleSkipFailureModal();
		}
	};

	const handleFailureModalCta = () => {
		toggleShowFailureModal();
	};

	const handleSuccessModalCta = () => {
		toggleShowSuccessModal();
		goto(`${base}/orders/orderspage/sipbook`);
	};

	export let data: PageData;
</script>

{#await data?.api?.getSipData}
	Loading...
{:then sipData}
	{#if sipData}
		<article class="mb-36">
			<SipDetailsBasic
				sipId={sipData?.sipId}
				schemeName={sipData?.schemeName}
				schemePlan={sipData?.schemePlan}
				logoUrl={sipData?.logoUrl}
				isin={sipData?.isin}
				schemeCode={sipData?.schemeCode}
			/>
			<SipSchedule
				amount={sipData?.installmentAmount}
				nextSipDateTs={sipData?.nextSipDueDate}
				class="mt-2"
			/>

			{#if sipData?.accountNo}
				<SipBankDetails
					bankAccountNumber={sipData?.accountNo}
					bankName={sipData?.bankName}
					bankLogo={getBankLogoUrl(bankDetails, sipData?.accountNo)}
					class="mt-2"
				/>
			{/if}

			<SipHistory
				sipId={sipData?.sipId}
				sipOrderHistory={sipData?.sipOrderHistory}
				sipCreatedTs={sipData?.createdTs}
				maxTxnShowCount={maxTransactionsCap}
			/>
			{#if sipData?.isSipInprocess}
				<NudgeComponent
					nudgeText="You cannot cancel SIP as your SIP order is already in progress."
					nudgeClasses="m-4"
				>
					<svelte:fragment slot="nudgeIcon">
						<HexagonalYellowWarningIcon class="mr-3" />
					</svelte:fragment>
				</NudgeComponent>
			{/if}

			<article class="mx-3 mt-4 block md:hidden">
				<section class="fixed inset-0 top-auto bg-white px-4 py-3">
					{#if !sipData?.isSipInprocess}
						<Button size="md" class="mb-2 w-full" onClick={toggleShowSkipModal}
							>SKIP INSTALMENT</Button
						>
					{/if}
					<Button
						size="md"
						variant="transparent"
						class={`bottom-0  w-full ${
							sipData?.isSipInprocess
								? 'pointer-events-none !cursor-not-allowed !border !border-solid border-grey-disabled !bg-white !text-grey-disabled'
								: ''
						}`}
						onClick={toggleShowCancelSipActionModal}
					>
						CANCEL SIP
					</Button>
				</section>
			</article>

			<!-- CANCEL MODAL -->
			<ConfirmationPopup
				closeModal={toggleShowCancelSipActionModal}
				isModalOpen={showCancelSipActionModal}
				confirm={handleCancelSip}
				title="Cancel SIP?"
				confirmButtonTitle="YES, CANCEL"
			/>

			<!-- SKIP MODAL -->
			<ConfirmationPopup
				closeModal={toggleShowSkipModal}
				isModalOpen={showSkipModal}
				confirm={handleSkipSip}
				title="Skip SIP for next month?"
				confirmButtonTitle="YES, SKIP"
			>
				<svelte:fragment slot="body">
					<p class="font-normal text-grey-body">
						Your SIP will be skipped for next month and your next instalment of <span
							class="font-semibold"
							>{`${sipData?.installmentAmount} will take place on ${getNextMonthDate(
								sipData?.nextSipDueDate
							)}`}</span
						>
					</p>
				</svelte:fragment>
			</ConfirmationPopup>

			<!-- CANCEL MODAL SUCCESS FAILURE POPUPS -->
			<ResultPopup
				closeModal={toggleShowSuccessModal}
				isModalOpen={showSuccessModal}
				popupType={STATUS_ARR.SUCCESS}
				title="SIP Cancelled"
				text={`You have cancelled your SIP for ${sipData?.schemeName}`}
				buttonTitle="DONE"
				class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={handleSuccessModalCta}
			/>

			<ResultPopup
				closeModal={toggleShowFailureModal}
				isModalOpen={showFailureModal}
				popupType={STATUS_ARR.FAILURE}
				title="Cancellation Error"
				text="We could not cancel your SIP due to a tecnhical error. Please try again"
				buttonTitle="RETRY"
				class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={handleFailureModalCta}
			/>

			<!-- SKIP SIP MODAL SUCCESS FAILURE POPUPS -->
			<ResultPopup
				closeModal={toggleSkipSuccessModal}
				isModalOpen={showSkipSuccessModal}
				popupType={STATUS_ARR.SUCCESS}
				title="SIP Skipped"
				text={`You have skipped your SIP for SBI Gold Growth Direct Plan for the month of ${
					getDateTimeProperties(sipData?.nextSipDueDate).month
				}`}
				buttonTitle="DONE"
				class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={handleSuccessModalCta}
			/>

			<ResultPopup
				closeModal={toggleSkipFailureModal}
				isModalOpen={showSkipFailureModal}
				popupType={STATUS_ARR.FAILURE}
				title="Skip Error"
				text="We could not skip your SIP due to a tecnhical error. Please try again"
				buttonTitle="RETRY"
				class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={toggleSkipFailureModal}
			/>
		</article>
	{:else}
		<InvalidUrl />
	{/if}
{:catch}
	<InvalidUrl />
{/await}
