<script lang="ts">
	import { page } from '$app/stores';
	import BottomNavigation from '$components/BottomNavigation.svelte';
	import Header from '$components/Headers/Header.svelte';
	import { BOTTOM_NAVBARS } from '$lib/constants/navItems';
	$: pageMetaData = $page?.data?.layoutConfig;
</script>

<div class="flex-no-wrap fixed flex h-full w-full flex-col bg-grey">
	<header class="relative flex-shrink-0 bg-white">
		<Header />
	</header>
	<main class="scroll-lock w-full flex-grow overflow-auto">
		<section class="m-auto flex h-full max-w-8xl flex-wrap justify-center">
			<section class={`h-full w-full lg:pt-3 xl:w-4/5`}>
				<slot />
			</section>
		</section>
	</main>
	{#if pageMetaData?.showBottomNavigation}
		<footer>
			<BottomNavigation navs={BOTTOM_NAVBARS()} />
		</footer>
	{/if}
</div>
