<script lang="ts">
	import { page } from '$app/stores';
	import type { IBottomNavItem } from '$lib/types/IBottomNavItem';
	export let navs: IBottomNavItem[];
</script>

<section class="inset-x-0 z-40 flex-shrink-0 border-t-2 bg-white shadow-lg lg:hidden">
	<div id="tabs" class="flex items-baseline justify-between text-grey-disabled">
		{#each navs as nav (nav.path)}
			{@const isActive = nav.path?.includes('/orders/orderspage')
				? $page.url.pathname === nav.path ||
				  $page.url.pathname.includes('/orders/orderspage/sipbook')
				: $page.url.pathname === nav.path}
			<a href={nav.path} class="inline-block w-full justify-center py-3 text-center">
				<svelte:component this={isActive ? nav.activeIcon : nav.icon} class="m-auto mb-2" />
				<span
					class={`block text-[10px] font-semibold uppercase ${
						isActive ? 'text-blue-primary' : 'text-grey-medium'
					}`}>{nav.label}</span
				>
			</a>
		{/each}
	</div>
</section>
