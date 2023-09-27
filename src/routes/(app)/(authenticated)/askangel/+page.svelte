<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { AUTH_STATE_ENUM, tokenStore } from '$lib/stores/TokenStore';
	import { headerStore } from '$lib/stores/HeaderStore';
	import { goto } from '$app/navigation';
	import AskAngel from '$components/AskAngel/AskAngel.svelte';

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	onMount(() => {
		if ($tokenStore.state === AUTH_STATE_ENUM?.LOGGED_IN && (isMobile || isTablet)) {
			$headerStore.showMobileHeader = false;
		} else {
			goto('discoverfunds');
		}
	});

	onDestroy(() => {
		if (isMobile || isTablet) {
			$headerStore.showMobileHeader = true;
		}
	});
</script>

<section>
	<AskAngel />
</section>
