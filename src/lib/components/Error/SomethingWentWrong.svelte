<script lang="ts">
	import SomethingWentWrongIllustration from '$lib/images/SomethingWentWrongIllustration.svelte';
	import { toastStore } from '$lib/stores/ToastStore';
	import { createEventDispatcher, onMount } from 'svelte';
	import { BtnVariant, Button } from 'svelte-components';
	import { invalidateAll } from '$app/navigation';

	export let showPageLayout = false;

	const dispatch = createEventDispatcher();

	const handleRetryClick = () => {
		dispatch('retryButtonClick');

		if (navigator?.onLine) {
			invalidateAll();
		} else {
			updateStatusToast();
		}
	};

	const updateStatusToast = () => {
		toastStore?.updateStatusToast({
			type: 'STATUS',
			message: 'You are not connected to the internet. Please check your connection and retry'
		});
	};

	onMount(() => {
		if (!navigator?.onLine) {
			updateStatusToast();
		}
	});
</script>

<article
	class="-mx-2 flex items-center justify-center rounded-lg bg-background-alt px-8 md:mx-0 {!showPageLayout &&
		'cardHeight shadow-csm'} {$$props?.class || ''}"
>
	<section class="flex flex-col items-center justify-center">
		<svelte:component this={SomethingWentWrongIllustration} />
		<article>
			<div class="text-normal mt-4 font-medium text-title">Something Went Wrong</div>
		</article>
		<article>
			<div class="mt-2 text-center text-sm font-normal text-body">
				Please try again in some time
			</div>
		</article>
		<article>
			<Button
				class="mt-4 !h-fit !min-h-0 px-4 py-3 text-xs font-medium"
				onClick={handleRetryClick}
				variant={BtnVariant?.Contained}
			>
				Retry
			</Button>
		</article>
	</section>
</article>

<style>
	.cardHeight {
		height: calc(100vh - 180px);
	}

	.cardHeightNoBottomNav {
		height: calc(100vh - 96px);
	}
</style>
