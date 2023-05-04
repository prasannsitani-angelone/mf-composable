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
	import {
		getDateTimeProperties,
		getDateTimeString,
		getNextMonthDate
	} from '$lib/utils/helpers/date';
	import SipDetailLoader from './SipDetailLoader.svelte';
	import {
		cancelSipButtonClickAnalytics,
		sipCancelConfirmationModalOpenAnalytics,
		sipCancelFailureModalRetryButtonClickAnalytics,
		sipCancelledFailureModalOpenAnalytics,
		sipCancelledSuccessModalDoneButtonClickAnalytics,
		sipCancelledSuccessModalOpenAnalytics
	} from '$lib/analytics/sipbook/sipbook';
	$: bankDetails = $profileStore?.bankDetails;
	let showCancelSipActionModal = false;
	let showSuccessModal = false;
	let showFailureModal = false;
	let showSkipModal = false;
	let showSkipSuccessModal = false;
	let showSkipFailureModal = false;
	$: bottomHeight = 128;
	$: historyToggled = false;
	const maxTransactionsCap = 6;

	const toggleShowCancelSipActionModal = () => {
		showCancelSipActionModal = !showCancelSipActionModal;
		if (showCancelSipActionModal) {
			cancelSipButtonClickAnalytics();
			sipCancelConfirmationModalOpenAnalytics({
				value:
					'Cancelling will stop ALL your upcoming investments in this SIP, Proceed to Cancel? (YES CANCEL)/(NO)'
			});
		}
	};

	const toggleShowSuccessModal = () => {
		showSuccessModal = !showSuccessModal;
		if (showSuccessModal) {
			sipCancelledSuccessModalOpenAnalytics();
		}
	};

	const toggleSkipSuccessModal = () => {
		showSkipSuccessModal = !showSkipSuccessModal;
	};

	const toggleSkipFailureModal = () => {
		showSkipFailureModal = !showSkipFailureModal;
	};

	const toggleShowFailureModal = () => {
		showFailureModal = !showFailureModal;
		if (showFailureModal) {
			sipCancelledFailureModalOpenAnalytics({
				value: 'We could not cancel your SIP due to technical error, Please try again.'
			});
		}
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

	const handleSkipSip = async (nextSipDueDate: number) => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${data?.sipId}`;
		const res = await useFetch(sipUrl, {
			method: 'PATCH',
			body: {
				action: 'skip',
				nextSipDueDate: nextSipDueDate
			}
		});
		toggleShowSkipModal();
		if (res.ok && res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			toggleSkipSuccessModal();
		} else {
			toggleSkipFailureModal();
		}
	};

	const handleFailureModalCta = () => {
		toggleShowFailureModal();
		sipCancelFailureModalRetryButtonClickAnalytics();
	};

	const handleHistoryToggled = (e: { detail: boolean }) => {
		historyToggled = e.detail;
	};

	const handleSuccessModalCta = () => {
		toggleShowSuccessModal();
		sipCancelledSuccessModalDoneButtonClickAnalytics();
		goto(`${base}/orders/orderspage/sipbook`);
	};
	export let data: PageData;
</script>

{#await data?.api?.getSipData}
	<SipDetailLoader />
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
				on:historyToggled={handleHistoryToggled}
			/>

			<section
				style={`bottom: ${bottomHeight}px`}
				class={`w-full ${!historyToggled ? `!fixed inset-x-0 px-2` : ''}`}
			>
				{#if sipData?.isSipInprocess}
					<NudgeComponent
						nudgeText="Your SIP order is already in progress. Skip and cancel are not available."
						nudgeClasses={`m-4 ${!historyToggled ? `mb-2` : ''}`}
					>
						<svelte:fragment slot="nudgeIcon">
							<HexagonalYellowWarningIcon class="mr-3" />
						</svelte:fragment>
					</NudgeComponent>
				{/if}

				{#if sipData?.installmentSkip}
					<NudgeComponent
						nudgeText="You have already skipped your next SIP instalment."
						nudgeClasses={`m-4 ${!historyToggled ? `mb-2` : ''}`}
					>
						<svelte:fragment slot="nudgeIcon">
							<HexagonalYellowWarningIcon class="mr-3" />
						</svelte:fragment>
					</NudgeComponent>
				{/if}

				{#if sipData?.isSipPaymentNudge}
					<NudgeComponent
						nudgeText={`Please complete the payment for your current SIP instalment. Skip will be available after ${getDateTimeString(
							sipData?.sipAmountPayTillDate,
							'DATE',
							true
						)}.`}
						nudgeClasses={`m-4 ${!historyToggled ? `mb-2` : ''}`}
					>
						<svelte:fragment slot="nudgeIcon">
							<HexagonalYellowWarningIcon class="mr-3" />
						</svelte:fragment>
					</NudgeComponent>
				{/if}
			</section>

			<section
				bind:offsetHeight={bottomHeight}
				class="fixed inset-0 top-auto block bg-white px-4 py-3 md:hidden"
			>
				{#if sipData?.sipType === 'SIP'}
					{@const isSkipSipDisabled =
						sipData?.isSipInprocess ||
						sipData?.installmentSkip ||
						sipData?.isSipPaymentNudge ||
						false}
					<Button
						size="md"
						variant={`${isSkipSipDisabled ? 'outlined' : 'contained'}`}
						class={`mb-2 w-full ${
							isSkipSipDisabled
								? 'pointer-events-none !cursor-not-allowed border-grey-disabled !bg-white !text-grey-disabled'
								: ''
						}`}
						onClick={toggleShowSkipModal}>SKIP NEXT INSTALMENT</Button
					>
				{/if}
				<Button
					size="md"
					variant="transparent"
					class={`bottom-0  w-full ${
						sipData?.isSipInprocess
							? 'pointer-events-none !cursor-not-allowed !bg-white !text-grey-disabled'
							: ''
					}`}
					onClick={toggleShowCancelSipActionModal}
				>
					CANCEL SIP
				</Button>
			</section>

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
				confirm={() => handleSkipSip(sipData?.nextSipDueDate)}
				titleClass="!font-medium"
				title="Skip Next SIP Instalment?"
				confirmButtonTitle="YES, SKIP"
			>
				<svelte:fragment slot="body">
					<p class="font-normal text-grey-body">
						Your SIP instalment <span class="font-medium text-black-title"
							>for {getDateTimeProperties(sipData?.nextSipDueDate).month}
							{getDateTimeProperties(sipData?.nextSipDueDate).year}</span
						> will be skipped. Skip instalment?
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
				buttonTitle="DONE"
				class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-blue-primary rounded !bg-white !text-blue-primary cursor-default md:cursor-pointer"
				handleButtonClick={() => window.location.reload()}
			>
				<svelte:fragment slot="popupBody">
					<article class="mt-6 text-center">
						<div class={`text-2xl font-medium text-black-title`}>SIP Instalment Skipped</div>

						<div class={`mt-3 text-sm font-normal text-grey-body`}>
							Your SIP instalment for {sipData?.schemeName}
							<span class="font-medium text-black-title"
								>for {getDateTimeProperties(sipData?.nextSipDueDate).month}
								{getDateTimeProperties(sipData?.nextSipDueDate).year}</span
							>
							will be skipped. Next SIP order is scheduled for {getNextMonthDate(
								sipData?.nextSipDueDate
							)}
						</div>
					</article>
				</svelte:fragment>
			</ResultPopup>

			<ResultPopup
				closeModal={toggleSkipFailureModal}
				isModalOpen={showSkipFailureModal}
				popupType={STATUS_ARR.FAILURE}
				title="Something Went Wrong"
				text="We could not process your skip request due to a technical error. Please try again"
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
