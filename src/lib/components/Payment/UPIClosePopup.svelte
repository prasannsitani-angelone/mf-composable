<script lang="ts">
	// import MessageIcon from '@/assets/images/icons/MessageIcon.vue';
	import CrossInCircleIcon from '$lib/images/icons/CrossInCircleIcon.svelte';
	import Modal from '$components/Modal.svelte';
	import Button from '$components/Button.svelte';

	export let onClose = (): void => undefined;
	export let onConfirm = (): void => undefined;
</script>

<Modal isModalOpen>
	<div
		class="flex w-full flex-col items-center justify-between overflow-y-auto rounded-t-lg bg-white shadow-clg sm:w-120 sm:rounded-lg"
	>
		<div
			class="mb-10 hidden w-full flex-row items-center justify-between border-b border-grey-line px-8 py-6 sm:flex"
		>
			<div class="text-xl font-normal text-black-title">Cancel UPI payment verification?</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={onClose} class="cursor-pointer">
				<CrossInCircleIcon />
			</div>
		</div>
		<div class="flex w-full px-4 py-4 text-lg font-normal text-black-title sm:hidden">
			Close UPI payment verification?
		</div>

		<div class="mb-10 flex w-full flex-col px-4 sm:px-8">
			<div class="mb-6 text-sm text-grey-body sm:text-base sm:text-black-title">
				You can still complete this payment from your UPI application after closing this window.
			</div>
			<div class="flex flex-row items-center rounded bg-grey px-4 py-3">
				<!-- <MessageIcon /> -->
				<div class="ml-4 text-xs font-normal text-grey-body sm:text-sm">
					You can always check the status in the
					<span class="text-black-title">Transaction Details</span>
					if you have approved payment
				</div>
			</div>
		</div>

		<div class="mb-8 flex w-full flex-1 flex-row gap-4 px-8">
			<Button class="flex flex-1" variant="outlined" onClick={onConfirm}>YES</Button>
			<Button class="flex flex-1" onClick={onClose}>NO</Button>
		</div>
	</div>
</Modal>
