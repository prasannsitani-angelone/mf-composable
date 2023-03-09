<script lang="ts">
	import GenerateOTP from '$lib/components/Login/GenerateOTP.svelte';
	import VerifyOTP from '$lib/components/Login/VerifyOTP.svelte';
	import { tokenStore } from '$lib/stores/TokenStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import OverlayLoading from '$lib/components/OverlayLoading.svelte';
	import LoginCarousel from '$lib/components/Login/LoginCarousel.svelte';
	import { setUserTokenInCookie } from '$lib/utils/helpers/token';
	const screen_enum = {
		GENERATE_OTP: 'GENERATE_OTP',
		VERIFY_OTP: 'VERIFY_OTP'
	};

	let screen = screen_enum.GENERATE_OTP;
	let mobileNumber = '';
	let requestID = '';
	let otpScreenHeading = '';
	let isLoading = false;

	const onGenerateOTPSuccess = (number: string, id: string) => {
		mobileNumber = number;
		requestID = id;
		otpScreenHeading = `OTP has been sent to +91 ${number} and your registered email ID`;
		screen = screen_enum.VERIFY_OTP;
	};

	const storeUserCookie = (userToken: Object) => {
		setUserTokenInCookie(userToken);
		tokenStore.updateStore({
			userToken
		});
	};

	const navigateToPage = () => {
		if (tokenStore.accessToken()) {
			isLoading = true;
			const redirectUrl = $page.url.searchParams.get('redirect') || '/';
			goto(redirectUrl, {
				replaceState: true
			});
		}
	};

	const onValidateOTPSuccess = async (partyCodeDetails) => {
		for (const property in partyCodeDetails) {
			const userToken = {
				NTAccessToken: partyCodeDetails[property].non_trading_access_token,
				NTRefreshToken: partyCodeDetails[property].non_trading_refresh_token
			};
			storeUserCookie(userToken);
			navigateToPage();
		}
	};
</script>

<section class="min-h-full bg-white">
	{#if isLoading}
		<OverlayLoading />
	{:else}
		<div class="flex min-h-screen w-full flex-1 flex-col md:flex-row">
			<LoginCarousel />
			<div class="border-b border-grey-line sm:border-l" />
			{#if screen === screen_enum.GENERATE_OTP}
				<GenerateOTP onSuccess={onGenerateOTPSuccess} />
			{:else if screen === screen_enum.VERIFY_OTP}
				<VerifyOTP
					onSuccess={onValidateOTPSuccess}
					{mobileNumber}
					{requestID}
					heading={otpScreenHeading}
				/>
			{/if}
		</div>
	{/if}
</section>
