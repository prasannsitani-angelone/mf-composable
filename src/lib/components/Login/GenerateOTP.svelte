<script lang="ts">
	import BaseInput from '../BaseInput.svelte';

	import { filterNumber } from '$lib/utils/helpers/filters';
	import { useFetch } from '$lib/utils/useFetch';
	import { getCaptchaCode } from '$lib/utils/captcha';
	import { PUBLIC_APP_CAPCHA_SITE_KEY } from '$env/static/public';
	import { Button, WMSIcon } from 'svelte-components';

	export let onSuccess: (mobileNumber: string, requestId: string) => void = () => undefined;

	let error = '';
	let mobileNumber = '';
	let buttonDisabled = false;
	let isLoading = false;

	const generateOTPFunc = async (mobileNumber: string, otpResend = false) => {
		const captchaCode = await getCaptchaCode(PUBLIC_APP_CAPCHA_SITE_KEY);
		return useFetch('api/generateLoginOTP', {
			method: 'POST',
			body: JSON.stringify({
				country_code: '+91',
				mob_no: mobileNumber,
				is_otp_resend: otpResend,
				send_otp_on_email: true
			}),
			headers: {
				'X-Source': 'mutualfund',
				'x-captcha': captchaCode
			}
		});
	};

	const clearError = () => {
		error = '';
	};

	const onMobileNumberChange = (value: string) => {
		clearError();
		mobileNumber = value;
	};

	const showLoading = () => {
		isLoading = true;
	};

	const stopLoading = () => {
		isLoading = false;
	};

	const onSubmit = async () => {
		if (buttonDisabled) {
			return;
		}
		clearError();
		try {
			showLoading();
			const response = await generateOTPFunc(mobileNumber);
			const data = response.data;
			const status = response.status;
			if (status === 200 && data?.data?.is_guest_user) {
				error = 'User is not registered with us';
			} else if (status === 200) {
				onSuccess(mobileNumber, data?.data?.request_id);
				mobileNumber = '';
			} else if (status !== 200) {
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

	$: buttonDisabled = mobileNumber.trim().length !== 10 || isLoading;
</script>

<div class="flex w-full flex-col items-center lg:w-120">
	<div class="mb-6 w-full text-xl font-normal text-title md:mb-12">
		Login with your mobile number
	</div>
	<div class="flex w-full flex-col items-center">
		<BaseInput
			id="mobile"
			placeholder="Mobile Number"
			type="text"
			maxLength={10}
			value={mobileNumber}
			heading={mobileNumber ? 'Mobile Number' : ''}
			onChange={onMobileNumberChange}
			classes={{
				parent: 'w-full',
				input: '!text-base !text-start placeholder:text-sm bg-background-alt',
				container: '!border !shadow-none h-16 !py-0',
				label: '!text-body !text-xs mb-0 !font-normal'
			}}
			class="w-full"
			filterChar={filterNumber}
			error={Boolean(error)}
			{onSubmit}
		>
			<div slot="preinput" class="mr-4 flex flex-col justify-center">
				<WMSIcon name="phone-dialer" width={20} height={20} stroke="var(--TITLE)" />
			</div>
			<div slot="error" class="mt-2 text-center text-xs text-red-500">
				{error}
			</div>
		</BaseInput>
	</div>
	<Button
		class="mt-6 w-full !rounded-lg !py-3 md:mt-12"
		disabled={buttonDisabled}
		onClick={onSubmit}
	>
		PROCEED
	</Button>
	<div class="mt-5 flex w-full flex-row justify-center text-sm text-disabled md:justify-start">
		<span class="mr-2 text-disabled">Don't have an account?</span>
		<a target="_blank" class="text-primary" href="https://www.angelone.in/open-demat-account"
			>Register now!</a
		>
	</div>
</div>
