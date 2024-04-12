<script lang="ts">
	import { PUBLIC_LOG_LEVEL, PUBLIC_LOG_ENABLED, PUBLIC_ENV_NAME } from '$env/static/public';
	import { pwaInfo } from 'virtual:pwa-info';
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
	import { appBackground, appForeground, appMount } from '$lib/analytics/AppMounted';
	import { deviceStore } from '$lib/stores/DeviceStore';
	import { BrowserSupportDefault, isBrowserSupported } from '$lib/utils/helpers/browserSupport';
	import LazyComponent from '$components/LazyComponent.svelte';
	import { hydratedStore } from '$lib/stores/AppHydratedStore';
	import { urlStore } from '$lib/stores/UrlStore';
	import { onLCP, onTTFB, onFCP, onINP, onCLS } from 'web-vitals/attribution';
	import { logWebVitals } from '$lib/utils/webVitals';
	import { registerRefreshTokenCallback } from '$lib/utils/nativeCallbacks';
	import { getThemeObject } from '$lib/stores/ThemeStore';

	function logDelta(metric) {
		// connectionDetails
		const connectionDetails = {
			downlink: navigator?.connection?.downlink,
			effectiveType: navigator?.connection?.effectiveType,
			rtt: navigator?.connection?.rtt,
			saveData: navigator?.connection?.saveData,
			url: window?.location?.href
		};

		logWebVitals(metric?.name, metric, parent?.location?.pathname, connectionDetails);
	}
	if (browser) {
		onCLS(logDelta);
		onINP(logDelta);
		onLCP(logDelta);
		onFCP(logDelta);
		onTTFB(logDelta);
	}
	export let data;

	// Update store with Spark headers
	const {
		scheme,
		host,
		deviceType,
		token,
		sparkHeaders,
		isMissingHeaders,
		isGuest,
		sparkQuery,
		urlSource
	} = data;
	// initialising logging for routes outside of (app) like login page
	Logger.init({
		batchSize: browser ? 10 : 1,
		baseUrl: `${scheme}//${host}${base}/api`,
		url: '/logging',
		NBULoggerUrl: '',
		NBULoggeraccessToken: '',
		logLevel: PUBLIC_LOG_LEVEL,
		enabled: PUBLIC_LOG_ENABLED === 'true',
		initialised: true,
		consoleOnServer: true,
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
			deviceID: sparkHeaders?.deviceid || sparkQuery?.deviceid,
			sparkPlatform: sparkHeaders?.platform?.toLowerCase() || 'mf-web',
			platformVariant: sparkHeaders?.platformvariant?.toLowerCase() || 'web',
			platformVersion: sparkHeaders?.platformversion,
			isGuest
		}
	});

	let browserDetails = BrowserSupportDefault;

	onMount(async () => {
		update();
		registerRefreshTokenCallback();
		hydratedStore.set({ isHydrated: true });
		Logger.info({
			type: 'IS SW enabled',
			params: {
				isEnabled: navigator?.serviceWorker ? true : false
			}
		});
		if (pwaInfo) {
			try {
				const { registerSW } = await import('virtual:pwa-register');
				registerSW({
					immediate: true,
					onRegistered() {
						Logger.debug({ type: 'SW registered' });
					},
					onRegisterError(error: Error) {
						Logger.error({ type: 'SW registration error', params: error });
					}
				});
			} catch (e) {
				Logger.error({ type: 'virtual:pwa-register - ERRROR', params: e });
			}

			navigator?.serviceWorker?.addEventListener('message', async (event) => {
				if (event?.data?.meta === 'workbox-broadcast-update') {
					// Reload when data changed
					// window.location.reload();
				}
			});
		}
		// update data in stores
		appStore.updateStore({ ...sparkHeaders });
		deviceStore.updateStore({ ...deviceType });
		urlStore.updateStore({ urlSource });

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
				cookieDisabled: !window?.navigator?.cookieEnabled,
				isMissingHeaders
			}
		});
		appMount({
			isGuest,
			cookieDisabled: !window?.navigator?.cookieEnabled,
			sparkPlatform: sparkHeaders?.platform?.toLowerCase() || 'mf-web',
			platformVariant: sparkHeaders?.platformvariant?.toLowerCase() || 'web',
			browserVersion: deviceType?.browserFullVersion,
			browserName: deviceType?.browserName,
			isMissingHeaders,
			...connectionDetails
		});

		if (PUBLIC_ENV_NAME === 'prod') {
			deleteCookie(getUserCookieName(), getCookieOptions(false));
		}

		browserDetails = isBrowserSupported();

		applyThemeClassToBody();
	});

	// adding the theme class name to body tag so that theme variables can be applied.
	const applyThemeClassToBody = () => {
		if (browser) {
			requestAnimationFrame(() => {
				document?.body?.classList?.add(theme.name);
			});
		}
	};

	const onVisibilityChange = (e: Event) => {
		if (e?.target?.visibilityState === 'hidden') {
			appBackground();
			Logger?.flush();
			Analytics?.flush();
		} else if (e?.target?.visibilityState === 'visible') {
			appForeground();
		}
	};

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	const theme = getThemeObject(sparkHeaders.theme);
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>
<svelte:window on:visibilitychange={onVisibilityChange} />

<div id="theme-layout" class={theme.name}>
	<slot />

	<LazyComponent
		when={!($appStore.isSparkIOSUser || $appStore.isWebView || browserDetails?.isSupported)}
		component={async () =>
			await import('$components/UnsupportedBrowser/UnsupportedBrowserComponent.svelte')}
		{browserDetails}
	/>
</div>
