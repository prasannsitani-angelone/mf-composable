<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { tabClickNavigationAnalytics } from '$lib/analytics/DiscoverFunds';
	import { appStore } from '$lib/stores/SparkStore';
	import type { IBottomNavItem } from '$lib/types/IBottomNavItem';
	import type { INotification } from '$lib/types/INotifications';
	import type { INudge, NudgeDataType } from '$lib/types/INudge';
	import { useFetch } from '$lib/utils/useFetch';
	import { onMount } from 'svelte';
	import Link from './Link.svelte';
	import PendingActionCenterModal from './PendingActionCenter/PendingActionCenterModal.svelte';
	import { getPendingActionsData } from '$lib/api/actions';

	export let navs: IBottomNavItem[];

	const bottomNavClickAnalytics = (label: string) => {
		const eventMetaData = {
			'Tab Name': label
		};
		tabClickNavigationAnalytics(eventMetaData);
	};

	let nudgeDataLoading = false;
	let autopayDataLoading = false;
	let notifData: INotification;
	let autopayNudge: INudge | null;
	let showPendingActionCenter = false;
	let touchPosition: number | null = null;

	const toggleShowPendingActionCenter = () => {
		bottomNavClickAnalytics('Action Center');
		showPendingActionCenter = !showPendingActionCenter;
	};

	$: noOfPendingActions =
		(notifData?.instalmentFailedOrders?.length ? 1 : 0) +
		(notifData?.instalmentPending?.length ? 1 : 0) +
		(notifData?.paymentFailedOrders?.length ? 1 : 0) +
		(autopayNudge?.data?.sipCount || false ? 1 : 0);

	const getNudgeData = async () => {
		let nudgesData: NudgeDataType = {
			nudges: []
		};

		if (!$page.data.isGuest) {
			const url = `${PUBLIC_MF_CORE_BASE_URL}/nudges`;
			const res = await useFetch(url, {}, fetch);
			if (res.ok) {
				nudgesData = res?.data;
				return nudgesData;
			}
			return nudgesData;
		}
		return nudgesData;
	};

	const setAutopayNudge = (nudgeData: NudgeDataType) => {
		autopayNudge = null;
		(nudgeData?.nudges || [])?.forEach((item) => {
			if (item?.nudgesType === 'mandate') {
				autopayNudge = item;
			}
		});
	};

	const setAllNudgesData = () => {
		nudgeDataLoading = true;
		getNudgeData().then((nudgeData) => {
			setAutopayNudge(nudgeData);
		});
		nudgeDataLoading = false;
	};

	const setActionCenterData = async () => {
		setAllNudgesData();

		if (!$page.data.isGuest) {
			autopayDataLoading = true;
			notifData = await getPendingActionsData();
			autopayDataLoading = false;
		}
	};

	$: if (showPendingActionCenter) {
		setActionCenterData();
	}

	const handleTouchStart = (e: Event, isMouseEvent = false) => {
		const touchDown = isMouseEvent ? e?.clientY : e?.touches[0]?.clientY;
		touchPosition = touchDown;
	};

	const handleTouchMove = (e: Event, isMouseEvent = false) => {
		const touchDown = touchPosition;

		if (touchDown === null) {
			return;
		}

		const currentTouch = isMouseEvent ? e?.clientY : e?.touches[0]?.clientY;
		const diff = touchDown - currentTouch;

		if (diff > 5) {
			toggleShowPendingActionCenter();
		}

		touchPosition = null;
	};

	const addActionCenterSwipeEvents = () => {
		let pendingActionCenter = document.getElementById(`pending-action-center-entry`);
		if (pendingActionCenter) {
			pendingActionCenter.addEventListener('touchstart', handleTouchStart, { passive: true });
			pendingActionCenter.addEventListener('touchmove', handleTouchMove, { passive: true });
			pendingActionCenter.addEventListener('mousedown', (e) => handleTouchStart(e, true), {
				passive: true
			});
			pendingActionCenter.addEventListener('mouseup', (e) => handleTouchMove(e, true), {
				passive: true
			});
		}
	};

	onMount(async () => {
		addActionCenterSwipeEvents();
		setActionCenterData();
	});

	const handleBottomNavClick = (label: string) => {
		bottomNavClickAnalytics(label);
		setActionCenterData();
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
				<div
					id="pending-action-center-entry"
					class="relative flex h-full w-full items-start justify-center"
					on:click={toggleShowPendingActionCenter}
				>
					<svelte:component
						this={isActive ? nav.activeIcon : nav.icon}
						width={nav.width}
						height={nav.height}
						class="m-auto {noOfPendingActions && 'animate-bounce-2'}"
					/>
					{#if noOfPendingActions}
						<span
							class="absolute -top-2 right-3 inline-flex animate-bounce-2 items-center rounded-full bg-sell px-[6px] py-[2px] text-[10px] font-medium text-white"
						>
							{noOfPendingActions}
						</span>
					{/if}
				</div>
			{:else}
				<Link
					to={nav.path}
					on:linkClicked={() => handleBottomNavClick(nav.label)}
					class="inline-block w-full justify-center py-[9px] text-center"
					pathConversion={false}
					disableRedirect={isActive}
					callMethod={$appStore.openViaTabView && nav.callMethod}
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

{#if showPendingActionCenter}
	<PendingActionCenterModal
		on:backdropClick={toggleShowPendingActionCenter}
		pendingActionsData={notifData}
		{autopayNudge}
		bind:nudgeDataLoading
		bind:autopayDataLoading
	/>
{/if}
