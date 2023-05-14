<script lang="ts">
	import { PUBLIC_LOG_LEVEL, PUBLIC_LOG_ENABLED } from '$env/static/public';
	import Logger from '$lib/utils/logger';
	import { onMount, setContext } from 'svelte';
	import { update } from '$lib/utils/helpers/hydrated';
	import '../app.css';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';

	export let data;
	// Update store with Spark headers
	const { scheme, host, deviceType, token } = data;
	setContext('app', {
		scheme,
		host
	});
	// initialising logging for routes outside of (app) like login page
	Logger.init({
		batchSize: browser ? 10 : 1,
		baseUrl: `${scheme}://${host}${base}/api`,
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
			platform: deviceType?.platform
		}
	});

	onMount(() => {
		Logger.info({
			type: 'App Mounted on Client'
		});
		update();
	});
</script>

<slot />
