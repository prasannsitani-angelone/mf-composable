<script lang="ts">
	import { page } from '$app/stores';
	import { SEO } from 'svelte-components';
	import InvalidUrl from '$components/Error/InvalidUrl.svelte';
	import type { PageData } from './$types';
	import { useFetch } from '$lib/utils/useFetch';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import CancelSip from '$components/Sip/CancelSip.svelte';
	import ConfirmationPopup from '$components/Popup/ConfirmationPopup.svelte';
	import {
		cancelSipButtonClickAnalytics,
		sipCancelConfirmationModalOpenAnalytics,
		sipCancelledSuccessModalOpenAnalytics,
		sipCancelledFailureModalOpenAnalytics,
		sipCancelledSuccessModalDoneButtonClickAnalytics,
		sipCancelFailureModalRetryButtonClickAnalytics,
		sipCancelStayInvestedButtonClickAnalytics
	} from '$lib/analytics/sipbook/sipbook';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import CancelSipLoader from '$components/Sip/CancelSipLoader.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';

	export let data: PageData;

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	onMount(() => {
		if (!isMobile && !isTablet) {
			goto(`${base}/sipbook/${data?.sipId}`);
		}
	});

	let showCancelSipActionModal = false;
	let disableConfirmCancelSip = false;
	let showSuccessModal = false;
	let showFailureModal = false;
	let selectedSipCancelReasonText = '';

	const toggleShowCancelSipActionModal = () => {
		showCancelSipActionModal = !showCancelSipActionModal;
		if (showCancelSipActionModal) {
			cancelSipButtonClickAnalytics({
				ReasonName: selectedSipCancelReasonText
			});
			sipCancelConfirmationModalOpenAnalytics({
				value:
					'Cancelling will stop ALL your upcoming investments in this SIP, Proceed to Cancel? (YES CANCEL)/(NO)'
			});
		}
	};

	const handleCancelSipClick = (reason = '') => {
		selectedSipCancelReasonText = reason;
		toggleShowCancelSipActionModal();
	};

	const handleStayInvestedClick = () => {
		history?.back();

		sipCancelStayInvestedButtonClickAnalytics();
	};

	const toggleShowSuccessModal = () => {
		showSuccessModal = !showSuccessModal;
		if (showSuccessModal) {
			sipCancelledSuccessModalOpenAnalytics();
		}
	};

	const toggleShowFailureModal = () => {
		showFailureModal = !showFailureModal;
		if (showFailureModal) {
			sipCancelledFailureModalOpenAnalytics({
				value: 'We could not cancel your SIP due to technical error, Please try again.'
			});
		}
	};

	const handleCancelSip = async () => {
		disableConfirmCancelSip = true;

		const sipUrl = `${PUBLIC_MF_CORE_BASE_URL}/sips/${data?.sipId}`;
		const res = await useFetch(sipUrl, {
			method: 'DELETE',
			headers: {
				'x-cancel-reason': selectedSipCancelReasonText
			}
		});

		toggleShowCancelSipActionModal();

		if (res.ok && res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			toggleShowSuccessModal();
		} else {
			toggleShowFailureModal();
		}

		disableConfirmCancelSip = false;
	};

	const handleFailureModalCta = () => {
		toggleShowFailureModal();
		sipCancelFailureModalRetryButtonClickAnalytics();
	};

	const handleSuccessModalCta = () => {
		toggleShowSuccessModal();
		sipCancelledSuccessModalDoneButtonClickAnalytics();
		goto(`${base}/sipbook/dashboard`);
	};
</script>

<article class="w-full">
	<SEO seoTitle="Cancel SIP | Angel One" seoDescription="Cancel SIP | Angel One" />
	{#await data?.api?.getSipData}
		<CancelSipLoader />
	{:then sipData}
		{#if sipData}
			<CancelSip
				instalmentAmount={sipData?.installmentAmount}
				categoryName={sipData?.category}
				subCategoryName={sipData?.subCategory}
				on:cancelSipClick={(e) => handleCancelSipClick(e?.detail)}
				on:stayInvestedClick={handleStayInvestedClick}
			/>

			<!--SIP Cancel Confirmation Modal -->
			<ConfirmationPopup
				closeModal={toggleShowCancelSipActionModal}
				isModalOpen={showCancelSipActionModal}
				confirm={handleCancelSip}
				title="Cancel SIP?"
				confirmButtonDisable={disableConfirmCancelSip}
				confirmButtonTitle="YES, CANCEL"
			/>

			<!-- SIP Cancel Success Popup -->
			<ResultPopup
				closeModal={toggleShowSuccessModal}
				isModalOpen={showSuccessModal}
				popupType={STATUS_ARR.SUCCESS}
				title="SIP Cancelled"
				text={`You have cancelled your SIP for ${sipData?.schemeName}`}
				buttonTitle="DONE"
				class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-primary rounded !bg-background-alt !text-primary cursor-default md:cursor-pointer"
				handleButtonClick={handleSuccessModalCta}
			/>

			<!-- SIP Cancel Failure Popup -->
			<ResultPopup
				closeModal={toggleShowFailureModal}
				isModalOpen={showFailureModal}
				popupType={STATUS_ARR.FAILURE}
				title="Cancellation Error"
				text="We could not cancel your SIP due to a tecnhical error. Please try again"
				buttonTitle="RETRY"
				class="w-full rounded-b-none rounded-t-2xl p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
				buttonClass="mt-8 w-40 border border-primary rounded !bg-background-alt !text-primary cursor-default md:cursor-pointer"
				handleButtonClick={handleFailureModalCta}
			/>
		{:else}
			<InvalidUrl />
		{/if}
	{:catch}
		<InvalidUrl />
	{/await}
</article>
