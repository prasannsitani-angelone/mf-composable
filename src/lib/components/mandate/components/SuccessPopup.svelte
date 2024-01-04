<script lang="ts">
	import WmsIcon from '$components/WMSIcon.svelte';
	import Button from '$components/Button.svelte';
	import { addCommasToAmountString } from 'svelte-components';
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';

	export let mandateLimit: number;
	export let closeModal = () => '';
	export let onSubmit = (): void => undefined;
</script>

<ModalWithAnimation {closeModal} isModalOpen>
	<div
		class=" w-screen justify-between rounded-b-none rounded-t-2xl bg-white px-4 pb-3 pt-6 text-left sm:!w-[460px] sm:rounded-lg sm:px-16 sm:py-8"
	>
		<div class="flex flex-col items-center justify-between">
			<div class=""><WmsIcon width={92} height={92} name="success-tick-circle" /></div>
			<div class=" my-4 text-2xl font-normal text-black-title">Autopay Registered</div>
			<div class="mb-5 text-center text-sm font-normal text-grey-body">
				All future SIP payments will be automatically debited from your bank account on the monthly
				SIP date.
			</div>
			<div
				class=" mb-4 flex w-full items-center justify-center rounded bg-blue-background px-6 py-2"
			>
				<div class=" mr-1 text-sm font-normal text-grey-body">Autopay limit</div>
				<div class=" text-lg font-normal text-black-title">
					₹{addCommasToAmountString(mandateLimit)}
				</div>
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

			<Button class="w-full sm:w-48" onClick={onSubmit}>DONE</Button>
		</div>
	</div>
</ModalWithAnimation>

<style>
	.info-icon-container :global(.info-in-circle-dark-icon path) {
		stroke: #3f5bd9;
	}
	.info-icon-container :global(.info-in-circle-dark-icon circle) {
		stroke: #3f5bd9;
	}
</style>
