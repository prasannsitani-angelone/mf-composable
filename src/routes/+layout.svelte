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
	import { appMount, webVitalsAnalytics } from '$lib/analytics/AppMounted';
	import logger from '$lib/utils/logger';
	import { deviceStore } from '$lib/stores/DeviceStore';
	import { PUBLIC_ANALYTICS_ENABLED, PUBLIC_ANALYTICS_URL } from '$env/static/public';
	import { BrowserSupportDefault, isBrowserSupported } from '$lib/utils/helpers/browserSupport';
	import LazyComponent from '$components/LazyComponent.svelte';
	import { hydratedStore } from '$lib/stores/AppHydratedStore';
	export let data;
	interface WebVitals {
		type: string;
		entry: object;
	}
	$: webVitals = <WebVitals[]>[];

	// Update store with Spark headers
	const { scheme, host, deviceType, token, sparkHeaders, isMissingHeaders, isGuest, sparkQuery } =
		data;
	// initialising logging for routes outside of (app) like login page
	Logger.init({
		batchSize: browser ? 10 : 1,
		baseUrl: `${scheme}//${host}${base}/api`,
		url: '/logging',
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

	const sendWebVitalsLogs = (vitals: WebVitals[]) => {
		if (vitals.length === 3) {
			// connection details
			const connectionDetails = {
				downlink: navigator?.connection?.downlink,
				effectiveType: navigator?.connection?.effectiveType,
				rtt: navigator?.connection?.rtt,
				saveData: navigator?.connection?.saveData,
				url: window?.location?.href
			};
			webVitalsAnalytics([...webVitals, connectionDetails]);
			logger.info({
				type: 'WebVitals',
				params: [...webVitals, connectionDetails]
			});
		}
	};

	onMount(async () => {
		update();
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
		Analytics.init({
			batchSize: 10,
			baseUrl: '',
			url: PUBLIC_ANALYTICS_URL,
			enabled: PUBLIC_ANALYTICS_ENABLED,
			initialised: true
		});

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
		const lcpObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			const lastEntry = entries[entries.length - 1];

			webVitals.push({
				type: 'LCP',
				entry: lastEntry
			});
			lcpObserver.disconnect();
			sendWebVitalsLogs(webVitals);
		});
		const fcpObserver = new PerformanceObserver((list) => {
			const paints = {};
			list.getEntries().forEach((entry) => {
				paints[entry.name] = entry.startTime;
			});
			webVitals.push({
				type: 'Paints',
				entry: paints
			});
			fcpObserver.disconnect();
			sendWebVitalsLogs(webVitals);
		});
		const ttfbObserver = new PerformanceObserver((entryList) => {
			const [pageNav] = entryList.getEntriesByType('navigation');

			webVitals.push({
				type: 'TTFB',
				entry: pageNav.responseStart
			});
			ttfbObserver.disconnect();
			sendWebVitalsLogs(webVitals);
		});

		fcpObserver.observe({ type: 'paint', buffered: true });
		lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
		ttfbObserver.observe({ type: 'navigation', buffered: true });

		browserDetails = isBrowserSupported();
	});
	const onVisibilityChange = (e: Event) => {
		if (e?.target?.visibilityState === 'hidden') {
			Logger?.flush();
			Analytics?.flush();
		}
	};

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>
<svelte:window on:visibilitychange={onVisibilityChange} />
<slot />

<LazyComponent
	when={!($appStore.isSparkIOSUser || $appStore.isWebView || browserDetails?.isSupported)}
	component={async () =>
		await import('$components/UnsupportedBrowser/UnsupportedBrowserComponent.svelte')}
	{browserDetails}
/>
