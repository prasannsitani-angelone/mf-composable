<script lang="ts">
	import { getMaskedEmail, getMaskedMobileNumberSuffix } from '$lib/utils/helpers/masked';
	import { profileStore } from '$lib/stores/ProfileStore';
	import OtpVerification from '$components/OtpFlow/OtpVerification.svelte';

	export let uuid: string;
	export let amount: string;
	export let schemeName: string;
	export let investmentType: string;

	const getTrimmedSchemeName = (size = 30) =>
		schemeName?.length > size ? `${schemeName.slice(0, size)}...` : schemeName;
</script>

<OtpVerification
	{uuid}
	{amount}
	schemeName={getTrimmedSchemeName()}
	{investmentType}
	orderType="PHYSICAL_ORDER"
	on:otpVerificationSuccessful
	on:closeOtpModal
	aboutModalData={[
		{
			text: 'In line with SEBI regulations, all physical account holders have to verify purchase orders with an OTP sent to the mobile number and email address'
		}
	]}
>
	<section class="px-4 pb-6 text-sm font-normal md:px-8 md:py-6 md:text-base" slot="bodySection">
		<p class="text-body">
			An OTP has been sent to
			<span class="font-medium text-title">
				{getMaskedEmail($profileStore?.clientDetails?.email || '')}
			</span>
			and
			<span class="font-medium text-title">
				{getMaskedMobileNumberSuffix($profileStore?.mobile || '', false)}
			</span>. Please enter the OTP to verify your order
		</p>
	</section>
</OtpVerification>
