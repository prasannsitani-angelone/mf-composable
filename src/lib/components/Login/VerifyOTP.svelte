<script lang="ts">
	import { intervalToDuration } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';

	import OtpIcon from '$lib/images/icons/OTPIcon.svelte';
	import { filterNumber } from '$lib/utils/helpers/filters';
	import { useFetch } from '$lib/utils/useFetch';

	import Button from '../Button.svelte';
	import BaseInput from '../BaseInput.svelte';
	import { getCaptchaCode } from '$lib/utils/captcha';
	import { PUBLIC_APP_CAPCHA_SITE_KEY } from '$env/static/public';

	export let heading = '';
	export let subHeading = '';
	export let mobileNumber = '';
	export let requestID = '';
	export let onSuccess = () => undefined;

	let error = '';
	let isLoading = false;
	let otp = '';
	let otpTimerInSec = 0;
	let otpInterval = null;
	let otpTimerDisplay = '';
	let buttonDisabled = false;
	let reqId = requestID;

	const setOTPTimer = () => {
		otpInterval = setInterval(() => {
			if (otpTimerInSec > 0) {
				otpTimerInSec = otpTimerInSec - 1;
			} else {
				clearInterval(otpInterval);
			}
		}, 1000);
	};

	onMount(() => {
		otpTimerInSec = 30;
		setOTPTimer();
	});

	onDestroy(() => {
		if (otpInterval) {
			clearInterval(otpInterval);
		}
	});

	const clearError = () => {
		error = '';
	};

	const showLoading = () => {
		isLoading = true;
	};

	const stopLoading = () => {
		isLoading = false;
	};

	const onOTPChange = (value) => {
		clearError();
		otp = value;
	};

	const validateOTPFunc = () => {
		return useFetch('api/verifyLoginOTP', {
			method: 'POST',
			body: JSON.stringify({
				country_code: '+91',
				mob_no: mobileNumber,
				otp,
				request_id: reqId,
				source: 'SPARK',
				app_id: '5656',
				require_token_flag: 'nontrade',
				pan: '',
				verifyOnEmail: false
			}),
			headers: {
				'X-Source': 'mutualfund'
			}
		});
	};

	const onSubmit = async () => {
		if (buttonDisabled) {
			return;
		}
		clearError();
		try {
			showLoading();
			const response = await validateOTPFunc();
			const data = response.data;
			const status = response.status;
			if (status === 200) {
				// logout()
				otp = '';
				const partyCodeDetails = data?.data?.PartyCodeDetails || {};
				onSuccess(partyCodeDetails);
			} else if (status != 200) {
				error = data?.message || 'Unknown Error. Please Contact Field Support';
			} else {
				error = 'Unknown Error. Please Contact Field Support';
			}
		} catch (e) {
			error = 'Unknown Error. Please Contact Field Support';
		} finally {
			stopLoading();
		}
	};

	const generateOTPFunc = async () => {
		const captchaCode = await getCaptchaCode(PUBLIC_APP_CAPCHA_SITE_KEY);
		return useFetch('api/generateLoginOTP', {
			method: 'POST',
			body: JSON.stringify({
				country_code: '+91',
				mob_no: mobileNumber,
				is_otp_resend: true,
				send_otp_on_email: true
			}),
			headers: {
				'X-Source': 'mutualfund',
				'x-captcha': captchaCode
			}
		});
	};

	const resendOTP = async () => {
		if (otpInterval) {
			clearInterval(otpInterval);
		}
		otpTimerInSec = 30;
		setOTPTimer();
		clearError();
		try {
			const response = await generateOTPFunc();
			const data = response.data;
			const status = response.status;
			if (status === 200 && data?.data?.is_guest_user) {
				error = 'User is not registered with us';
			} else if (status === 200) {
				reqId = data?.data?.request_id;
			} else if (status !== 200) {
				error = data?.message || 'Unknown Error. Please Contact Field Support';
			} else if (!status) {
				error = 'Unknown Error. Please Contact Field Support';
			}
		} catch (e) {
			error = 'Unknown Error. Please Contact Field Support';
		}
	};

	$: {
		const duration = intervalToDuration({ start: 0, end: otpTimerInSec * 1000 });
		const zeroPad = (num) => String(num).padStart(2, '0');
		otpTimerDisplay = `${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`;
	}
	$: buttonDisabled = otp.trim().length !== 6;
</script>

<div class="flex w-full flex-col items-center lg:w-120">
	<div class="mb-6 w-full md:mb-12">
		<div class="text-xl font-normal text-title">
			{heading}
		</div>
		{#if subHeading}
			<div class="mt-2 text-base text-body">
				{subHeading}
			</div>
		{/if}
	</div>
	<div class="flex w-full flex-col items-center">
		<div class="w-full">
			<BaseInput
				id="otp"
				placeholder="Enter OTP"
				type="password"
				maxLength={6}
				value={otp}
				heading={otp ? 'OTP' : ''}
				onChange={onOTPChange}
				classes={{
					parent: 'w-full',
					input: '!text-base !text-start placeholder:text-sm',
					container: '!border !shadow-none h-16 !py-0 mb-2',
					label: '!text-body !text-xs mb-0 !font-normal'
				}}
				filterChar={filterNumber}
				error={Boolean(error)}
				{onSubmit}
			>
				<div slot="preinput" class="mr-4 flex flex-col justify-center">
					<OtpIcon />
				</div>
				<div slot="error" class="mt-2 text-center text-xs text-red-500">
					{error}
				</div>
			</BaseInput>
			<div id="resend_otp" class="flex flex-row justify-between">
				<div class="text-xs text-red-500" />
				<div>
					{#if otpTimerInSec}
						<div class="text-sm text-body">
							{otpTimerDisplay}
						</div>
					{:else}
						<Button variant="transparent" onClick={resendOTP}>Resend OTP</Button>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<Button
		class="mt-6 w-full !rounded-lg !py-3 md:mt-12"
		disabled={buttonDisabled}
		onClick={onSubmit}
	>
		PROCEED
	</Button>
</div>
