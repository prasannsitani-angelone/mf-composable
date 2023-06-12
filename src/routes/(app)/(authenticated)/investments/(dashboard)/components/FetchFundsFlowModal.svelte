<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import { onMount } from 'svelte';
	import { WMSIcon } from 'wms-ui-component';
	import Button from '$components/Button.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { v4 as uuidv4 } from 'uuid';
	import type { PageData } from '../$types';
	import Otp from './Otp.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { getMaskedMobileNumber } from '$lib/utils/helpers/masked';
	import {
		tefVerifyOtpClickAnalytics,
		tefVerifyOtpScreenAnalytics,
		tefGenerateOtpClickAnalytics,
		tefGenerateOtpScreenAnalytics,
		investmentExternalRefreshGotToInvestmentAnalytics
	} from '../../analytics';

	export let step: string;
	export let flow: string;
	export let onModalClick = () => '';
	export let onfetchFundsSuccess = () => '';

	export let data: PageData;

	let enteredOtp = '';
	let generateOtpResponse = {};
	let errorMsg = '';
	let loading = false;
	let errorCode = '';

	const otpValueChanged = () => {
		errorMsg = '';
	};

	let xReqId: string;
	const onRequestOtp = async () => {
		errorMsg = '';
		errorCode = '';
		xReqId = uuidv4();
		step = 'VALIDATE';
		const body = {
			email: data.profile?.clientDetails?.email || '',
			mobileNo: data.profile?.countryCode + data.profile?.mobile,
			pan: data.profile?.pan || '',
			useCase: 'ECAS'
		};
		const url = `${PUBLIC_MF_CORE_BASE_URL}/notifications/otp/generate`;
		const res = await useFetch(
			url,
			{
				method: 'POST',
				headers: {
					'X-Request-Id': xReqId
				},
				body: JSON.stringify(body)
			},
			fetch
		);

		if (res?.ok) {
			generateOtpResponse = res.data?.data || {};
		} else {
			errorMsg = res.data?.message || '';
			errorCode = res.data?.errorCode;
		}
		tefGenerateOtpClickAnalytics();
	};

	$: isVerifyDisabled = () => {
		return enteredOtp.length < 6 || errorMsg.length > 0 || errorCode === 'MF-SVC-MFCENTRAL-03';
	};

	$: isResendDisabled = () => {
		return errorCode === 'MF-SVC-MFCENTRAL-05';
	};

	const onValidateOtp = async () => {
		loading = true;
		errorMsg = '';
		errorCode = '';
		const body = {
			email: data.profile?.clientDetails?.email || '',
			mobileNo: data.profile?.countryCode + data.profile?.mobile,
			pan: data.profile?.pan || '',
			useCase: 'ECAS',
			otp: enteredOtp,
			otpReqId: generateOtpResponse.reqId,
			otpRefId: generateOtpResponse.otpRef
		};

		const url = `${PUBLIC_MF_CORE_BASE_URL}/notifications/otp/verify`;
		const res = await useFetch(
			url,
			{
				method: 'POST',
				headers: {
					'X-Request-Id': xReqId
				},
				body: JSON.stringify(body)
			},
			fetch
		);

		if (res?.ok) {
			step = 'SUCCESS';

			// Update the investments in background on successful otp validation
			onfetchFundsSuccess();
			tefVerifyOtpClickAnalytics({
				Status: 'Success'
			});
		} else {
			errorMsg = res.data?.message || '';
			errorCode = res.data?.errorCode;
			tefVerifyOtpClickAnalytics({ Status: 'Failure', Message: errorMsg });
		}
		loading = false;
	};

	const goToInvestmentClick = () => {
		onModalClick();
		investmentExternalRefreshGotToInvestmentAnalytics();
	};

	const stepIsValidate = () => {
		tefVerifyOtpScreenAnalytics();
		return true;
	};

	$: {
		otpValueChanged(enteredOtp);
	}

	onMount(() => {
		tefGenerateOtpScreenAnalytics();
	});
