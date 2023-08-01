<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { page } from '$app/stores';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { useFetch } from '$lib/utils/useFetch';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import OtpVerification from '$components/OtpFlow/OtpVerification.svelte';
	import PageHeader from './PageHeader.svelte';
	import SchemeOverview from './SchemeOverview.svelte';
	import OrderDetails from './OrderDetails.svelte';
	import LoadingPopup from '$components/Payment/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import type { PageData } from './$types';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import type { IMandateDetails, IOrderDetails } from './type';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';
	import Button from '$components/Button.svelte';
	import FundDetailsLoader from '../../../schemes/[fund_name]/FundDetailsLoader/FundDetailsLoader.svelte';

	export let data: PageData;

	let showOtpVerificationModal = false;
	let uuid = uuidv4();
	let { partnerName } = data?.clientDetails || '';
	let mandateDetails: IMandateDetails = data?.mandateDetails;
	let orderDetails: IOrderDetails = data?.orderDetails;
	let requestId = data?.requestId;
	const otpUseCase = 'OTI';

	$: userName = $page.data?.profile?.clientDetails?.fullName || '';

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

	const toggleOtpVerificationModal = () => {
		showOtpVerificationModal = !showOtpVerificationModal;
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

	const navigateToLumpsumCompletePage = async (orderId: number) => {
		const params = encodeObject({
			orderID: orderId,
			firstTimePayment: true
		});

		goto(`${base}/ordersummary?params=${params}`, {
			replaceState: true
		});
	};

	let maskedEmailId: string;
	let maskedMobileNumber: string;
	const verifyWithOtpModalOpen = (event) => {
		maskedEmailId = event?.detail?.maskedEmailId;
		maskedMobileNumber = event?.detail?.maskedMobileNumber;
	};

	const navigateToOrders = async () => {
		await goto(`${base}/orders/orderspage`, { replaceState: true });
	};

	const placeLumpsumOrderViaMandate = async (schemeDetails: SchemeDetails) => {
		showLoading('Placing One-time Order');
		const url = `${PUBLIC_MF_CORE_BASE_URL}/orders`;

		const res = await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': requestId,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				amount: orderDetails?.amount,
				bankAccountNo: mandateDetails?.accountNo,
				bankName: mandateDetails?.bankName,
				mandateType: mandateDetails?.mandateType,
				mandateId: mandateDetails?.mandateId,
				dpNumber: $profileStore?.dpNumber,
				folioNumber: orderDetails?.folioNumber,
				emailId: $profileStore?.clientDetails?.email,
				mobileNo: $profileStore?.mobile,
				poaStatus: $profileStore?.poaStatus,
				schemeCode: schemeDetails?.schemeCode,
				subBrokerCode: $profileStore?.clientDetails?.subBroker,
				transactionType: 'PURCHASE',
				isAdditional: false
			})
		});

		if (
			res?.ok &&
			res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS &&
			res?.data?.data?.orderId !== undefined
		) {
			navigateToLumpsumCompletePage(res?.data?.data?.orderId);
		} else {
			error.visible = true;
			error.heading = 'Order Failed';
			error.subHeading = res?.data?.message || 'Something went wrong';
			stopLoading();
		}
	};
</script>

<div>
	{#await data?.api?.schemeDetails}
		<FundDetailsLoader />
	{:then schemeDetails}
		<PageHeader {userName} {partnerName} partnerId={$profileStore?.clientDetails?.subBroker} />
		{#if schemeDetails?.schemeName?.length}
			<section
				class="w-full grid-cols-[100%] sm:grid sm:grid-cols-[70%_29%] sm:gap-2 lg:gap-5 lg:gap-y-1"
			>
				<section class="rounded bg-white">
					<SchemeOverview {schemeDetails} />
				</section>

				<OrderDetails
					{schemeDetails}
					{mandateDetails}
					{orderDetails}
					profileDetails={profileStore}
					on:showOtpModal={toggleOtpVerificationModal}
				/>
			</section>
		{/if}
		{#if showOtpVerificationModal && !error?.visible}
			<OtpVerification
				{uuid}
				orderType={otpUseCase}
				amount={orderDetails?.amount?.toString()}
				schemeName={schemeDetails?.schemeName}
				on:closeOtpModal={toggleOtpVerificationModal}
				on:otpVerificationModalOpen={verifyWithOtpModalOpen}
				on:otpVerificationSuccessful={() => placeLumpsumOrderViaMandate(schemeDetails)}
			>
				<svelte:fragment slot="bodySection">
					<section class="px-4 pb-6 text-sm font-medium md:px-8 md:py-6 md:text-base">
						<p class="text-gray-500">
							An OTP has been sent to {maskedEmailId} and {maskedMobileNumber}. Please enter the OTP
							to verify your order.
						</p>
					</section>
				</svelte:fragment>
			</OtpVerification>
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
			>
				<svelte:fragment slot="popupFooter">
					<div class="flex w-full gap-2">
						<Button
							variant="contained"
							class="mt-8 w-1/2 cursor-default rounded md:cursor-pointer"
							onClick={closeErrorPopup}
						>
							TRY AGAIN
						</Button>
						<Button
							variant="outlined"
							class="mt-8 w-1/2 cursor-default rounded md:cursor-pointer"
							onClick={navigateToOrders}
						>
							GO TO ORDERS
						</Button>
					</div>
				</svelte:fragment>
			</ResultPopup>
		{/if}
	{/await}
</div>
