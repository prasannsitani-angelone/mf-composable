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
	<!-- header (navbar) -->
	<header class="flex-shrink-0 bg-white shadow-clg">
		<Header />
	</header>

	<!-- page body -->
	<main class="scroll-lock w-full flex-grow overflow-auto px-2 py-2 lg:pb-20">
		<section class="m-auto flex max-w-8xl flex-wrap justify-center">
			<section
				class="w-full max-sm:flex max-sm:flex-col-reverse max-sm:self-baseline max-sm:overflow-auto lg:grid lg:grid-cols-[66%_34%] lg:gap-5 lg:pt-3 xl:w-4/5"
			>
				<slot />
			</section>
		</section>
	</main>
	{#if pageMetaData.showBottomNavigation}
		<footer>
			<BottomNavigation navs={BOTTOM_NAVBARS(appContext.scheme, appContext.host)} />
		</footer>
	{/if}
</div>
