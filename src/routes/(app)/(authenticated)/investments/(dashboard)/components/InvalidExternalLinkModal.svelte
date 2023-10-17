<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Modal, WMSIcon } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';

	export let openErrorModal = false;
	const dispatch = createEventDispatcher();

	const handleCloseModal = () => {
		dispatch('closeErrorModal');
	};

	const invalidLinkMessage = 'Invalid or Expired Link';
</script>

<Modal closeModal={handleCloseModal} isModalOpen={openErrorModal}>
	<div
		class="flex w-screen flex-col items-center justify-between rounded-b-none rounded-t-2xl bg-white px-10 pb-8 pt-6 text-center sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-10"
	>
		<div class="">
			<WMSIcon width={92} height={92} name="red-cross-circle" />
		</div>
		<div class="mb-3 mt-6 text-xl font-normal">Something went wrong!</div>

		<div class=" text-sm font-normal text-grey-body">
			{invalidLinkMessage}
		</div>

		<ButtonMedium class="mt-8 w-40 px-2" variant="outlined" onClick={handleCloseModal}
			>GOT IT</ButtonMedium
		>
	</div>
</Modal>
