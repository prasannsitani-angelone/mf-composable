<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import BottomNavigation from '$lib/components/BottomNavigation.svelte';
	import { BOTTOM_NAVBARS } from '$lib/constants/navItems';
	import { page } from '$lib/stores/PageStore.js';
	import { appStore } from '$lib/stores/SparkStore';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { useFetch } from '$lib/utils/useFetch';
	import { tokenStore } from '$lib/stores/TokenStore';

	export let data: LayoutData;
	useFetch('https://www.google.com', {
		headers: {
			'x-requestid': 'ansk'
		}
	});
	// Update store with Spark headers
	appStore.updateStore({ ...data.sparkHeaders });
	tokenStore.updateStore({ ...data.tokenStore });
	// onMount(() => {
	// 	useFetch('https://www.google.com', {
	// 		headers: {
	// 			'x-requestid': 'ansk'
	// 		}
	// 	});
	// });
</script>

<div class="flex-no-wrap flex h-full w-full flex-col bg-gray-100">
	<header class="flex-shrink-0 bg-white">
		<Header />
	</header>

	<main class="scroll-lock m-auto flex w-full flex-grow justify-center overflow-auto px-2 py-2">
		<section class="w-full">
			<slot />
		</section>
	</main>
	{#if $page.showBottomNavigation}
		<footer>
			<BottomNavigation navs={BOTTOM_NAVBARS} />
		</footer>
	{/if}
</div>
