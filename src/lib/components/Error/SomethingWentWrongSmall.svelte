<script lang="ts">
	import { toastStore } from '$lib/stores/ToastStore';
	import { onMount } from 'svelte';
	import { BtnVariant, Button, WMSIcon } from 'svelte-components';

	const handleRetryClick = () => {
		window?.location?.reload();
	};

	let statusTimeout;

	const updateStatusToast = () => {
		if (statusTimeout) {
			clearTimeout(statusTimeout);
		}

		toastStore?.updateStatusToast({
			type: 'STATUS',
			message: 'You are not connected to the internet. Please check your connection and retry'
		});

		statusTimeout = setTimeout(() => {
			toastStore?.updateStatusToast(null);
		}, 4000);
	};

	onMount(() => {
		if (!navigator?.onLine) {
			updateStatusToast();
		}
	});
</script>

<section
	class="cardHeight mt-2 flex flex-col items-center justify-center rounded-lg bg-white px-8 py-4 shadow-csm {$$props?.class}"
>
	<WMSIcon name="red-exclamation" />
	<div class="mt-2 text-center text-sm font-normal text-black-bolder">Something Went Wrong</div>
	<div class="text-center text-sm font-normal text-black-bolder">Please try again in some time</div>
	<Button
		class="mt-3 !h-fit !min-h-0 px-4 py-3 text-xs font-medium"
		onClick={handleRetryClick}
		variant={BtnVariant?.Transparent}
	>
		Retry
	</Button>
</section>
