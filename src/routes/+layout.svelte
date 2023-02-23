<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import BottomNavigation from '$lib/components/BottomNavigation.svelte';
	import { BOTTOM_NAVBARS } from '$lib/constants/navItems';
	import { page } from '$lib/stores/PageStore.js';
	import { appStore } from '$lib/stores/SparkStore';
	import type { LayoutData } from './$types';
	import { tokenStore } from '$lib/stores/TokenStore';
	import { userStore } from '$lib/stores/UserStore';
	import { profileStore } from '$lib/stores/ProfileStore';

	export let data: LayoutData;
	// Update store with Spark headers
	const { sparkHeaders, tokenStore: token, user, profile } = data;
	// Update store with Spark headers
	appStore.updateStore({ ...sparkHeaders });
	tokenStore.updateStore({ ...token });
	userStore.updateStore({ ...user });
	profileStore.updateStore({ ...profile });
</script>

<div class="flex-no-wrap flex h-full w-full flex-col bg-gray-100">
	<header class="flex-shrink-0 bg-white">
		<Header />
	</header>

	<main
		class="scroll-lock m-auto flex w-full max-w-8xl flex-grow justify-center overflow-auto px-2 py-2"
	>
		<section class="w-full lg:mt-14 lg:grid lg:grid-cols-[66%_34%] lg:gap-5 xl:w-4/5">
			<slot />
		</section>
	</main>
	{#if $page.showBottomNavigation}
		<footer>
			<BottomNavigation navs={BOTTOM_NAVBARS} />
		</footer>
	{/if}
</div>
