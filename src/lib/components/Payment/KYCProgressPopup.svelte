<script lang="ts">
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { Modal } from 'svelte-components';

	export let onClose: () => void = () => undefined;
	export let onSubmit: () => void = () => undefined;
</script>

<Modal isModalOpen on:backdropclicked={onClose}>
	<div class="rounded-t-2xl bg-white px-4 py-6 sm:w-120 sm:rounded-lg sm:p-12">
		<div class="text-lg font-medium text-black-title">KYC In Progress</div>
		<div class="py-6 text-sm text-grey-body">
			You cannot place this order as your KYC is currently in progress. Please place an order once
			your KYC is complete
		</div>
		<ButtonMedium on:click={onSubmit} class="w-full">OKAY</ButtonMedium>
	</div>
</Modal>
