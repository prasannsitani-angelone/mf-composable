<script lang="ts">
	import {
		PUBLIC_LOG_LEVEL,
		PUBLIC_LOG_ENABLED,
		PUBLIC_ENV_NAME,
		PUBLIC_ADD_VWO_SNIPPET,
		PUBLIC_NBU_LOGGER_URL
	} from '$env/static/public';
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
	import { PUBLIC_ANALYTICS_ENABLED, PUBLIC_ANALYTICS_URL } from '$env/static/public';
	import { BrowserSupportDefault, isBrowserSupported } from '$lib/utils/helpers/browserSupport';
	import LazyComponent from '$components/LazyComponent.svelte';
	import { hydratedStore } from '$lib/stores/AppHydratedStore';
	import { urlStore } from '$lib/stores/UrlStore';
	import { onLCP, onTTFB, onFCP, onINP, onCLS } from 'web-vitals/attribution';
	import { logWebVitals } from '$lib/utils/webVitals';

	function logDelta(metric) {
		logWebVitals(metric?.name, metric);
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
					window.location.reload();
				}
			});
		}
		// update data in stores
		appStore.updateStore({ ...sparkHeaders });
		deviceStore.updateStore({ ...deviceType });
		urlStore.updateStore({ urlSource });
		Analytics.init({
			batchSize: 10,
			baseUrl: '',
			url: PUBLIC_ANALYTICS_URL,
			enabled: PUBLIC_ANALYTICS_ENABLED,
			initialised: true,
			NBULoggerUrl: PUBLIC_NBU_LOGGER_URL,
			headers: {
				accessToken: token
			}
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

		browserDetails = isBrowserSupported();
	});
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
</script>

<svelte:head>
	{@html webManifest}
	{#if PUBLIC_ADD_VWO_SNIPPET === 'true'}
		<!-- Start VWO Async SmartCode -->
		<link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
		<script type="text/javascript" id="vwoCode">
			window._vwo_code ||
				(function () {
					var account_id = 795415,
						version = 2.0,
						settings_tolerance = 2000,
						hide_element = 'body',
						hide_element_style =
							'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important',
						/* DO NOT EDIT BELOW THIS LINE */
						f = false,
						w = window,
						d = document,
						v = d.querySelector('#vwoCode'),
						cK = '_vwo_' + account_id + '_settings',
						cc = {};
					try {
						var c = JSON.parse(localStorage.getItem('_vwo_' + account_id + '_config'));
						cc = c && typeof c === 'object' ? c : {};
					} catch (e) {}
					var stT = cc.stT === 'session' ? w.sessionStorage : w.localStorage;
					code = {
						use_existing_jquery: function () {
							return typeof use_existing_jquery !== 'undefined' ? use_existing_jquery : undefined;
						},
						library_tolerance: function () {
							return typeof library_tolerance !== 'undefined' ? library_tolerance : undefined;
						},
						settings_tolerance: function () {
							return cc.sT || settings_tolerance;
						},
						hide_element_style: function () {
							return '{' + (cc.hES || hide_element_style) + '}';
						},
						hide_element: function () {
							return typeof cc.hE === 'string' ? cc.hE : hide_element;
						},
						getVersion: function () {
							return version;
						},
						finish: function () {
							if (!f) {
								f = true;
								var e = d.getElementById('_vis_opt_path_hides');
								if (e) e.parentNode.removeChild(e);
							}
						},
						finished: function () {
							return f;
						},
						load: function (e) {
							var t = this.getSettings(),
								n = d.createElement('script'),
								i = this;
							if (t) {
								n.textContent = t;
								d.getElementsByTagName('head')[0].appendChild(n);
								if (!w.VWO || VWO.caE) {
									stT.removeItem(cK);
									i.load(e);
								}
							} else {
								n.fetchPriority = 'high';
								n.src = e;
								n.type = 'text/javascript';
								n.onerror = function () {
									_vwo_code.finish();
								};
								d.getElementsByTagName('head')[0].appendChild(n);
							}
						},
						getSettings: function () {
							try {
								var e = stT.getItem(cK);
								if (!e) {
									return;
								}
								e = JSON.parse(e);
								if (Date.now() > e.e) {
									stT.removeItem(cK);
									return;
								}
								return e.s;
							} catch (e) {
								return;
							}
						},
						init: function () {
							if (d.URL.indexOf('__vwo_disable__') > -1) return;
							var e = this.settings_tolerance();
							w._vwo_settings_timer = setTimeout(function () {
								_vwo_code.finish();
								stT.removeItem(cK);
							}, e);
							var t = d.currentScript,
								n = d.createElement('style'),
								i = this.hide_element(),
								r = t && !t.async && i ? i + this.hide_element_style() : '',
								c = d.getElementsByTagName('head')[0];
							n.setAttribute('id', '_vis_opt_path_hides');
							v && n.setAttribute('nonce', v.nonce);
							n.setAttribute('type', 'text/css');
							if (n.styleSheet) n.styleSheet.cssText = r;
							else n.appendChild(d.createTextNode(r));
							c.appendChild(n);
							this.load(
								'https://dev.visualwebsiteoptimizer.com/j.php?a=' +
									account_id +
									'&u=' +
									encodeURIComponent(d.URL) +
									'&vn=' +
									version
							);
						}
					};
					w._vwo_code = code;
					code.init();
				})();
		</script>
		<!-- End VWO Async SmartCode -->
	{/if}
</svelte:head>
<svelte:window on:visibilitychange={onVisibilityChange} />
<slot />

<LazyComponent
	when={!($appStore.isSparkIOSUser || $appStore.isWebView || browserDetails?.isSupported)}
	component={async () =>
		await import('$components/UnsupportedBrowser/UnsupportedBrowserComponent.svelte')}
	{browserDetails}
/>
