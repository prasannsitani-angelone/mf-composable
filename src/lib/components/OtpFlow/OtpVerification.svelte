<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { getMaskedEmail, getMaskedMobileNumberSuffix } from '$lib/utils/helpers/masked';
	import { OrderType } from '$lib/constants/transactionType';
	import { useFetch } from '$lib/utils/useFetch';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import Button from '$components/Button.svelte';
	import InfoModal from '$components/InfoModal.svelte';
	import LoadingPopup from '../../../routes/(app)/InvestmentPad/OrderPadComponents/LoadingPopup.svelte';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import Modal from '$components/Modal.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import type { FolioObject } from '$lib/types/IInvestments';
	import { formatOtpValue } from '$lib/utils/helpers/otp';
	import STATUS_ARR from '$lib/constants/orderFlowStatuses';

	export let uuid: string;
	export let amount: string;
	export let folio: FolioObject;
	export let schemeName: string;
	export let investmentType: string;
	export let orderType: unknown = undefined;

	const dispatch = createEventDispatcher();

	const closeOtpActionModal = () => {
		dispatch('closeOtpModal');
	};

	export let aboutModalData = [
		{
			text: 'In line with SEBI regulations, all physical account holders have to verify withdraw orders with an OTP sent to the mobile number and email address registered with the folio'
		},
		{
			text: 'In case you no longer have access to this mobile number and email address, please visit app.mfcentral.com/investor/signin to update your details.'
		}
	];

	if (orderType === OrderType.SWITCH) {
		aboutModalData[0].text =
			'In line with SEBI regulations, all physical account holders have to authorise Switch orders with an OTP sent to the mobile number and email address registered with the folio';
	}

	const wrongOtpLimit = 5;
	const totalCountdownTime = 90; // in seconds

	let mobileNo = folio?.mobileNo;
	let emailId = folio?.email;
	let otpValue = '';
	let isIncorrectOtp = false;
	let wrongOtpCount = 0;
	let countdownTime = '01:30';
	let timeLeft = totalCountdownTime;
	let timerCountdownInProgress = true;
	let showAboutOrderVerificationModal = false;

	if (!mobileNo?.length) {
		mobileNo = $profileStore?.mobile || '';
	}

	if (mobileNo?.length === 10) {
		mobileNo = `+91${mobileNo}`;
	}

	if (!emailId?.length) {
		emailId = $profileStore?.clientDetails?.email || '';
	}

	const maskedMobileNumber = getMaskedMobileNumberSuffix(mobileNo?.slice(3), false);

	const maskedEmailId = getMaskedEmail(emailId);

	let isSubmitClicked = false;

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

	const onErrorTryAgain = () => {
		closeOtpActionModal();
		dispatch('redirectOnError');
	};

	// these 2 functions (showLoading, stopLoading) can be used later to use loader

	// const showLoading = (heading: string) => {
	//   loadingState.isLoading = true;
	//   loadingState.heading = heading;
	// }

	// const stopLoading = () => {
	//   loadingState.isLoading = false;
	//   loadingState.heading = '';
	// }

	const onOtpInput = (e) => {
		let formattedValue = e?.target?.value || '';
		otpValue = '';
		otpValue = formatOtpValue(formattedValue); // trim, remove alphabets and remove leading zeroes

		isIncorrectOtp = false;
	};

	const focusOtpInput = () => {
		document?.getElementById('otpInput')?.focus();
	};

	const resetValues = () => {
		otpValue = '';
		isIncorrectOtp = false;
		wrongOtpCount = 0;
	};

	const resendOtpClicked = async () => {
		resetValues();

		countdownTime = '01:30';
		timerCountdown(totalCountdownTime);

		await generateOTPFunc(mobileNo, emailId);

		timerCountdownInProgress = true;

		dispatch('otpResendClick');
	};

	let otpTimer;

	/**
	 * timerCountdown: Function to handle Resend OTP countdown timer.
	 *
	 * @param {Number} timerStartValue
	 */
	const timerCountdown = (timerStartValue: number = totalCountdownTime) => {
		timeLeft = timerStartValue;
		let timerMinutes = '01';
		let timerSeconds = '30';

		// reset previous timers
		if (otpTimer !== undefined) {
			clearInterval(otpTimer);
		}

		otpTimer = setInterval(() => {
			timeLeft--;
			timerMinutes = timeLeft >= 60 ? '01' : '00';
			timerSeconds = timeLeft >= 60 ? (timeLeft % 60).toString() : timeLeft?.toString();

			if (timerSeconds?.length < 2) {
				timerSeconds = '0' + timerSeconds;
			}

			countdownTime = `${timerMinutes}:${timerSeconds}`;

			if (timeLeft <= 0) {
				clearInterval(otpTimer);
			}
		}, 1000);
	};

	timerCountdown(totalCountdownTime);

	$: {
		if (timeLeft <= 0) {
			timerCountdownInProgress = false;
		}
	}

	const generateOTPFunc = async (mobileNumber: string, emailId: string) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/notifications/otp/generate`;

		isSubmitClicked = true;

		await useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				mobileNo: mobileNumber,
				email: emailId,
				data: {
					amount: parseFloat(amount),
					schemeName,
					investmentType
				},
				useCase: orderType
			})
		});

		isSubmitClicked = false;
	};

	const validateOtpResponse = (mobileNumber: string, emailId: string, otp: string) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/notifications/otp/verify`;

		return useFetch(url, {
			method: 'POST',
			headers: {
				'X-Request-Id': uuid,
				'X-SESSION-ID': uuid,
				'X-device-type': 'WEB'
			},
			body: JSON.stringify({
				mobileNo: mobileNumber,
				email: emailId,
				otp,
				useCase: orderType
			})
		});
	};

	generateOTPFunc(mobileNo, emailId);

	onMount(() => {
		if (!mobileNo?.length || !emailId?.length) {
			error.visible = true;
			error.heading = 'OTP verification failed';
			error.subHeading = 'Unable to fetch user phone or email';

			return;
		}

		dispatch('otpVerificationModalOpen', {
			maskedEmailId,
			maskedMobileNumber,
			folioNumber: folio?.folioNumber
		});
	});

	const handleShowAboutOrderVerificationModal = () => {
		showAboutOrderVerificationModal = !showAboutOrderVerificationModal;
	};

	const handleOtpVerificationProceedClick = async () => {
		dispatch('otpVerificationProceedClick');

		isSubmitClicked = true;

		const res = await validateOtpResponse(mobileNo, emailId, otpValue);

		isSubmitClicked = false;

		if (res?.data?.status?.toUpperCase() === STATUS_ARR?.SUCCESS) {
			dispatch('otpVerificationSuccessful', { emailId, mobileNo });
		} else if (res?.data?.status?.toUpperCase() === STATUS_ARR?.FAILURE) {
			if (
				res?.data?.errorCode?.toUpperCase() === 'MF-SVC-NOTIFICATION-04' ||
				res?.data?.errorCode?.toUpperCase() === 'MF-SVC-NOTIFICATION-05'
			) {
				isIncorrectOtp = true;
				wrongOtpCount++;
			}
		}
	};
