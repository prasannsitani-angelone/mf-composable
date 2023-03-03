<script lang="ts">
	import Button from '../Button.svelte';
	import BaseInput from '../BaseInput.svelte';

	import { filterNumber } from '$lib/utils/helpers/filters';
	import PhoneIcon from '$lib/images/icons/PhoneIcon.svelte';
	import { useFetch } from '$lib/utils/useFetch';

	export let onSuccess = (mobileNumber: string, requestId: string) => undefined;

	let error = '';
	let mobileNumber = '';
	let buttonDisabled: boolean = false;
	let isLoading = false;

	const generateOTPFunc = (mobileNumber: string, otpResend = false) => {
		return useFetch('api/generateLoginOTP', {
			method: 'POST',
			body: JSON.stringify({
				country_code: '+91',
				mob_no: mobileNumber,
				is_otp_resend: otpResend,
				send_otp_on_email: true
			}),
			headers: {
				'X-Source': 'mutualfund'
			}
		});
	};

	const clearError = () => {
		error = '';
	}

	const onMobileNumberChange = (value: string) => {
		clearError()
		mobileNumber = value;
	};

	const showLoading = () => {
		isLoading = true
	}

	const stopLoading = () => {
		isLoading = false
	}

	const onSubmit = async () => {
		if (buttonDisabled) {
			return;
		}
		clearError()
		try{
			showLoading()
			const response = await generateOTPFunc(mobileNumber)
			const data = await response.json()
			const status = response.status
			if (status === 200 && data?.data?.is_guest_user) {
				error = 'User is not registered with us'
			} else if (status === 200) {
			    onSuccess(mobileNumber, data?.data?.request_id)
				mobileNumber = ''
			} else if (status !== 200) {
			    error = data?.message || 'Unknown Error. Please Contact Field Support'
			} else {
				error = 'Unknown Error. Please Contact Field Support'
			}
		} catch(e){
			error = 'Unknown Error. Please Contact Field Support'
		} finally {
			stopLoading()
		}
	};

	$: buttonDisabled = mobileNumber.trim().length !== 10 || isLoading;
</script>

<div class="flex flex-col items-center px-4 py-8 md:w-1/2 md:py-32">
	<div class="mb-6 w-full text-xl font-medium text-black-neutral md:mb-12 lg:w-120">
		Login with your mobile number
	</div>
	<div class="flex w-full flex-col items-center lg:w-120">
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
				input: '!text-base !text-start placeholder:text-sm',
				container: '!border !shadow-none h-16 !py-0',
				label: '!text-grey-dark !text-xs mb-0 !font-normal'
			}}
			class="w-full"
			filterChar={filterNumber}
			error={Boolean(error)}
			{onSubmit}
		>
			<div slot="preinput" class="mr-4 flex flex-col justify-center">
				<PhoneIcon />
			</div>
			<div slot="error" class="mt-2 text-center text-xs text-red-500">
				{error}
			</div>
		</BaseInput>
	</div>
	<Button
		class="mt-6 w-full !rounded-lg !py-3 md:mt-12 lg:w-120"
		disabled={buttonDisabled}
		onClick={onSubmit}
	>
		PROCEED
	</Button>
	<div>
		<div class="mt-5 flex w-full flex-row text-sm text-grey-medium lg:w-120">
			<span class="mr-2">Don't have an account?</span>
			<a target="_blank" class="text-blue-primary" href="https://www.angelone.in/open-demat-account"
				>Register now!</a
			>
		</div>
	</div>
</div>
