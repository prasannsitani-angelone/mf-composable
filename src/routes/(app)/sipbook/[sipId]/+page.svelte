<script lang="ts">
	import InvalidUrl from '$components/Error/InvalidUrl.svelte';
	import NudgeComponent from '$components/Nudge/NudgeComponent.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getBankLogoUrl } from '$lib/utils';
	import SipBankDetails from '../SipDetails/SipBankDetails.svelte';
	import SipDate from '../SipDetails/SipDate.svelte';
	import SipDetailsBasic from '../SipDetails/SipDetailsBasic.svelte';
	import SipHistory from '../SipDetails/SipHistory.svelte';
	import SipSchedule from '../SipDetails/SipSchedule.svelte';
	import type { PageData } from './$types';
	import HexagonalYellowWarningIcon from '$lib/images/icons/HexagonalYellowWarningIcon.svelte';
	import Button from '$components/Button.svelte';
	import Modal from '$components/Modal.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	const bankDetails = profileStore?.bankAccounts();
	let showCancelSipActionModal = false;
	let showSuccessModal = false;
	let showFailureModal = false;
	const maxTransactionsCap = 6;

	const toggleShowCancelSipActionModal = () => {
		showCancelSipActionModal = !showCancelSipActionModal;
	};

	const toggleShowSuccessModal = () => {
		showSuccessModal = !showSuccessModal;
	};

	const toggleShowFailureModal = () => {
		showFailureModal = !showFailureModal;
	};

	const handleCancelSip = async () => {
		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${data?.sipId}`;
		const res = await useFetch(sipUrl, { method: 'DELETE' });
		toggleShowCancelSipActionModal();
		if (res.ok && res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			toggleShowSuccessModal();
		} else {
			toggleShowFailureModal();
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
		<SipDetailsBasic
			sipId={sipData?.sipId}
			schemeName={sipData?.schemeName}
			schemePlan={sipData?.schemePlan}
			logoUrl={sipData?.logoUrl}
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

		{#if sipData?.sipOrderHistory?.length}
			<SipHistory
				sipId={sipData?.sipId}
				sipOrderHistory={sipData?.sipOrderHistory}
				sipCreatedTs={sipData?.createdTs}
				maxTxnShowCount={maxTransactionsCap}
			/>
		{/if}
		{#if !sipData?.sipOrderHistory?.length && !sipData?.firstOrderToday && sipData?.createdTs}
			<SipDate sipCreatedTs={sipData?.createdTs} />
		{/if}
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

		<article class="mx-3 mt-4 block">
			<section class="fixed inset-0 top-auto bg-white px-4 py-3">
				<Button
					size="md"
					variant="transparent"
					class={`bottom-0  w-full ${
						sipData?.isSipInprocess
							? '!cursor-not-allowed !border !border-solid border-grey-disabled !bg-white !text-grey-disabled'
							: ''
					}`}
					onClick={toggleShowCancelSipActionModal}
				>
					CANCEL SIP
				</Button>
			</section>
		</article>

		<Modal closeModal={toggleShowCancelSipActionModal} isModalOpen={showCancelSipActionModal}>
			<section
				class="animate-bottomTransition flex w-screen flex-col rounded-t-2xl rounded-b-none bg-white shadow-csm md:w-120 md:animate-none md:rounded-lg"
			>
				<div class="flex items-center justify-between px-4 pt-6 pb-4 md:py-6 md:px-8">
					<span class="text-lg font-normal text-black-title md:text-xl"> Cancel SIP? </span>
				</div>

				<section class="px-4 pt-0 pb-6 text-sm md:px-8 md:pt-6">
					<p class="font-normal text-grey-body">
						Cancelling will stop <span class="font-semibold">ALL</span> your upcoming investments in
						this SIP. Proceed to cancel?
					</p>
				</section>

				<section class="px-4 pt-0 pb-6 text-sm md:px-8 md:pt-6">
					<article class="flex items-center justify-end text-sm font-semibold text-blue-primary">
						<Button
							variant="transparent"
							size="sm"
							class="mr-2 p-2"
							onClick={toggleShowCancelSipActionModal}
						>
							NO
						</Button>

						<Button variant="transparent" size="sm" class="p-2" onClick={handleCancelSip}>
							YES, CANCEL
						</Button>
					</article>
				</section>
			</section>
		</Modal>

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
	{:else}
		<InvalidUrl />
	{/if}
{:catch}
	<InvalidUrl />
{/await}
