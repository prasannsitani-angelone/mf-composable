<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { toastStore } from '$lib/stores/ToastStore';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import Link from '$components/Link.svelte';
	import { fade, fly } from 'svelte/transition';
	import type { ToastItem } from '$lib/types/IToast';

	let toastQueue: ToastItem[];
	let statusToast: ToastItem;
	$: toastQueue = [];

	export let delay = 4000;

	function beginToastShow(toasts: ToastItem[]) {
		toastQueue = [...toasts];
		if (Array.isArray($toastStore.toastQueue) && $toastStore.toastQueue.length > 0) {
			setTimeout(() => {
				toastQueue.shift();
				toastStore.set({
					toastQueue: toastQueue
				});
			}, delay);
		}
	}

	const manageStatusToast = (newStatusToast: ToastItem) => {
		statusToast = newStatusToast;
	};

	function stopToastShow() {
		toastStore.reset();
		toastQueue = [];
	}

	afterNavigate(() => {
		stopToastShow();
	});

	function getComputedBottom(index: number) {
		const bottom = `bottom: ${100 - index * 5}px;`;
		return bottom;
	}

	$: beginToastShow($toastStore.toastQueue);
	$: manageStatusToast($toastStore?.statusToast);
</script>

<section id="appToaster">
	{#if statusToast}
		<div
			in:fly={{ y: 100, duration: 1000 }}
			out:fade
			class="fixed bottom-0 left-0 right-0 z-100 mx-2 mb-20 flex w-fit max-w-[100vw] items-center justify-around rounded bg-red-light px-3 py-2 text-sm font-normal text-black-key sm:p-4 md:mx-auto {statusToast?.class ||
				''}"
		>
			<WMSIcon name="red-exclamation" width={36} height={36} />
			<div class="ml-2 sm:pr-10">{statusToast?.message}</div>
		</div>
	{/if}

	{#each toastQueue as toast, index (index)}
		<div
			in:fly={{ y: 100, duration: 1000 }}
			out:fade
			class=" fixed left-0 right-0 mx-auto flex w-fit max-w-[95vw] items-center justify-around rounded-md px-4 py-6 text-white max-sm:w-full sm:p-4 {toast.type ===
			'ERROR'
				? 'bg-red-errorDark'
				: ''} {toast.type === 'SUCCESS' ? 'bg-black-title' : ''} {toast.class || ''}"
			style={getComputedBottom(index)}
		>
			<div class="sm:pr-10">{toast.message}</div>
			{#if toast.type === 'SUCCESS' && toast.redirectLink && toast.redirectText}
				<Link
					to={toast.redirectLink}
					class="w-21 flex items-center"
					on:linkClicked={() => {
						toast?.callback?.(toast);
					}}
					><span class=" mr-1.5 text-sm font-medium">{toast.redirectText}</span><WMSIcon
						name="arrow-right-custom"
						width={6}
						height={12}
					/></Link
				>
			{/if}
		</div>
	{/each}
</section>
