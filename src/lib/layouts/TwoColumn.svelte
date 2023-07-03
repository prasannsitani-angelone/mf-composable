<script lang="ts">
	import { page } from '$app/stores';
	import BottomNavigation from '$components/BottomNavigation.svelte';
	import Header from '$components/Headers/Header.svelte';
	import Overlay from '$components/Overlay.svelte';
	import { BOTTOM_NAVBARS } from '$lib/constants/navItems';
	$: pageMetaData = $page?.data?.layoutConfig;
	let searchFocused = false;
	const handleSearchFocus = (e: { detail: boolean }) => {
		searchFocused = e.detail;
	};
</script>

<div class="flex-no-wrap fixed flex h-full w-full flex-col bg-grey">
	<!-- header (navbar) Two column-->
	<header class="z-[70] flex-shrink-0 bg-white shadow-clg">
		<Header on:handleSearchFocus={handleSearchFocus} />
	</header>

	<!-- page body -->
	<main class="scroll-lock w-full flex-grow overflow-auto px-2 py-2 lg:pb-20">
		<!-- <slot name="breadcrumbs"></slot> -->
		{#if searchFocused}
			<Overlay containerClass="!z-60" />
		{/if}
		<section class="m-auto flex max-w-8xl flex-wrap justify-center">
			<section
				class="grid w-full grid-cols-[100%] lg:grid-cols-[66%_34%] lg:gap-5 lg:gap-y-1 lg:pt-3 xl:w-4/5"
			>
				<slot />
			</section>
		</section>
	</main>

	{#if pageMetaData.showBottomNavigation}
		<footer>
			<BottomNavigation navs={BOTTOM_NAVBARS()} />
		</footer>
	{/if}
</div>
