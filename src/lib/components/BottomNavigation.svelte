<script lang="ts">
	import { page } from '$app/stores';
	import { tabClickNavigationAnalytics } from '$lib/analytics/DiscoverFunds';
	import { cartStore } from '$lib/stores/CartStore';
	import type { IBottomNavItem } from '$lib/types/IBottomNavItem';
	import Link from './Link.svelte';
	export let navs: IBottomNavItem[];

	const bottomNavClickAnalytics = (label: string) => {
		const eventMetaData = {
			'Tab Name': label
		};
		tabClickNavigationAnalytics(eventMetaData);
	};
</script>

<section
	class="inset-x-0 z-40 flex-shrink-0 border-t-2 bg-background-alt shadow-lg lg:hidden {$$props?.class ||
		''}"
>
	<div id="tabs" class="flex items-baseline justify-between text-disabled">
		{#each navs as nav (nav.path)}
			{@const isActive = $page.url.pathname === nav.path}
			<Link
				to={nav.path}
				on:linkClicked={() => bottomNavClickAnalytics(nav.label)}
				class="inline-block w-full justify-center py-3 text-center"
				pathConversion={false}
				disableRedirect={isActive}
			>
				<svelte:component
					this={isActive ? nav.activeIcon : nav.icon}
					width={nav.width}
					height={nav.height}
					class="m-auto mb-2 {isActive ? 'text-primary' : 'text-body'}"
				/>
				<span
					class={`block text-[10px] font-medium uppercase ${
						isActive ? 'text-primary' : 'text-body'
					}`}>{nav.label} {nav.label === 'Cart' ? '(' + $cartStore.count + ')' : ''}</span
				>
			</Link>
		{/each}
	</div>
</section>
