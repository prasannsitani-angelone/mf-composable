<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { toastStore } from '$lib/stores/ToastStore';
	import { WMSIcon } from 'wms-ui-component';
	import Link from '$components/Link.svelte';
	import { fade, fly } from 'svelte/transition';
	import type { ToastItem } from '$lib/types/IToast';

	let toastQueue: ToastItem[];
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
</script>

<section id="appToaster">
	{#each toastQueue as toast, index (index)}
		<div
			in:fly={{ y: 100, duration: 1000 }}
			out:fade
			class=" fixed left-0 right-0 mx-auto flex w-fit max-w-[95vw] items-center justify-around rounded-md px-4 py-6 text-white max-sm:w-full sm:p-4 {toast.type ===
			'ERROR'
				? 'bg-red-errorDark'
				: ''} {toast.type === 'SUCCESS' ? 'bg-black-title' : ''}"
			style={getComputedBottom(index)}
		>
			<div class="sm:pr-10">{toast.message}</div>
			{#if toast.type === 'SUCCESS' && toast.redirectLink && toast.redirectText}
				<Link to={toast.redirectLink} class="w-21 flex items-center"
					><span class=" mr-1.5 text-sm font-semibold">{toast.redirectText}</span><WMSIcon
						name="arrow-right-custom"
						width={6}
						height={12}
					/></Link
				>
			{/if}
		</div>
	{/each}
</section>
