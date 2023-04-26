<script lang="ts">
	import { page as appPage } from '$app/stores';
	import { appStore } from '$lib/stores/SparkStore';
	import type { LayoutData } from './$types';
	import { tokenStore } from '$lib/stores/TokenStore';
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

	export let data: LayoutData;
	const { sparkHeaders, tokenObj, profile, deviceType } = data;
	// Update store with Spark headers
	onMount(() => {
		tokenStore.updateStore({ ...tokenObj });
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
			platformVersion: sparkHeaders.platformversion
			// isGuest: tokenStore.logInState === USER_STATE_ENUM.GUEST_USER,
			// isLoggedIn: tokenStore.logInState === USER_STATE_ENUM.LOGGED_IN_USER,
			// loggedInState: tokenStore.logInState,
			// sessionID: tokenStore.sessionID,
		}
	});
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
