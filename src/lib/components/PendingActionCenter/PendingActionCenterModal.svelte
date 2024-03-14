<script setup lang="ts">
	import SetupAutopayCard from '$components/Cohorts/SetupAutopayCard.svelte';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';
	import type { INotification } from '$lib/types/INotifications';
	import type { INudge } from '$lib/types/INudge';
	import { createEventDispatcher } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	import ActionsDashboard from '../../../routes/(app)/(authenticated)/pendingActions/components/ActionsDashboard.svelte';
	import PendingActionsLoader from './PendingActionsLoader.svelte';

	const dispatch = createEventDispatcher();
	export let pendingActionsData: INotification;
	export let autopayNudge: INudge | null;
	export let nudgeDataLoading = false;
	export let autopayDataLoading = false;

	$: isNoPendingActions =
		(pendingActionsData?.instalmentFailedOrders?.length ||
			0 + pendingActionsData?.instalmentPending?.length ||
			0 + pendingActionsData?.paymentFailedOrders?.length ||
			0 + autopayNudge?.data?.sipCount ||
			0) === 0;

	const backdropClick = () => {
		dispatch('backdropClick');
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ModalWithAnimation showIconOnTop={true} closeModal={backdropClick} isModalOpen>
	<svelte:fragment slot="closingIcon">
		<div on:click={backdropClick} class="flex items-center justify-center">
			<div class="mb-4 w-fit rounded-full bg-background p-3">
				<WMSIcon name="cross" stroke="var(--PRIMARY)" height={24} width={24} />
			</div>
		</div>
	</svelte:fragment>
	<div
		class="sm:flex-column !static w-screen items-stretch rounded-b-none rounded-t-2xl bg-background sm:min-h-[460px] sm:w-120 sm:justify-center sm:rounded-lg sm:px-14 sm:py-[72px]"
	>
		{#if autopayDataLoading || nudgeDataLoading}
			<h2 class="mb-2 pb-2 pt-6 text-center text-base font-medium text-title">Pending Actions</h2>
			<PendingActionsLoader />
		{:else if isNoPendingActions}
			<div class="flex flex-col items-center gap-2 pb-8 pt-6 text-body">
				<WMSIcon name="tick-in-circle-outline" stroke="var(--BODY)" height={24} width={24} />
				<h2 class="text-sm font-normal text-body">No Pending Actions</h2>
				<p class="m-auto w-[268px] text-center text-xs font-normal text-body">
					Great job! You are keeping your investments in good shape
				</p>
			</div>
		{:else}
			<h2 class="mb-2 pb-2 pt-6 text-center text-base font-medium text-title">Pending Actions</h2>
			<section
				class="flex max-h-[calc(100vh-190px)] flex-col gap-2 overflow-auto px-4 pb-8 md:px-8"
			>
				<SetupAutopayCard
					sipPendingCount={autopayNudge?.data?.sipCount}
					sipTotalAmount={autopayNudge?.amount}
				/>
				<ActionsDashboard actionsData={pendingActionsData} />
			</section>
		{/if}
	</div>
</ModalWithAnimation>