</script>

<section>
	{#if !showAboutOrderVerificationModal && !loadingState.isLoading && !error?.visible}
		<Modal isModalOpen={true} on:backdropclicked={closeOtpActionModal}>
			<div
				class="flex w-screen flex-col rounded-b-none rounded-t-2xl bg-white shadow-csm md:w-120 md:rounded-lg"
			>
				<slot name="heading">
					<div class="flex items-center justify-between px-4 py-6 md:px-8">
						<div class="flex items-center justify-start">
							<span class="mr-1 text-lg md:text-xl"> Verify Order with OTP </span>
							<WMSIcon
								width={16}
								height={16}
								name="info-in-circle"
								class="cursor-default md:cursor-pointer"
								on:click={handleShowAboutOrderVerificationModal}
							/>
						</div>
						<WMSIcon
							width={24}
							height={24}
							name="cross-circle"
							class="cursor-default md:cursor-pointer"
							on:click={closeOtpActionModal}
						/>
					</div>
				</slot>

				<slot name="horizontalLine">
					<div class="hidden border-t border-grey-line sm:block" />
				</slot>

				<slot name="bodySection">
					<section class="px-4 pb-6 text-sm font-normal md:px-8 md:py-6 md:text-base">
						<p class="text-gray-500">
							An OTP has been sent to {maskedEmailId} and {maskedMobileNumber} registered with the folio
							{folio?.folioNumber}. Please enter the OTP to verify your order
						</p>
					</section>
				</slot>

				<slot name="otpInput">
					<section class="px-4 pb-6 text-sm md:px-8">
						<!-- OTP Input section -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<article
							class="mb-2 flex items-center justify-start rounded-lg border border-gray-200 px-4 py-3 {wrongOtpCount <
							wrongOtpLimit
								? 'cursor-text'
								: 'cursor-not-allowed'} {(isIncorrectOtp || wrongOtpCount >= wrongOtpLimit) &&
								'border-red-sell'}"
							on:click={focusOtpInput}
						>
							<label class="mb-0.5 mr-5 cursor-text text-xs text-black-title" for="otpInput">
								<WMSIcon width={24} height={25} name="keypad" />
							</label>
							<section class="flex flex-col items-start justify-start text-sm">
								<label class={!otpValue?.length ? 'invisible mb-0' : 'mb-1'} for="otpInput">
									OTP
								</label>
								<input
									id="otpInput"
									inputmode="numeric"
									placeholder="OTP"
									value={otpValue}
									maxlength="6"
									disabled={wrongOtpCount >= wrongOtpLimit}
									class="border-none bg-white text-base outline-none {wrongOtpCount < wrongOtpLimit
										? 'cursor-text'
										: 'cursor-not-allowed'} {!otpValue?.length && '-mt-2 mb-3'}"
									on:input={onOtpInput}
								/>
							</section>
						</article>

						<!-- Error and Resent OTP section -->
						<article class="flex items-start justify-between text-sm font-normal">
							{#if isIncorrectOtp || wrongOtpCount >= wrongOtpLimit}
								<div class="text-red-sell">
									{#if wrongOtpCount >= wrongOtpLimit}
										<span> Wrong OTP limit exceeded. Please resend OTP and try again </span>
									{:else}
										<span> Incorrect OTP. Please try again or resend OTP </span>
									{/if}
								</div>
							{:else}
								<div />
							{/if}

							{#if timerCountdownInProgress && !isIncorrectOtp && wrongOtpCount < wrongOtpLimit}
								<div class="text-sm font-normal text-grey-body">
									<span id="resendOtpCountdown">
										Resend in {countdownTime}
									</span>
								</div>
							{:else}
								<button
									class="min-w-fit cursor-pointer text-blue-primary"
									on:click={resendOtpClicked}
								>
									Resend OTP
								</button>
							{/if}
						</article>

						<!-- Footer CTA -->
						<article class="flex justify-center">
							<Button
								class="mt-8 w-48 rounded"
								disabled={otpValue?.length < 6 ||
									isIncorrectOtp ||
									wrongOtpCount >= wrongOtpLimit ||
									isSubmitClicked}
								onClick={handleOtpVerificationProceedClick}
							>
								CONTINUE
							</Button>
						</article>
					</section>
				</slot>
			</div>
		</Modal>
	{/if}

	<!-- About Order Verification Modal -->
	{#if showAboutOrderVerificationModal}
		<InfoModal
			showModal={showAboutOrderVerificationModal}
			heading="About Order Verification"
			on:crossClicked={handleShowAboutOrderVerificationModal}
		>
			<svelte:fragment slot="bodySection">
				<section class="p-8">
					{#each aboutModalData as statement (statement?.text)}
						<div class="font-base flex items-start justify-start pb-5 text-sm text-grey-body">
							<WMSIcon class="mr-2.5 min-w-[20px]" width={24} height={24} name="setting" />
							<span>
								{statement?.text}
							</span>
						</div>
					{/each}
				</section>
			</svelte:fragment>
		</InfoModal>
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
			handleButtonClick={onErrorTryAgain}
			closeModal={onErrorTryAgain}
			buttonTitle="RETRY"
			buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
			buttonVariant="outlined"
		/>
	{/if}
</section>
