<script lang="ts">
	import { page } from '$app/stores';
	import BottomNavigation from '$components/BottomNavigation.svelte';
	import Header from '$components/Header.svelte';
	import { BOTTOM_NAVBARS } from '$lib/constants/navItems';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	$: pageMetaData = $page?.data?.layoutConfig;
	const appContext: AppContext = getContext('app');
</script>

<div class="flex-no-wrap fixed flex h-full w-full flex-col bg-grey">
	<header class="flex-shrink-0 bg-white shadow-clg">
		<Header />
	</header>
	<main class="scroll-lock w-full flex-grow overflow-auto px-2 py-2 lg:pb-20">
		<section class="m-auto flex max-w-8xl flex-wrap justify-center">
			<section class={`xl:w-4/5' w-full lg:pt-3`}>
				<slot />
			</section>
		</section>
	</main>
	{#if pageMetaData?.showBottomNavigation}
		<footer>
			<BottomNavigation navs={BOTTOM_NAVBARS(appContext.scheme, appContext.host)} />
		</footer>
	{/if}
</div>
