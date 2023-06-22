<script setup lang="ts">
	import BaseInput from '$components/BaseInput.svelte';
	import Button from '$components/Button.svelte';
	import { PUBLIC_APP_CAPCHA_SITE_KEY, PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { getCaptchaCode } from '$lib/utils/captcha';
	import { filterNumber } from '$lib/utils/helpers/filters';
	import { getNameInitials } from '$lib/utils/helpers/mpin';
	import { useFetch } from '$lib/utils/useFetch';
	import { createEventDispatcher } from 'svelte';
	import { WMSIcon } from 'wms-ui-component';

	export let usersName: string;
	export let clientCode: string;
	export let mobileNumber: string;
	export let token: string;

	const dispatch = createEventDispatcher();
	const nameInitials = getNameInitials(usersName);

	let mpin = '';
	let error = '';

	const generateOTPFunc = async () => {
		const captchaCode = await getCaptchaCode(PUBLIC_APP_CAPCHA_SITE_KEY);
		return useFetch('api/generateLoginOTP', {
			method: 'POST',
			body: JSON.stringify({
				country_code: '+91',
				mob_no: mobileNumber,
				is_otp_resend: false,
				send_otp_on_email: true
			}),
			headers: {
				'X-Source': 'mutualfund',
				'x-captcha': captchaCode
			}
		});
	};

	const callMpinApi = async () => {
		const baseUrl = PUBLIC_MF_CORE_BASE_URL;
		const url = `${baseUrl}/mpin`;

		return useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				action: 'VERIFY',
				mpin: mpin
			}),
			headers: {
				'X-Source': 'mutualfund',
				authorization: `Bearer ${token}`
			}
		});
	};

	const onForgotPin = async () => {
		error = '';
		const generateOTPData = await generateOTPFunc();

		if (generateOTPData?.data?.is_guest_user) {
			error = 'User is not registered with us';
		} else if (
			generateOTPData?.status === 200 &&
			generateOTPData?.data?.status?.toUpperCase() === 'SUCCESS'
		) {
			dispatch('forgotPin', generateOTPData?.data?.data?.request_id);
		} else if (generateOTPData?.data?.message?.length) {
			error = generateOTPData?.data?.message;
		} else {
			error = 'Unknown Error. Please Contact Field Support';
		}
	};

	const onMpinChange = (value: string) => {
		mpin = value;
		error = '';
	};

	const onMpinSubmit = async () => {
		error = '';
		const mpinData = await callMpinApi();

		if (mpinData?.status === 200 && mpinData?.data?.status?.toUpperCase() === 'SUCCESS') {
			dispatch('onSuccess');
		} else if (mpinData?.data?.message?.length) {
			error = mpinData?.data?.message;
		} else {
			error = 'Unknown Error. Please Contact Field Support';
		}
	};

	$: buttonDisabled = mpin.trim().length !== 4;

	const onClick = () => {
		if (buttonDisabled) {
			return;
		}
		onMpinSubmit();
	};

	const onSwitchHereClick = () => {
		dispatch('startAgain');
	};
</script>

<section class="w-full" data-testid="mpin-login">
	<div class="flex w-full flex-col items-center lg:w-120">
		<div class="mb-6 flex w-full flex-row items-center md:mb-12">
			<div
				class="mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-grey-light text-blue-primary"
			>
				{nameInitials}
			</div>
			<div>
				<div class="mb-1 text-lg font-medium text-black-neutral">
					{usersName}
				</div>
				<div class="text-base text-grey-dark">
					{clientCode}
				</div>
			</div>
		</div>
		<div class="flex w-full flex-col items-center">
			<BaseInput
				id="mpin"
				placeholder="Unlock Using PIN"
				type="password"
				maxLength={4}
				value={mpin}
				heading={mpin ? 'Unlock Using PIN' : ''}
				onChange={onMpinChange}
				classes={{
					input: 'text-base text-start placeholder:text-sm',
					container: 'border shadow-none h-16 py-0',
					label: 'text-grey-dark text-xs mb-0 font-normal',
					error: 'border-red-500',
					parent: 'w-full'
				}}
				class="w-full"
				filterChar={filterNumber}
				error={Boolean(error)}
				onSubmit={onClick}
				autofocus={true}
			>
				<svelte:fragment slot="preinput">
					<div class="mr-4 flex flex-col justify-center">
						<WMSIcon name="lock-icon" width={24} height={24} />
					</div>
				</svelte:fragment>
			</BaseInput>

			{#if error?.length}
				<div class="mt-2 text-center text-xs text-red-500">
					{error}
				</div>
			{/if}

			<div id="forgot_mpin" class="mt-2 flex w-full flex-row justify-end">
				<button
					class="cursor-pointer text-sm font-semibold text-blue-primary active:opacity-80"
					on:click={onForgotPin}
				>
					Forgot PIN?
				</button>
			</div>
		</div>
		<Button
			class="mt-6 w-full rounded-lg !py-3 md:mt-12 {buttonDisabled
				? '!bg-grey-light !text-grey-disabled'
				: ''}"
			disabled={buttonDisabled}
			{onClick}
		>
			PROCEED
		</Button>
		<div class="mt-5 flex w-full flex-row text-sm text-grey-medium lg:w-120">
			<span class="mr-2">Login to another account?</span>
			<button
				class="cursor-pointer text-sm font-medium text-blue-primary active:opacity-80"
				on:click={onSwitchHereClick}
			>
				Switch Here
			</button>
		</div>
	</div>
</section>
