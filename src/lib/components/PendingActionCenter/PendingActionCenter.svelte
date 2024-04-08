<script lang="ts">
	import { tabClickNavigationAnalytics } from '$lib/analytics/DiscoverFunds';
	import type { INotification } from '$lib/types/INotifications';
	import { notifyPopupWindowChange } from '$lib/utils/callNativeMethod';
	import { registerNativeClosePopUpWindowCallback } from '$lib/utils/nativeCallbacks';
	import { onMount } from 'svelte';
	import PendingActionCenterModal from './PendingActionCenterModal.svelte';
	import { pendingActionsCloseAnalytics, pendingActionsExpandClickAnalytics } from './analytics';
	import NotificationsStore from '$lib/stores/NotificationStore';
	import { page } from '$app/stores';
	import NotificationIcon from '$lib/images/icons/Notification.svelte';
	import type { IBottomNavItem } from '$lib/types/IBottomNavItem';

	let showPendingActionCenter = false;
	let touchPosition: number | null = null;
	let notifData: INotification;

	export let isActive = false;
	export let nav: IBottomNavItem;
	export let autopayDataLoading: boolean;
	export let nudgeDataLoading: boolean;

	$: noOfPendingActions =
		(notifData?.instalmentFailedOrders?.length ? 1 : 0) +
		(notifData?.instalmentPending?.length ? 1 : 0) +
		(notifData?.paymentFailedOrders?.length ? 1 : 0) +
		(notifData?.sipWithoutMandate?.length || 0);

	$: if (showPendingActionCenter) {
		setActionCenterData();
	}

	$: deviceType = $page.data.deviceType;

	const bottomNavClickAnalytics = (label: string) => {
		const eventMetaData = {
			'Tab Name': label
		};
		tabClickNavigationAnalytics(eventMetaData);
	};

	const handleDeviceBackClick = () => {
		registerNativeClosePopUpWindowCallback(() => {
			if (showPendingActionCenter) {
				toggleShowPendingActionCenter();
			}
		});
	};

	const toggleShowPendingActionCenter = () => {
		if (showPendingActionCenter) {
			pendingActionsCloseAnalytics();
		} else {
			const eventMetaData = {
				Actions: noOfPendingActions
			};
			pendingActionsExpandClickAnalytics(eventMetaData);
			bottomNavClickAnalytics('Action Center');
		}
		showPendingActionCenter = !showPendingActionCenter;
		notifyPopupWindowChange({ isOpen: showPendingActionCenter });
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

	const setActionCenterData = async () => {
		if (!$page.data.isGuest) {
			autopayDataLoading = true;
			NotificationsStore.subscribe((notif) => {
				notifData = notif;
				autopayDataLoading = false;
			});
		}
	};

	const getActionCenterIcon = (nav?: IBottomNavItem | undefined, isActive?: boolean) => {
		if (deviceType?.isDesktop) {
			return NotificationIcon;
		} else {
			return isActive ? nav?.activeIcon : nav?.icon;
		}
	};

	onMount(() => {
		setActionCenterData();
		addActionCenterSwipeEvents();
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	id="pending-action-center-entry"
	class="relative flex items-start justify-center ${deviceType?.isDesktop ? 'h-full w-full' : ''}"
	on:click={toggleShowPendingActionCenter}
	on:keypress={toggleShowPendingActionCenter}
	tabindex="-1"
>
	<svelte:component
		this={getActionCenterIcon(nav, isActive)}
		width={nav?.width}
		height={nav?.height}
		class="m-auto {noOfPendingActions && !deviceType?.isDesktop && 'animate-bounce-2'}"
	/>
	{#if noOfPendingActions}
		<span
			class="absolute -top-2 right-0 inline-flex items-center rounded-full bg-sell px-[6px] py-[2px] text-[10px] font-medium text-white {$page
				.data?.deviceType?.isDesktop
				? ''
				: 'animate-bounce-2'}"
		>
			{noOfPendingActions}
		</span>
	{/if}
</div>

{#if showPendingActionCenter}
	<PendingActionCenterModal
		on:modalMounted={handleDeviceBackClick}
		on:backdropClick={toggleShowPendingActionCenter}
		pendingActionsData={notifData}
		bind:nudgeDataLoading
		bind:autopayDataLoading
	/>
{/if}
