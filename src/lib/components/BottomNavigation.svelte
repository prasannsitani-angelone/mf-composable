<script lang="ts">
	import { page } from '$app/stores';
	import { tabClickNavigationAnalytics } from '$lib/analytics/DiscoverFunds';
	import { appStore, HOME_TABS_MAP } from '$lib/stores/SparkStore';
	import type { IBottomNavItem } from '$lib/types/IBottomNavItem';
	import Link from './Link.svelte';
	import PendingActionCenter from './PendingActionCenter/PendingActionCenter.svelte';
	import { bottomTabStore } from '$lib/stores/BottomTabStore';

	export let navs: IBottomNavItem[];

	const bottomNavClickAnalytics = (label: string) => {
		const eventMetaData = {
			'Tab Name': label
		};
		tabClickNavigationAnalytics(eventMetaData);
	};

	let nudgeDataLoading = false;
	let autopayDataLoading = false;

	const handleBottomNavClick = (label: string) => {
		bottomTabStore.bottomTabClicked();
		bottomNavClickAnalytics(label);
	};
</script>

<section
	class="inset-x-0 z-40 flex-shrink-0 border-t-2 bg-background-alt shadow-lg lg:hidden {$$props?.class ||
		''}"
>
	<div id="tabs" class="flex items-center justify-between text-disabled">
		{#each navs as nav (nav.path)}
			{@const isActive = $page.url.pathname === nav.path}
			{#if nav.name === 'Pending Action Center'}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->

				<PendingActionCenter {isActive} {nav} {autopayDataLoading} {nudgeDataLoading} />
			{:else}
				<Link
					to={nav.path}
					on:linkClicked={() => handleBottomNavClick(nav.label)}
					class="inline-block w-full justify-center py-[9px] text-center"
					pathConversion={false}
					disableRedirect={isActive}
					callMethod={($appStore.openViaTabView ||
						$appStore.homeTabs?.includes(HOME_TABS_MAP.mf)) &&
						nav.callMethod}
					method={nav.method}
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
						}`}>{nav.label}</span
					>
				</Link>
			{/if}
		{/each}
	</div>
</section>
