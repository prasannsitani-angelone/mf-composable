<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Modal from '$components/Modal.svelte';
	import WmsIcon from '$components/WMSIcon.svelte';
	import Button from '$components/Button.svelte';

	export let closeModal = () => '';

	const goToManageAutopay = async () => {
		await goto(`${base}/autopay`);
	};
</script>

<Modal {closeModal} isModalOpen>
	<div
		class=" w-screen justify-between rounded-b-none rounded-t-2xl bg-white px-4 pb-3 pt-6 text-left sm:!w-[460px] sm:rounded-lg sm:px-20 sm:py-8"
	>
		<div class="flex flex-col items-center justify-between sm:px-16 sm:pb-4 sm:pt-10">
			<div class=""><WmsIcon width={92} height={92} name="success-tick-circle" /></div>
			<div class=" my-4 text-2xl font-medium text-black-title">Autopay Registered</div>
			<div class="mb-5 text-center text-sm font-normal text-grey-body">
				Autopay activation is in progress. It may take up to 7 days. Existing unliked and Future SIP
				payments will be automatically debited post activation.
			</div>
			<div
				class=" mb-4 flex w-full items-center justify-center rounded bg-blue-background px-6 py-2"
			>
				<div class=" mr-1 text-sm font-medium text-grey-body">Autopay limit</div>
				<div class=" text-lg font-medium text-black-title">₹1,00,000</div>
			</div>
			<div class=" mb-9 flex w-full items-center rounded bg-blue-background p-2">
				<div class="info-icon-container">
					<WmsIcon
						width={20}
						height={20}
						name="info-in-circle-dark"
						class="info-in-circle-dark-icon"
					/>
				</div>
				<div class="ml-3 text-sm font-normal text-grey-body">
					If your SIP order is already in progress, autopay will be used from the next instalment
				</div>
			</div>

			<Button class="w-full sm:w-48" onClick={goToManageAutopay}>DONE</Button>
		</div>
	</div>
</Modal>

<style>
	.info-icon-container :global(.info-in-circle-dark-icon path) {
		stroke: #3f5bd9;
	}
	.info-icon-container :global(.info-in-circle-dark-icon circle) {
		stroke: #3f5bd9;
	}
</style>
