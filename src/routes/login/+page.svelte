<script lang="ts">
	import GenerateOTP from '$lib/components/Login/GenerateOTP.svelte';
	import VerifyOTP from '$lib/components/Login/VerifyOTP.svelte';
	import { tokenStore } from '$lib/stores/TokenStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import OverlayLoading from '$lib/components/OverlayLoading.svelte';
	import LoginCarousel from '$lib/components/Login/LoginCarousel.svelte';
	import { setUserTokenInCookie } from '$lib/utils/helpers/token';
	import { PUBLIC_APP_CAPCHA_SITE_KEY, PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import { useFetch } from '$lib/utils/useFetch';
	import MpinLogin from '$components/Login/MpinFlow/MpinLogin.svelte';
	import MpinSetup from '$components/Login/MpinFlow/MpinSetup.svelte';

	const screen_enum = {
		GENERATE_OTP: 'GENERATE_OTP',
		VERIFY_OTP: 'VERIFY_OTP',
		LOGIN_MPIN: 'LOGIN_MPIN',
		SETUP_MPIN: 'SETUP_MPIN',
		FORGOT_MPIN_VERIFY_OTP: 'FORGOT_MPIN_VERIFY_OTP'
	};

	const mpinEligible = appStore.isAngelBeeAndroidUser() || appStore.isAngelBeeIosUser() || false;

	interface userCookieTypes {
		NTAccessToken: string;
		NTRefreshToken: string;
	}

	let userCookie: userCookieTypes;
	let userCookieProperty = '';
	let screen = screen_enum.GENERATE_OTP;
	let mobileNumber = '';
	let requestID = '';
	let otpScreenHeading = '';
	let otpScreenSubHeading = '';
	let isLoading = false;
	let firstName = '';
	let clientCode = '';

	const onGenerateOTPSuccess = (number: string, id: string) => {
		mobileNumber = number;
		requestID = id;
		otpScreenHeading = `OTP has been sent to +91 ${number} and your registered email ID`;
		screen = screen_enum.VERIFY_OTP;
	};

	const storeUserCookie = (userToken: object) => {
		setUserTokenInCookie(userToken);
		tokenStore.updateStore({
			userToken
		});
	};

	const startAgain = () => {
		screen = screen_enum.GENERATE_OTP;
	};

	const forgotPin = (id: string) => {
		requestID = id;
		otpScreenSubHeading = `OTP has been sent to +91 ${mobileNumber}`;
		screen = screen_enum.FORGOT_MPIN_VERIFY_OTP;
	};

	const checkMpinFunc = async () => {
		const baseUrl = PUBLIC_MF_CORE_BASE_URL;
		const url = `${baseUrl}/mpin`;

		return useFetch(url, {
			method: 'GET',
			headers: {
				'X-Source': 'mutualfund',
				authorization: `Bearer ${userCookie?.NTAccessToken}`
			}
		});
	};

	const setCookieAndRedirect = () => {
		storeUserCookie(userCookie);
		navigateToPage();
	};

	const onValidateOTPSuccess = async (partyCodeDetails) => {
		for (const property in partyCodeDetails) {
			userCookie = {
				NTAccessToken: partyCodeDetails[property].non_trading_access_token,
				NTRefreshToken: partyCodeDetails[property].non_trading_refresh_token
			};
			userCookieProperty = property;
		}

		if (mpinEligible) {
			const checkMpinData = await checkMpinFunc();

			if (
				checkMpinData?.status === 200 &&
				checkMpinData?.data?.status?.toUpperCase() === 'SUCCESS'
			) {
				screen = screen_enum?.LOGIN_MPIN;
			} else if (checkMpinData?.data?.errorCode === 'MF-SVC-MPIN-02') {
				screen = screen_enum?.SETUP_MPIN;
			} else {
				screen = screen_enum?.LOGIN_MPIN;
			}

			firstName = partyCodeDetails[userCookieProperty].first_name;
			clientCode = userCookieProperty;
		} else {
			setCookieAndRedirect();
		}
	};

	const onValidateOTPSuccessViaForgotPin = (partyCodeDetails) => {
		for (const property in partyCodeDetails) {
			userCookie = {
				NTAccessToken: partyCodeDetails[property].non_trading_access_token,
				NTRefreshToken: partyCodeDetails[property].non_trading_refresh_token
			};
			userCookieProperty = property;
		}
		firstName = partyCodeDetails[userCookieProperty].first_name;
		clientCode = userCookieProperty;
		screen = screen_enum?.SETUP_MPIN;
	};

	const navigateToPage = () => {
		if (tokenStore.accessToken()) {
			isLoading = true;
			const redirectUrl = $page.url.searchParams.get('redirect') || `${base}/discoverfunds`;
			goto(redirectUrl, {
				replaceState: true
			});
		}
	};

	const onMpinSuccess = () => {
		setCookieAndRedirect();
	};
</script>

<svelte:head>
	<script
		src="https://www.google.com/recaptcha/enterprise.js?render={PUBLIC_APP_CAPCHA_SITE_KEY}"
		async
		defer
	></script>
</svelte:head>
<section class="min-h-full bg-white">
	{#if isLoading}
		<OverlayLoading />
	{:else}
		<div class="flex min-h-screen w-full flex-1 flex-col md:flex-row">
			<LoginCarousel />
			<div class="border-b border-grey-line sm:border-l" />
			<div class="flex w-full flex-col items-center px-4 py-8 md:w-1/2 md:py-32">
				{#if screen === screen_enum.GENERATE_OTP}
					<GenerateOTP onSuccess={onGenerateOTPSuccess} />
				{:else if screen === screen_enum.VERIFY_OTP}
					<VerifyOTP
						onSuccess={onValidateOTPSuccess}
						{mobileNumber}
						{requestID}
						heading={otpScreenHeading}
					/>
				{:else if screen === screen_enum.LOGIN_MPIN}
					<MpinLogin
						usersName={firstName}
						{clientCode}
						{mobileNumber}
						token={userCookie?.NTAccessToken}
						on:startAgain={startAgain}
						on:forgotPin={(e) => forgotPin(e?.detail)}
						on:onSuccess={onMpinSuccess}
					/>
				{:else if screen === screen_enum.FORGOT_MPIN_VERIFY_OTP}
					<VerifyOTP
						onSuccess={onValidateOTPSuccessViaForgotPin}
						{mobileNumber}
						{requestID}
						heading={otpScreenHeading}
						subHeading={otpScreenSubHeading}
					/>
				{:else if screen === screen_enum.SETUP_MPIN}
					<MpinSetup token={userCookie?.NTAccessToken} on:onSuccess={onMpinSuccess} />
				{/if}
				<div
					class="mt-4 w-full justify-center text-center text-sm md:justify-start md:text-start lg:w-120"
				>
					This site is protected by reCAPTCHA and the Google
					<a target="_blank" class="text-blue-primary" href="https://policies.google.com/privacy"
						>Privacy Policy</a
					>
					and
					<a target="_blank" class="text-blue-primary" href="https://policies.google.com/terms"
						>Terms of Service</a
					> apply.
				</div>
			</div>
		</div>
	{/if}
</section>
