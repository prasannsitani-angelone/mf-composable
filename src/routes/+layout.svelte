<script>
	import { PUBLIC_LOG_LEVEL, PUBLIC_LOG_ENABLED } from '$env/static/public';
	import Logger from '$lib/utils/logger';
	import { onMount } from 'svelte';
	import { update } from '$lib/utils/helpers/hydrated';
	import '../app.css';

	onMount(() => {
		Logger.init({
			batchSize: 10,
			baseUrl: '/mutual-funds-v2/api',
			url: '/logging',
			logLevel: PUBLIC_LOG_LEVEL,
			enabled: PUBLIC_LOG_ENABLED === 'true',
			initialised: true
		});
		Logger.info({
			type: 'App Mounted on Client'
		});
		update();
	});
</script>

<slot />
