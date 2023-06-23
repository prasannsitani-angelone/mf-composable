<script lang="ts">
	import { PUBLIC_LOG_LEVEL, PUBLIC_LOG_ENABLED, PUBLIC_ENV_NAME } from '$env/static/public';
	import Logger from '$lib/utils/logger';
	import { onMount } from 'svelte';
	import { update } from '$lib/utils/helpers/hydrated';
	import '../app.css';
	import { browser } from '$app/environment';
	import { deleteCookie } from '$lib/utils/helpers/cookie';
	import { getCookieOptions, getUserCookieName } from '$lib/utils/helpers/token';
	import { base } from '$app/paths';
	import Analytics from '$lib/utils/analytics';
	import { appStore } from '$lib/stores/SparkStore';
	import { appMount } from '$lib/analytics/AppMounted';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data;
	// Update store with Spark headers
	const { scheme, host, deviceType, token, sparkHeaders, isMissingHeaders, isGuest } = data;
	// initialising logging for routes outside of (app) like login page

	Logger.init({
		batchSize: browser ? 10 : 1,
		baseUrl: `${scheme}//${host}${base}/api`,
		url: '/logging',
		logLevel: PUBLIC_LOG_LEVEL,
		enabled: PUBLIC_LOG_ENABLED === 'true',
		initialised: true,
		headers: {
			'content-type': 'application/json',
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
			deviceID: sparkHeaders?.deviceid,
			sparkPlatform: sparkHeaders?.platform,
			platformVariant: sparkHeaders?.platformvariant,
			platformVersion: sparkHeaders?.platformversion,
			isGuest
		}
	});

	onMount(async () => {
		// to delete device id once app is loaded
		if ($page.url.searchParams.get('deviceid')) {
			$page.url.searchParams.delete('deviceid');
			await goto($page.url, {
				replaceState: true
			});
		}
		// connection details
		const connectionDetails = {
			downlink: navigator?.connection?.downlink,
			effectiveType: navigator?.connection?.effectiveType,
			rtt: navigator?.connection?.rtt,
			saveData: navigator?.connection?.saveData
		};
		Logger.info({
			type: 'App Mounted on Client',
			params: {
				...connectionDetails,
				isGuest,
				cookieDisabled: !window?.navigator?.cookieEnabled
			}
		});
		appMount({
			isGuest,
			cookieDisabled: !window?.navigator?.cookieEnabled,
			sparkPlatform: sparkHeaders?.platform,
			platformVariant: sparkHeaders?.platformvariant,
			browserVersion: deviceType?.browserFullVersion,
			browserName: deviceType?.browserName,
			isMissingHeaders,
			...connectionDetails
		});
		Logger.flush();
		// update headers
		appStore.updateStore({ ...sparkHeaders });

		update();
		if (PUBLIC_ENV_NAME === 'prod') {
			deleteCookie(getUserCookieName(), getCookieOptions(false));
		}
	});
	const onVisibilityChange = (e: Event) => {
		if (e?.target?.visibilityState === 'hidden') {
			Logger?.flush();
			Analytics?.flush();
		}
	};
</script>

<svelte:window on:visibilitychange={onVisibilityChange} />
<slot />