</script>

<Modal closeModal={onModalClick} isModalOpen>
	<div
		class="w-screen rounded-t-2xl rounded-b-none bg-white px-4 pb-3 pt-6 sm:!w-[460px] sm:rounded-lg sm:p-0 sm:pb-6"
	>
		{#if step === 'GENERATE'}
			<!-- Render Generate OTP contents -->
			<div class="flex items-center justify-between p-0 sm:border-b sm:py-6 sm:px-8">
				<div class="mr-1 text-xl font-medium">Generate OTP</div>
				<button class="hidden sm:block md:cursor-pointer" on:click={onModalClick}>
					<WMSIcon name="cross-circle" />
				</button>
			</div>
			<div class="text-center sm:px-8">
				<div
					class="mt-3 mb-10 text-left text-sm font-normal text-grey-body sm:mt-5 sm:mb-11 sm:text-base"
				>
					You will receive an OTP from MFCentral on <span class="font-medium text-black-title"
						>{getMaskedMobileNumber(data.profile.mobile)}</span
					>. Please verify this OTP in the next step
				</div>
				<Button class="w-full sm:w-48" variant="contained" onClick={onRequestOtp}>
					GENERATE OTP</Button
				>
			</div>
		{:else if step === 'VALIDATE' && stepIsValidate()}
			<!-- Render Validate OTP contents -->
			<div class="flex items-center justify-between p-0 sm:border-b sm:py-6 sm:px-8">
				<div class="mr-1 text-lg font-medium">Verify OTP</div>
				<button class="hidden sm:block md:cursor-pointer" on:click={onModalClick}>
					<WMSIcon name="cross-circle" />
				</button>
			</div>
			<form
				class="text-center sm:px-8"
				on:submit={(e) => {
					e.preventDefault();
					onValidateOtp();
				}}
			>
				<div
					class="mt-3 mb-8 text-left text-sm font-normal text-grey-body sm:mt-5 sm:mb-11 sm:text-base"
				>
					By verifying the OTP, you are allowing Angel One to fetch all mutual funds investment
					information mapped to your <span class="font-medium text-black-title"
						>PAN {getMaskedMobileNumber(data.profile.pan)}</span
					>
				</div>
				<Otp
					bind:value={enteredOtp}
					{errorMsg}
					onResendClick={onRequestOtp}
					class="pb-11"
					disableResend={isResendDisabled()}
				/>
				<Button
					type="submit"
					class="w-full disabled:bg-grey-line disabled:text-white "
					disabled={isVerifyDisabled()}>VERIFY</Button
				>
			</form>
			{#if loading}
				<div class="absolute inset-0 flex items-center justify-center bg-black-title/80">
					<LoadingIndicator svgClass={'!w-16 !h-16'} />
				</div>
			{/if}
		{:else if step === 'SUCCESS'}
			<!-- Render OTO Success contents -->
			<div class="flex flex-col items-center justify-between sm:px-16 sm:pt-10 sm:pb-4">
				{#if flow === 'REFRESH'}
					<div class=""><WMSIcon width={92} height={92} name="clock-green" /></div>
					<div class=" mt-6 text-xl">Refreshing Your Portfolio</div>
					<div class="mb-8 mt-3 text-center text-sm font-normal text-grey-body sm:text-base">
						Fetching the latest data for your external investments from MFCentral. We will notify
						you once your portfolio has been updated
					</div>
				{:else}
					<div class=""><WMSIcon width={92} height={92} name="success-tick-circle" /></div>
					<div class=" mt-6 text-xl">Updating your portfolio</div>
					<div class="mb-8 mt-3 text-center text-sm font-normal text-grey-body sm:text-base">
						We are fetching your external investments from MFCentral. This could take some time. We
						will notify you once your portfolio has been updated
					</div>
				{/if}
				<Button class="w-full sm:w-48" onClick={goToInvestmentClick}>GO TO INVESTMENTS</Button>
			</div>
		{/if}
	</div>
</Modal>
