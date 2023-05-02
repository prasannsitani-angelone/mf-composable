<script lang="ts">
	import { page as appPage } from '$app/stores';
	import { goto } from '$app/navigation';
	import { appStore } from '$lib/stores/SparkStore';
	import type { LayoutData } from './$types';
	import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
	import { profileStore } from '$lib/stores/ProfileStore';
	import { onMount } from 'svelte';
	import Logger from '$lib/utils/logger';
	import Default from '$lib/layouts/Default.svelte';
	import TwoColumn from '$lib/layouts/TwoColumn.svelte';
	import TwoColumnReverse from '$lib/layouts/TwoColumnReverse.svelte';
	import TwoColumnRightLarge from '$lib/layouts/TwoColumnRightLarge.svelte';
	import FullHeightWithoutPadding from '$lib/layouts/FullHeightWithoutPadding.svelte';
	import { browser } from '$app/environment';
	import Analytics from '$lib/utils/analytics';
	import { PUBLIC_ANALYTICS_ENABLED, PUBLIC_ANALYTICS_URL } from '$env/static/public';
	import { deviceStore } from '$lib/stores/DeviceStore';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { externalNavigation } from '$lib/stores/ExtrenalNavigationStore';
	import ResultPopup from '$components/Popup/ResultPopup.svelte';
	import { isTokenExpired } from '$lib/utils/helpers/token';
	import Overlay from '$components/Overlay.svelte';

	$: isModalOpen = $externalNavigation.active;
	// Update store with Spark headers

	export let data: LayoutData;
	const { sparkHeaders, tokenObj, profile, deviceType, isGuest, scheme, host, token } = data;
	// Update store with Spark headers
	onMount(() => {
		// $externalNavigation.active = false;
		const authState = isGuest
			? isTokenExpired(tokenObj?.guestToken)
				? AUTH_STATE_ENUM.GUEST_LOGGED_OUT
				: AUTH_STATE_ENUM.GUEST_LOGGED_IN
			: isTokenExpired(tokenObj?.userToken?.NTAccessToken)
			? AUTH_STATE_ENUM.LOGGED_OUT
			: AUTH_STATE_ENUM.LOGGED_IN;
		tokenStore.updateStore({ ...tokenObj, state: authState });
		appStore.updateStore({ ...sparkHeaders });
		profileStore.updateStore({ ...profile });
		deviceStore.updateStore({ ...deviceType });
		Analytics.init({
			batchSize: 10,
			baseUrl: '',
			url: PUBLIC_ANALYTICS_URL,
			enabled: PUBLIC_ANALYTICS_ENABLED,
			initialised: true
		});
	});
	// initialising logging again with all new headers for routes of (app)
	Logger.init({
		headers: {
			accessToken: token,
			isSSR: !browser,
			isMobile: deviceType?.isMobile,
			model: deviceType?.model,
			os: deviceType?.osName || deviceType?.os,
			osVersion: deviceType?.osVersion,
			deviceUserAgent: deviceType?.userAgent || deviceType?.ua,
			vendor: deviceType?.vendor,
			isDesktop: deviceType?.isBrowser,
			browserVersion: deviceType?.browserFullVersion,
			browserName: deviceType?.browserName,
			isCrawler: deviceType?.isCrawler,
			platform: deviceType?.platform,
			userId: profile?.clientId || '',
			deviceID: sparkHeaders.deviceid,
			sparkPlatform: sparkHeaders.platform,
			platformVariant: sparkHeaders.platformvariant,
			platformVersion: sparkHeaders.platformversion,
			isGuest
			// isLoggedIn: tokenStore.logInState === USER_STATE_ENUM.LOGGED_IN_USER,
			// loggedInState: tokenStore.logInState,
			// sessionID: tokenStore.sessionID,
		}
	});
	const navigateToLoginPage = async () => {
		await goto(`${scheme}://${host}/mutual-funds/login`, { replaceState: true });
	};
</script>

{#if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN'}
	<TwoColumn>
		<slot />
	</TwoColumn>
{:else if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN_REVERSE'}
	<TwoColumnReverse>
		<slot />
	</TwoColumnReverse>
{:else if $appPage.data?.layoutConfig?.layoutType === 'TWO_COLUMN_RIGHT_LARGE'}
	<TwoColumnRightLarge>
		<slot />
	</TwoColumnRightLarge>
{:else if $appPage.data?.layoutConfig?.layoutType === 'FULL_HEIGHT_WITHOUT_PADDING'}
	<FullHeightWithoutPadding>
		<slot />
	</FullHeightWithoutPadding>
{:else}
	<Default>
		<slot />
	</Default>
{/if}
{#if isModalOpen}
	<Overlay class="justify-center">
		<LoadingIndicator svgClass={'!w-16 !h-16'} />
	</Overlay>
{/if}

{#if appStore.isSparkUser() && $tokenStore.state === AUTH_STATE_ENUM.LOGGED_OUT}
	<ResultPopup
		popupType="FAILURE"
		title="You have been logged out"
		text="Please close the app and open again."
		class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
	>
		<div slot="popupFooter" />
	</ResultPopup>
{:else if $tokenStore.state === AUTH_STATE_ENUM.LOGGED_OUT}
	<ResultPopup
		popupType="FAILURE"
		title="You have been logged out"
		text="You will be redirected to login page"
		class="w-full rounded-t-2xl rounded-b-none p-6 px-10 pb-9 sm:px-12 sm:py-20 md:rounded-lg"
		isModalOpen
		handleButtonClick={navigateToLoginPage}
		buttonTitle="DONE"
		buttonClass="mt-8 w-48 rounded cursor-default md:cursor-pointer"
		buttonVariant="contained"
	/>
{/if}
