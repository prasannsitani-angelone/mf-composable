<script lang="ts">
	import { getMaskedEmail, getMaskedMobileNumberSuffix } from '$lib/utils/helpers/masked';
	import { profileStore } from '$lib/stores/ProfileStore';
	import OtpVerification from '$components/OtpFlow/OtpVerification.svelte';

	export let uuid: string;
	export let amount: string;
	export let schemeName: string;
	export let investmentType: string;
</script>

<OtpVerification
	{uuid}
	{amount}
	{schemeName}
	{investmentType}
	orderType="PHYSICAL_ORDER"
	on:otpVerificationSuccessful
	on:closeOtpModal
	aboutModalData={[
		{
			text: 'In line with SEBI regulations, all orders placed in physical/SOA mode must be verified with an OTP. This OTP will be sent to your registered mobile number and email address'
		}
	]}
>
	<section class="px-4 pb-6 text-sm font-normal md:px-8 md:py-6 md:text-base" slot="bodySection">
		<p class="text-gray-500">
			An OTP has been sent to
			<span class="font-medium text-black-title">
				{getMaskedEmail($profileStore?.clientDetails?.email || '')}
			</span>
			and
			<span class="font-medium text-black-title">
				{getMaskedMobileNumberSuffix($profileStore?.mobile || '', false)}
			</span>. Please enter the OTP to verify your order
		</p>
	</section>
</OtpVerification>
