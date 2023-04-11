<script lang="ts">
	import { PUBLIC_LOG_LEVEL, PUBLIC_LOG_ENABLED } from '$env/static/public';
	import Logger from '$lib/utils/logger';
	import { onMount, setContext } from 'svelte';
	import { update } from '$lib/utils/helpers/hydrated';
	import '../app.css';
	import { browser } from '$app/environment';

	export let data;
	// Update store with Spark headers
	const { scheme, host } = data;

	setContext('app', {
		scheme,
		host
	});

	Logger.init({
		batchSize: browser ? 10 : 1,
		baseUrl: `${scheme}://${host}/mutual-funds-v2/api`,
		url: '/logging',
		logLevel: PUBLIC_LOG_LEVEL,
		enabled: PUBLIC_LOG_ENABLED === 'true',
		initialised: true
	});

	onMount(() => {
		Logger.info({
			type: 'App Mounted on Client'
		});
		update();
	});
</script>

<slot />
