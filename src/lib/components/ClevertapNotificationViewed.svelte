<script lang="ts">
	import Clevertap from '$lib/utils/Clevertap';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		Clevertap.renderNotificationViewed(data);
	});
</script>

<div />
